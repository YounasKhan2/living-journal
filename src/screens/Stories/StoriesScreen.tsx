'use client'

import { useMemo, useState } from 'react'
import { useContent } from '../../context/ContentContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { StoriesGrid } from './components/StoriesGrid'

export function StoriesScreen() {
  useDocumentTitle('Stories')
  const { publishedPosts } = useContent()
  const [filter, setFilter] = useState('All')
  const filters = ['All', ...Array.from(new Set(publishedPosts.map(post => post.category)))]
  const visible = useMemo(() => filter === 'All' ? publishedPosts : publishedPosts.filter(post => post.category === filter), [filter, publishedPosts])

  return <main className="archive-page page-gutter page-top">
    <header className="page-intro"><span className="eyebrow">The archive</span><h1>Stories for people<br/><span className="serif">building what’s next.</span></h1><p>Daily analysis, practical field notes and independent perspective across technology, products and modern work.</p></header>
    <div className="filter-tabs" role="group" aria-label="Filter stories">{filters.map(item => <button className={item === filter ? 'is-active' : ''} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
    <StoriesGrid posts={visible}/>
  </main>
}
