import 'server-only'

import { prisma } from '../db/prisma'

const postInclude = {
  category: true,
  coverMedia: true,
  tags: { include: { tag: true } },
} as const

export function listCmsPosts() {
  return prisma.post.findMany({
    include: postInclude,
    orderBy: { updatedAt: 'desc' },
  })
}

export function getCmsPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      ...postInclude,
      revisions: { orderBy: { version: 'desc' }, take: 20 },
    },
  })
}

export function listPublishedPosts(limit?: number) {
  return prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
    },
    include: postInclude,
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })
}

export function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
    },
    include: postInclude,
  })
}

export function listPublishedByCategory(categorySlug: string, limit?: number) {
  return prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
      category: { slug: categorySlug },
    },
    include: postInclude,
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })
}
