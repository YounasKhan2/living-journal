'use client'

import { useEffect, useState } from 'react'
import { PencilSimple, Plus, Trash } from 'phosphor-react'
import Link from 'next/link'
import type { Post } from '../../types/content'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { AdminHeader } from './components/AdminHeader'
import { deletePost, listPosts } from './cmsApi'

const statusLabel: Record<Post['status'], string> = {
  draft: 'Draft',
  in_review: 'In review',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
}

export function AdminPostsScreen() {
  useDocumentTitle('Manage posts')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      setPosts(await listPosts())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to load posts.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  async function remove(post: Post) {
    if (post.status !== 'draft') return
    if (!window.confirm(`Delete “${post.title}”?`)) return

    try {
      await deletePost(post.id)
      setPosts(current => current.filter(item => item.id !== post.id))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to delete the post.')
    }
  }

  return <div className="admin-screen">
    <AdminHeader eyebrow="Content" title="Posts" description="Create, review and publish durable stories from one place." action={<Link className="admin-button" href="/admin/posts/new"><Plus size={17}/>New story</Link>}/>
    {error ? <p className="admin-notice admin-notice--error" role="alert">{error}</p> : null}
    <section className="admin-card admin-table-card">
      {loading ? <div className="admin-empty">Loading stories…</div> : posts.length === 0 ? <div className="admin-empty">No stories yet. Create the first durable draft.</div> : <div className="admin-table">
        <div className="admin-table__head"><span>Story</span><span>Status</span><span>Date</span><span>Actions</span></div>
        {posts.map(post => <div className="admin-table__row" key={post.id}>
          <div className="admin-table__story">{post.image ? <img src={post.image} alt=""/> : <div className="admin-table__placeholder"/>}<div><strong>{post.title}</strong><span>{post.category}</span></div></div>
          <span><i className={`status-dot status-dot--${post.status}`}/>{statusLabel[post.status]}</span>
          <span>{post.date}</span>
          <div className="admin-table__actions">
            <Link aria-label={`Edit ${post.title}`} href={`/admin/posts/${post.id}/edit`}><PencilSimple size={17}/></Link>
            {post.status === 'draft' ? <button aria-label={`Delete ${post.title}`} onClick={() => void remove(post)}><Trash size={17}/></button> : null}
          </div>
        </div>)}
      </div>}
    </section>
  </div>
}
