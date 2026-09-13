'use client'

import { Clock } from 'phosphor-react'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useContent } from '../../context/ContentContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { ArticleBody } from './components/ArticleBody'
import { RelatedStories } from './components/RelatedStories'

export function StoryDetailScreen({ slug }: { slug: string }) {
  const { publishedPosts } = useContent()
  const post = publishedPosts.find(item => item.slug === slug)
  const progress = useRef<HTMLDivElement>(null)
  useDocumentTitle(post?.title ?? 'Story')

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const value = max > 0 ? window.scrollY / max : 0
      if (progress.current) progress.current.style.transform = `scaleX(${value})`
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  if (!post) return <main className="empty-page page-gutter"><span className="eyebrow">Not found</span><h1>This story is no longer available.</h1><Link className="text-link" href="/stories">Return to stories</Link></main>

  const related = publishedPosts.filter(item => item.id !== post.id && item.category === post.category).slice(0, 3)
  const fallback = publishedPosts.filter(item => item.id !== post.id).slice(0, 3)

  return <main className="story-detail">
    <div className="reading-progress" ref={progress}/>
    <header className="story-detail__hero page-gutter page-top">
      <div className="story-detail__head"><span className="eyebrow">{post.category}</span><h1>{post.title}</h1><p>{post.dek}</p><div className="story-meta"><span>{post.date}</span><span><Clock size={15}/> {post.readTime}</span><span>By {post.author}</span></div></div>
      <div className="story-detail__cover"><img src={post.image} alt=""/></div>
    </header>
    <ArticleBody sections={post.sections}/>
    <RelatedStories posts={related.length ? related : fallback}/>
  </main>
}
