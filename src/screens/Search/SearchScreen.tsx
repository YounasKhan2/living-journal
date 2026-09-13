'use client'

import { ArrowUpRight, MagnifyingGlass } from 'phosphor-react'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useContent } from '../../context/ContentContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function SearchScreen() {
  useDocumentTitle('Search')
  const { publishedPosts } = useContent()
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return publishedPosts
    return publishedPosts.filter(post => [post.title, post.dek, post.category, post.tags.join(' ')].join(' ').toLowerCase().includes(term))
  }, [query, publishedPosts])

  return <main className="search-page page-gutter page-top">
    <header className="page-intro search-page__head"><span className="eyebrow">Search the journal</span><h1>Find the idea<br/><span className="serif">you came for.</span></h1><div className="search-field"><MagnifyingGlass size={22}/><label className="sr-only" htmlFor="site-search">Search stories</label><input id="site-search" autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search AI, React, careers..."/></div></header>
    <section className="search-results"><p>{results.length} {results.length === 1 ? 'result' : 'results'}</p>{results.map(post => <Link href={`/stories/${post.slug}`} key={post.id}><div><span>{post.category} · {post.readTime}</span><h2>{post.title}</h2><p>{post.dek}</p></div><ArrowUpRight size={24}/></Link>)}</section>
  </main>
}
