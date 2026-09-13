import { ArrowUpRight } from 'phosphor-react'
import Link from 'next/link'
import type { Post } from '../../../types/content'
import { ArrowLink } from '../../../components/global/ArrowButton'

export function Hero({ post }: { post: Post }) {
  return <section className="home-hero page-gutter">
    <div className="hero-orbit hero-orbit--one" aria-hidden="true"/>
    <div className="hero-orbit hero-orbit--two" aria-hidden="true"/>
    <div className="hero-grid" aria-hidden="true"/>
    <div className="home-hero__copy">
      <span className="eyebrow hero-reveal">Independent daily perspective</span>
      <h1><span className="hero-line">Ideas worth</span><br/><span className="hero-line serif">your attention.</span></h1>
      <p className="hero-reveal">A calm publication about artificial intelligence, software, business and the people shaping what comes next.</p>
      <div className="hero-reveal"><ArrowLink href={`/stories/${post.slug}`}>Read today’s story</ArrowLink></div>
    </div>
    <Link className="home-hero__feature hero-media" href={`/stories/${post.slug}`}>
      <div className="home-hero__image-wrap"><img src={post.image} alt=""/></div>
      <div className="home-hero__feature-meta"><span>{post.category}</span><span>{post.readTime}</span></div>
      <div className="home-hero__feature-title"><h2>{post.title}</h2><span><ArrowUpRight size={20}/></span></div>
    </Link>
    <div className="home-hero__index hero-reveal"><span>Vol. 01</span><span className="home-hero__index-center">Scroll to read <i/></span><span>Daily digital journal</span></div>
  </section>
}
