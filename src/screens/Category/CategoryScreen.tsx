'use client'

import { categories } from '../../content/categories'
import type { Post } from '../../types/content'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatCategorySlug } from '../../utils/format'
import { StoriesGrid } from '../Stories/components/StoriesGrid'

export function CategoryScreen({ slug, posts: allPosts }: { slug: string; posts: Post[] }) {
  const category = categories.find(item => item.slug === slug)
  const posts = allPosts.filter(post => formatCategorySlug(post.category) === slug || (slug === 'ai' && post.category === 'Artificial Intelligence'))
  useDocumentTitle(category?.name ?? 'Category')

  return <main className="archive-page page-gutter page-top">
    <header className="page-intro page-intro--category"><span className="eyebrow">Topic</span><h1>{category?.name ?? slug}</h1><p>{category?.description ?? 'A collection of independent stories and field notes.'}</p><span className="page-intro__count">{posts.length} {posts.length === 1 ? 'story' : 'stories'}</span></header>
    <StoriesGrid posts={posts}/>
  </main>
}
