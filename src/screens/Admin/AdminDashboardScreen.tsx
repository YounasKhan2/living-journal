'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Plus } from 'phosphor-react'
import Link from 'next/link'
import type { Post } from '../../types/content'
import { useContent } from '../../context/ContentContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { AdminHeader } from './components/AdminHeader'
import { listPosts } from './cmsApi'

export function AdminDashboardScreen() {
  useDocumentTitle('Publisher dashboard')
  const { subscribers } = useContent()
  const [posts, setPosts] = useState<Post[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    void listPosts().then(setPosts).catch(cause => setError(cause instanceof Error ? cause.message : 'Unable to load content metrics.'))
  }, [])

  const published = posts.filter(post => post.status === 'published')
  const drafts = posts.filter(post => post.status === 'draft' || post.status === 'in_review')

  return <div className="admin-screen">
    <AdminHeader eyebrow="Publisher" title="Good morning." description="Everything you need to run today’s edition." action={<Link className="admin-button" href="/admin/posts/new"><Plus size={17}/>New story</Link>}/>
    {error ? <p className="admin-notice admin-notice--error" role="alert">{error}</p> : null}
    <section className="admin-metrics"><article><span>Published</span><strong>{published.length}</strong><small>live stories</small></article><article><span>Drafts / review</span><strong>{drafts.length}</strong><small>editorial queue</small></article><article><span>Subscribers</span><strong>{subscribers.length}</strong><small>newsletter demo audience</small></article><article><span>Revenue</span><strong>$0</strong><small>connect analytics</small></article></section>
    <section className="admin-card"><div className="admin-card__heading"><div><span>Recent content</span><h2>Latest stories</h2></div><Link href="/admin/posts">Manage all <ArrowUpRight size={16}/></Link></div><div className="admin-post-list">{posts.slice(0, 6).map(post => <Link key={post.id} href={`/admin/posts/${post.id}/edit`}>{post.image ? <img src={post.image} alt=""/> : <div className="admin-table__placeholder"/>}<div><strong>{post.title}</strong><span>{post.category} · {post.status.replace('_', ' ')}</span></div><span>{post.date}</span><ArrowUpRight size={18}/></Link>)}</div></section>
  </div>
}
