'use client'

import { ArrowUpRight, Plus } from 'phosphor-react'
import Link from 'next/link'
import { useContent } from '../../context/ContentContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { AdminHeader } from './components/AdminHeader'

export function AdminDashboardScreen() {
  useDocumentTitle('Publisher dashboard')
  const { posts, subscribers } = useContent()
  const published = posts.filter(post => post.status === 'published')
  const drafts = posts.filter(post => post.status === 'draft')
  return <div className="admin-screen"><AdminHeader eyebrow="Publisher" title="Good morning." description="Everything you need to run today’s edition." action={<Link className="admin-button" href="/admin/posts/new"><Plus size={17}/>New story</Link>}/><section className="admin-metrics"><article><span>Published</span><strong>{published.length}</strong><small>live stories</small></article><article><span>Drafts</span><strong>{drafts.length}</strong><small>waiting for review</small></article><article><span>Subscribers</span><strong>{subscribers.length}</strong><small>newsletter audience</small></article><article><span>Revenue</span><strong>$0</strong><small>connect analytics</small></article></section><section className="admin-card"><div className="admin-card__heading"><div><span>Recent content</span><h2>Latest stories</h2></div><Link href="/admin/posts">Manage all <ArrowUpRight size={16}/></Link></div><div className="admin-post-list">{posts.slice(0, 6).map(post => <Link key={post.id} href={`/admin/posts/${post.id}/edit`}><img src={post.image} alt=""/><div><strong>{post.title}</strong><span>{post.category} · {post.status}</span></div><span>{post.date}</span><ArrowUpRight size={18}/></Link>)}</div></section></div>
}
