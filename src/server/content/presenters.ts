import { Prisma } from '../../generated/prisma/client'
import type { Post as UiPost, ArticleSection, PostStatus } from '../../types/content'
import { articleSectionSchema } from './schemas'

type DbPost = Prisma.PostGetPayload<{
  include: {
    category: true
    coverMedia: true
    tags: { include: { tag: true } }
  }
}>

const statusMap: Record<'DRAFT' | 'IN_REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED', PostStatus> = {
  DRAFT: 'draft',
  IN_REVIEW: 'in_review',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
}

function sectionsFromJson(value: Prisma.JsonValue): ArticleSection[] {
  const parsed = articleSectionSchema.array().safeParse(value)
  return parsed.success ? parsed.data : []
}

function formatPublishedDate(date: Date | null, fallback: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date ?? fallback)
}

export function toUiPost(post: DbPost): UiPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    dek: post.dek,
    category: post.category.name,
    date: formatPublishedDate(post.publishedAt, post.createdAt),
    readTime: post.readTime,
    image: post.coverImageUrl ?? post.coverMedia?.url ?? '',
    imageAlt: post.coverMedia?.altText ?? undefined,
    imageAttribution: post.coverMedia?.attribution ?? undefined,
    coverMediaId: post.coverMediaId ?? undefined,
    author: post.authorName,
    featured: post.featured,
    trending: post.trending,
    status: statusMap[post.status],
    tags: post.tags.map(item => item.tag.name),
    seoTitle: post.seoTitle ?? undefined,
    metaDescription: post.metaDescription ?? undefined,
    scheduledAt: post.scheduledAt?.toISOString(),
    sections: sectionsFromJson(post.body),
  }
}
