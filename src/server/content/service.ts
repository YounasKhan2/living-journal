import 'server-only'

import { Prisma } from '../../generated/prisma/client'
import { prisma } from '../db/prisma'
import { slugify } from '../../utils/format'
import { normalizePostSlug } from './slug'
import { assertPostTransition } from './transitions'
import { postInputSchema, postPatchSchema, type PostInput, type PostPatch, type PostStatusValue } from './schemas'

function normalizeTagNames(tags: string[]) {
  const bySlug = new Map<string, string>()
  for (const name of tags) {
    const trimmed = name.trim()
    const slug = slugify(trimmed).slice(0, 80)
    if (slug && !bySlug.has(slug)) bySlug.set(slug, trimmed)
  }
  return [...bySlug.entries()].map(([slug, name]) => ({ slug, name }))
}

async function ensureCategory(tx: Prisma.TransactionClient, slugInput: string, nameInput?: string) {
  const slug = slugify(slugInput).slice(0, 120)
  if (!slug) throw new Error('INVALID_CATEGORY_SLUG')
  const name = (nameInput?.trim() || slug.replace(/-/g, ' ')).slice(0, 120)

  return tx.category.upsert({
    where: { slug },
    update: nameInput ? { name } : {},
    create: { slug, name },
  })
}

async function replaceTags(tx: Prisma.TransactionClient, postId: string, tags: string[]) {
  await tx.postTag.deleteMany({ where: { postId } })
  const normalized = normalizeTagNames(tags)
  for (const tagInput of normalized) {
    const tag = await tx.tag.upsert({
      where: { slug: tagInput.slug },
      update: { name: tagInput.name },
      create: tagInput,
    })
    await tx.postTag.create({ data: { postId, tagId: tag.id } })
  }
}

async function createRevision(tx: Prisma.TransactionClient, postId: string, userId: string) {
  const post = await tx.post.findUnique({
    where: { id: postId },
    include: { category: true, tags: { include: { tag: true } } },
  })
  if (!post) throw new Error('POST_NOT_FOUND')

  const aggregate = await tx.postRevision.aggregate({
    where: { postId },
    _max: { version: true },
  })

  const snapshot = {
    slug: post.slug,
    title: post.title,
    dek: post.dek,
    body: post.body,
    authorName: post.authorName,
    readTime: post.readTime,
    status: post.status,
    category: { slug: post.category.slug, name: post.category.name },
    coverImageUrl: post.coverImageUrl,
    coverMediaId: post.coverMediaId,
    featured: post.featured,
    trending: post.trending,
    seoTitle: post.seoTitle,
    metaDescription: post.metaDescription,
    scheduledAt: post.scheduledAt?.toISOString() ?? null,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    tags: post.tags.map(item => item.tag.name),
  }

  return tx.postRevision.create({
    data: {
      postId,
      version: (aggregate._max.version ?? 0) + 1,
      snapshot: snapshot as Prisma.InputJsonValue,
      createdById: userId,
    },
  })
}

export async function createPostDraft(rawInput: PostInput, userId: string) {
  const input = postInputSchema.parse(rawInput)
  const slug = normalizePostSlug(input.slug)

  const existing = await prisma.post.findUnique({ where: { slug }, select: { id: true } })
  if (existing) throw new Error('POST_SLUG_TAKEN')

  return prisma.$transaction(async tx => {
    const category = await ensureCategory(tx, input.categorySlug, input.categoryName)
    const post = await tx.post.create({
      data: {
        slug,
        title: input.title.trim(),
        dek: input.dek.trim(),
        body: input.sections as Prisma.InputJsonValue,
        authorName: input.authorName.trim(),
        readTime: input.readTime.trim(),
        categoryId: category.id,
        coverImageUrl: input.coverImageUrl ?? null,
        featured: input.featured,
        trending: input.trending,
        seoTitle: input.seoTitle?.trim() || null,
        metaDescription: input.metaDescription?.trim() || null,
        createdById: userId,
        updatedById: userId,
      },
    })

    await replaceTags(tx, post.id, input.tags)
    await createRevision(tx, post.id, userId)
    return tx.post.findUniqueOrThrow({
      where: { id: post.id },
      include: { category: true, tags: { include: { tag: true } } },
    })
  })
}

export async function updatePostDraft(postId: string, rawPatch: PostPatch, userId: string) {
  const patch = postPatchSchema.parse(rawPatch)

  return prisma.$transaction(async tx => {
    const current = await tx.post.findUnique({ where: { id: postId } })
    if (!current) throw new Error('POST_NOT_FOUND')
    if (current.status === 'ARCHIVED') throw new Error('ARCHIVED_POST_READ_ONLY')

    let categoryId = current.categoryId
    if (patch.categorySlug) {
      const category = await ensureCategory(tx, patch.categorySlug, patch.categoryName)
      categoryId = category.id
    }

    const nextSlug = patch.slug ? normalizePostSlug(patch.slug) : current.slug
    if (nextSlug !== current.slug) {
      const conflict = await tx.post.findUnique({ where: { slug: nextSlug }, select: { id: true } })
      if (conflict && conflict.id !== postId) throw new Error('POST_SLUG_TAKEN')
    }

    await tx.post.update({
      where: { id: postId },
      data: {
        slug: nextSlug,
        title: patch.title?.trim(),
        dek: patch.dek?.trim(),
        body: patch.sections ? patch.sections as Prisma.InputJsonValue : undefined,
        authorName: patch.authorName?.trim(),
        readTime: patch.readTime?.trim(),
        categoryId,
        coverImageUrl: patch.coverImageUrl === undefined ? undefined : patch.coverImageUrl,
        featured: patch.featured,
        trending: patch.trending,
        seoTitle: patch.seoTitle === undefined ? undefined : patch.seoTitle?.trim() || null,
        metaDescription: patch.metaDescription === undefined ? undefined : patch.metaDescription?.trim() || null,
        updatedById: userId,
      },
    })

    if (patch.tags) await replaceTags(tx, postId, patch.tags)
    await createRevision(tx, postId, userId)

    return tx.post.findUniqueOrThrow({
      where: { id: postId },
      include: { category: true, tags: { include: { tag: true } } },
    })
  })
}

export async function transitionPost(postId: string, nextStatus: PostStatusValue, userId: string, scheduledAtInput?: string) {
  return prisma.$transaction(async tx => {
    const current = await tx.post.findUnique({ where: { id: postId } })
    if (!current) throw new Error('POST_NOT_FOUND')

    assertPostTransition(current.status, nextStatus)

    const now = new Date()
    const scheduledAt = nextStatus === 'SCHEDULED'
      ? new Date(scheduledAtInput ?? '')
      : null

    if (nextStatus === 'SCHEDULED' && (Number.isNaN(scheduledAt?.getTime()) || scheduledAt! <= now)) {
      throw new Error('INVALID_SCHEDULE_TIME')
    }

    await tx.post.update({
      where: { id: postId },
      data: {
        status: nextStatus,
        scheduledAt,
        publishedAt: nextStatus === 'PUBLISHED' ? (current.publishedAt ?? now) : current.publishedAt,
        updatedById: userId,
      },
    })

    await createRevision(tx, postId, userId)
    return tx.post.findUniqueOrThrow({ where: { id: postId }, include: { category: true } })
  })
}

export async function deleteDraft(postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId }, select: { status: true } })
  if (!post) throw new Error('POST_NOT_FOUND')
  if (post.status !== 'DRAFT') throw new Error('ONLY_DRAFTS_CAN_BE_DELETED')
  await prisma.post.delete({ where: { id: postId } })
}
