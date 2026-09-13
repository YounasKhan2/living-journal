import type { Metadata } from 'next'
import { seedPosts } from '../../../../content/seedPosts'
import { StoryDetailScreen } from '../../../../screens/StoryDetail/StoryDetailScreen'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = seedPosts.find(item => item.slug === slug)
  if (!post) return { title: 'Story' }
  return { title: post.seoTitle ?? post.title, description: post.metaDescription ?? post.dek, alternates: { canonical: `/stories/${post.slug}` }, openGraph: { type: 'article', title: post.title, description: post.dek, images: [post.image] } }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <StoryDetailScreen slug={slug}/> }
