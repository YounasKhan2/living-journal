'use client'

import { useRouter } from 'next/navigation'
import { useContent } from '../../context/ContentContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { AdminHeader } from './components/AdminHeader'
import { PostEditor } from './components/PostEditor'

export function AdminPostEditorScreen({ id }: { id?: string }) {
  const router = useRouter()
  const { posts, createPost, updatePost } = useContent()
  const existing = posts.find(post => post.id === id)
  const isEditing = Boolean(id && existing)
  useDocumentTitle(isEditing ? 'Edit story' : 'New story')

  const handleSave = (post: Parameters<typeof updatePost>[0]) => {
    if (isEditing) updatePost(post)
    else createPost(post)
    router.push('/admin/posts')
  }

  return <div className="admin-screen admin-screen--editor"><AdminHeader eyebrow="Content" title={isEditing ? 'Edit story' : 'New story'} description={isEditing ? 'Update the article, metadata and publishing state.' : 'Write, prepare and publish a new edition.'}/><PostEditor initialPost={existing} onSave={handleSave}/></div>
}
