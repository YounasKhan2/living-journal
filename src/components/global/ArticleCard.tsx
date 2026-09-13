import { ArrowUpRight } from 'phosphor-react'
import Link from 'next/link'
import type { Post } from '../../types/content'

export function ArticleCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return <Link href={`/stories/${post.slug}`} className={`article-card ${featured ? 'article-card--featured' : ''}`}>
    <div className="article-card__media"><img src={post.image} alt="" loading="lazy"/></div>
    <div className="article-card__meta"><span>{post.category}</span><span>{post.readTime}</span></div>
    <h3>{post.title}</h3>
    <p>{post.dek}</p>
    <span className="article-card__read">Read story <ArrowUpRight size={15}/></span>
  </Link>
}
