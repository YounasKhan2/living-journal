'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useContent } from '../../context/ContentContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { Hero } from './components/Hero'
import { LeadStory } from './components/LeadStory'
import { LatestStories } from './components/LatestStories'
import { EditorialRail } from './components/EditorialRail'
import { Trending } from './components/Trending'
import { NewsletterBand } from './components/NewsletterBand'
import { SignalTicker } from './components/SignalTicker'
import { BriefingGrid } from './components/BriefingGrid'

gsap.registerPlugin(ScrollTrigger)

export function HomeScreen() {
  useDocumentTitle('Independent stories on technology and culture')
  const root = useRef<HTMLElement>(null)
  const { publishedPosts } = useContent()
  const featured = publishedPosts.find(post => post.featured) ?? publishedPosts[0]

  useEffect(() => {
    const scope = root.current
    if (!scope || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const context = gsap.context(() => {
      gsap.from('.hero-line', { yPercent: 105, opacity: 0, duration: 1.05, stagger: 0.08, ease: 'power4.out' })
      gsap.from('.hero-reveal', { y: 24, opacity: 0, duration: 0.85, stagger: 0.08, delay: 0.2, ease: 'power3.out' })
      gsap.from('.hero-media', { y: 36, scale: 0.96, opacity: 0, duration: 1.1, delay: 0.15, ease: 'power4.out' })
      gsap.to('.home-hero__image-wrap img', { yPercent: 8, scale: 1.055, ease: 'none', scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: 1 } })
      gsap.to('.home-hero__copy', { yPercent: -5, ease: 'none', scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: 1 } })
      gsap.to('.hero-orbit--one', { rotate: 24, xPercent: 16, yPercent: -7, ease: 'none', scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: 1.1 } })
      gsap.to('.hero-orbit--two', { rotate: -18, xPercent: -10, yPercent: 15, ease: 'none', scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: 1.1 } })
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(element => gsap.from(element, { y: 42, opacity: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } }))
      gsap.to('.signal-ticker__track', { xPercent: -16, ease: 'none', scrollTrigger: { trigger: '.signal-ticker', start: 'top bottom', end: 'bottom top', scrub: 1 } })
      gsap.utils.toArray<HTMLElement>('.briefing-card__media img, .editorial-panel__media img').forEach(image => gsap.fromTo(image, { scale: 1.075 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: 0.8 } }))
      gsap.utils.toArray<HTMLElement>('.editorial-panel').forEach((panel, index) => gsap.from(panel, { y: index === 0 ? 0 : 70, opacity: index === 0 ? 1 : 0.35, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: panel, start: 'top 78%', once: true } }))
    }, scope)

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => { window.clearTimeout(refreshTimer); context.revert() }
  }, [publishedPosts.length])

  if (!featured) return <main className="empty-page page-gutter page-top"><h1>No published stories yet.</h1></main>
  const latest = publishedPosts.filter(post => post.id !== featured.id).slice(0, 4)

  return <main ref={root} className="home-canvas">
    <Hero post={featured}/><SignalTicker/><LeadStory post={featured}/><LatestStories posts={latest}/><BriefingGrid posts={latest}/><EditorialRail posts={publishedPosts.slice(0, 4)}/><Trending posts={publishedPosts.filter(post => post.trending).slice(0, 5)}/><NewsletterBand/>
  </main>
}
