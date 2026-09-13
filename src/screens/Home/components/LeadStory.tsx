import Link from 'next/link'
import { ArrowUpRight } from 'phosphor-react'
import type { Post } from '../../../types/content'

export function LeadStory({ post }: { post: Post }) {
  return <section className="lead-story page-gutter section-space reveal">
    <div className="lead-story__top"><span>Today’s edition</span><span>{post.date}</span></div>
    <div className="lead-story__grid">
      <div className="lead-story__copy">
        <span className="eyebrow">The lead story</span>
        <h2>{post.title}</h2>
        <p>{post.dek}</p>
        <Link href={`/stories/${post.slug}`} className="text-link">Continue reading <ArrowUpRight size={16}/></Link>
      </div>
      <Link href={`/stories/${post.slug}`} className="lead-story__media"><img src={post.image} alt="" loading="lazy"/></Link>
    </div>
  </section>
}
