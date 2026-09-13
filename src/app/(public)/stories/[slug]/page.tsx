import type { Metadata } from 'next'
import { StoryDetailScreen } from '../../../../screens/StoryDetail/StoryDetailScreen'
import { loadPublishedUiPosts } from '../../../../server/content/public'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const posts = await loadPublishedUiPosts()
  const post = posts.find(item => item.slug === slug)
  if (!post) return { title: 'Story' }

  return {
    title: post.seoTitle ?? post.title,
    description: post.metaDescription ?? post.dek,
    alternates: { canonical: `/stories/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.dek,
      images: post.image ? [post.image] : undefined,
    },
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const posts = await loadPublishedUiPosts()
  const post = posts.find(item => item.slug === slug)
  const categoryRelated = post ? posts.filter(item => item.id !== post.id && item.category === post.category).slice(0, 3) : []
  const fallback = post ? posts.filter(item => item.id !== post.id).slice(0, 3) : []
  return <StoryDetailScreen post={post} related={categoryRelated.length ? categoryRelated : fallback}/>
}
