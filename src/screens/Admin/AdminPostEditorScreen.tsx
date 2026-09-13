'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Post, PostStatus } from '../../types/content'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { AdminHeader } from './components/AdminHeader'
import { PostEditor } from './components/PostEditor'
import { createPost, getPost, transitionPost, updatePost } from './cmsApi'

export function AdminPostEditorScreen({ id }: { id?: string }) {
  const router = useRouter()
  const [existing, setExisting] = useState<Post | undefined>()
  const [loading, setLoading] = useState(Boolean(id))
  const [loadError, setLoadError] = useState('')
  const isEditing = Boolean(id)
  useDocumentTitle(isEditing ? 'Edit story' : 'New story')

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setLoadError('')

    void getPost(id)
      .then(post => { if (!cancelled) setExisting(post) })
      .catch(error => { if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Unable to load the story.') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [id])

  async function handleSave(post: Post) {
    if (id) {
      const saved = await updatePost({ ...post, id })
      setExisting(saved)
      return
    }

    const created = await createPost(post)
    router.replace(`/admin/posts/${created.id}/edit`)
  }

  async function handleTransition(status: PostStatus, scheduledAt?: string) {
    if (!id) return
    await transitionPost(id, status, scheduledAt)
    const refreshed = await getPost(id)
    setExisting(refreshed)
    router.refresh()
  }

  return <div className="admin-screen admin-screen--editor">
    <AdminHeader eyebrow="Content" title={isEditing ? 'Edit story' : 'New story'} description={isEditing ? 'Edit the story and move it through the controlled publishing workflow.' : 'Create a durable draft, then move it through review and publishing.'}/>
    {loading ? <div className="admin-card admin-empty">Loading story…</div> : loadError ? <p className="admin-notice admin-notice--error" role="alert">{loadError}</p> : id && !existing ? <div className="admin-card admin-empty">Story not found.</div> : <PostEditor key={existing ? `${existing.id}:${existing.status}:${existing.scheduledAt ?? ''}` : 'new'} initialPost={existing} onSave={handleSave} onTransition={id ? handleTransition : undefined}/>} 
  </div>
}
