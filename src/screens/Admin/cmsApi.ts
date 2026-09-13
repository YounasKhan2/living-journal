import type { Post } from '../../types/content'
import { slugify } from '../../utils/format'

type ApiError = { error?: string }

export type PostRevisionSummary = {
  id: string
  version: number
  createdAt: string
  createdBy: {
    id: string
    name: string
    email: string
  }
}

type PostPayload = {
  slug: string
  title: string
  dek: string
  categorySlug: string
  categoryName: string
  authorName: string
  readTime: string
  coverImageUrl: string | null
  featured: boolean
  trending: boolean
  seoTitle: string | null
  metaDescription: string | null
  tags: string[]
  sections: Post['sections']
}

function toPayload(post: Post): PostPayload {
  return {
    slug: post.slug || slugify(post.title),
    title: post.title,
    dek: post.dek,
    categorySlug: slugify(post.category),
    categoryName: post.category,
    authorName: post.author,
    readTime: post.readTime,
    coverImageUrl: post.image || null,
    featured: Boolean(post.featured),
    trending: Boolean(post.trending),
    seoTitle: post.seoTitle || null,
    metaDescription: post.metaDescription || null,
    tags: post.tags,
    sections: post.sections,
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({})) as T & ApiError
  if (!response.ok) throw new Error(payload.error || 'CMS request failed.')
  return payload
}

export async function listPosts() {
  const response = await fetch('/api/admin/posts', { cache: 'no-store' })
  const payload = await parseResponse<{ posts: Post[] }>(response)
  return payload.posts
}

export async function getPost(id: string) {
  const response = await fetch(`/api/admin/posts/${encodeURIComponent(id)}`, { cache: 'no-store' })
  const payload = await parseResponse<{ post: Post }>(response)
  return payload.post
}

export async function createPost(post: Post) {
  const response = await fetch('/api/admin/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toPayload(post)),
  })
  const payload = await parseResponse<{ post: Post }>(response)
  return payload.post
}

export async function updatePost(post: Post) {
  const response = await fetch(`/api/admin/posts/${encodeURIComponent(post.id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toPayload(post)),
  })
  const payload = await parseResponse<{ post: Post }>(response)
  return payload.post
}

export async function deletePost(id: string) {
  const response = await fetch(`/api/admin/posts/${encodeURIComponent(id)}`, { method: 'DELETE' })
  await parseResponse<{ ok: true }>(response)
}

export async function listPostRevisions(id: string) {
  const response = await fetch(`/api/admin/posts/${encodeURIComponent(id)}/revisions`, { cache: 'no-store' })
  const payload = await parseResponse<{ revisions: PostRevisionSummary[] }>(response)
  return payload.revisions
}

export async function restorePostRevision(id: string, revisionId: string) {
  const response = await fetch(`/api/admin/posts/${encodeURIComponent(id)}/revisions/${encodeURIComponent(revisionId)}/restore`, {
    method: 'POST',
  })
  const payload = await parseResponse<{ post: Post }>(response)
  return payload.post
}

const statusToServer = {
  draft: 'DRAFT',
  in_review: 'IN_REVIEW',
  scheduled: 'SCHEDULED',
  published: 'PUBLISHED',
  archived: 'ARCHIVED',
} as const

export async function transitionPost(id: string, status: Post['status'], scheduledAt?: string) {
  const response = await fetch(`/api/admin/posts/${encodeURIComponent(id)}/transition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: statusToServer[status], scheduledAt }),
  })
  await parseResponse<{ post: unknown }>(response)
}
