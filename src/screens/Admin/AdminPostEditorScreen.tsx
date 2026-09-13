'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Post, PostStatus } from '../../types/content'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { AdminHeader } from './components/AdminHeader'
import { PostEditor } from './components/PostEditor'
import { RevisionHistory } from './components/RevisionHistory'
import {
  createPost,
  getPost,
  listPostRevisions,
  restorePostRevision,
  transitionPost,
  updatePost,
  type PostRevisionSummary,
} from './cmsApi'

export function AdminPostEditorScreen({ id }: { id?: string }) {
  const router = useRouter()
  const [existing, setExisting] = useState<Post | undefined>()
  const [loading, setLoading] = useState(Boolean(id))
  const [loadError, setLoadError] = useState('')
  const [revisions, setRevisions] = useState<PostRevisionSummary[]>([])
  const [revisionsLoading, setRevisionsLoading] = useState(Boolean(id))
  const [pendingRevisionId, setPendingRevisionId] = useState('')
  const isEditing = Boolean(id)
  useDocumentTitle(isEditing ? 'Edit story' : 'New story')

  const refreshRevisions = useCallback(async () => {
    if (!id) return
    setRevisionsLoading(true)
    try {
      setRevisions(await listPostRevisions(id))
    } finally {
      setRevisionsLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setLoadError('')

    void Promise.all([getPost(id), listPostRevisions(id)])
      .then(([post, revisionList]) => {
        if (cancelled) return
        setExisting(post)
        setRevisions(revisionList)
      })
      .catch(error => { if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Unable to load the story.') })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
        setRevisionsLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  async function handleSave(post: Post) {
    if (id) {
      const saved = await updatePost({ ...post, id })
      setExisting(saved)
      await refreshRevisions()
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
    await refreshRevisions()
    router.refresh()
  }

  async function handleRestore(revision: PostRevisionSummary) {
    if (!id || pendingRevisionId) return
    if (!window.confirm(`Restore version ${revision.version} as a new draft? The current history will be preserved.`)) return

    setPendingRevisionId(revision.id)
    setLoadError('')
    try {
      const restored = await restorePostRevision(id, revision.id)
      setExisting(restored)
      await refreshRevisions()
      router.refresh()
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Unable to restore this revision.')
    } finally {
      setPendingRevisionId('')
    }
  }

  return <div className="admin-screen admin-screen--editor">
    <AdminHeader eyebrow="Content" title={isEditing ? 'Edit story' : 'New story'} description={isEditing ? 'Edit the story and move it through the controlled publishing workflow.' : 'Create a durable draft, then move it through review and publishing.'}/>
    {loading ? <div className="admin-card admin-empty">Loading story…</div> : loadError ? <p className="admin-notice admin-notice--error" role="alert">{loadError}</p> : id && !existing ? <div className="admin-card admin-empty">Story not found.</div> : <>
      <PostEditor key={existing ? `${existing.id}:${existing.status}:${existing.scheduledAt ?? ''}:${revisions[0]?.id ?? ''}` : 'new'} initialPost={existing} onSave={handleSave} onTransition={id ? handleTransition : undefined}/>
      {id ? <div className="post-editor__history"><RevisionHistory revisions={revisions} loading={revisionsLoading} pendingRevisionId={pendingRevisionId} onRestore={handleRestore}/></div> : null}
    </>}
  </div>
}
