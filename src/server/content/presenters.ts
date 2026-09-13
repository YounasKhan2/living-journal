import { Prisma } from '../../generated/prisma/client'
import type { Post as UiPost, ArticleSection } from '../../types/content'
import { articleSectionSchema } from './schemas'

type DbPost = Prisma.PostGetPayload<{
  include: {
    category: true
    tags: { include: { tag: true } }
  }
}>

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
    image: post.coverImageUrl ?? '',
    author: post.authorName,
    featured: post.featured,
    trending: post.trending,
    status: post.status === 'PUBLISHED' ? 'published' : 'draft',
    tags: post.tags.map(item => item.tag.name),
    seoTitle: post.seoTitle ?? undefined,
    metaDescription: post.metaDescription ?? undefined,
    sections: sectionsFromJson(post.body),
  }
}
