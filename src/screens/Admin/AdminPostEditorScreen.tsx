import { useNavigate, useParams } from 'react-router-dom'
import { useContent } from '../../context/ContentContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { AdminHeader } from './components/AdminHeader'
import { PostEditor } from './components/PostEditor'

export function AdminPostEditorScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { posts, createPost, updatePost } = useContent()
  const existing = posts.find(post => post.id === id)
  const isEditing = Boolean(id && existing)
  useDocumentTitle(isEditing ? 'Edit story' : 'New story')

  return <div className="admin-screen admin-screen--editor"><AdminHeader eyebrow="Content" title={isEditing ? 'Edit story' : 'New story'} description={isEditing ? 'Update the article, metadata and publishing state.' : 'Write, prepare and publish a new edition.'}/><PostEditor initialPost={existing} onSave={post => { isEditing ? updatePost(post) : createPost(post); navigate('/admin/posts') }}/></div>
}
