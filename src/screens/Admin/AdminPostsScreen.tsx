import { PencilSimple, Plus, Trash } from 'phosphor-react'
import { Link } from 'react-router-dom'
import { useContent } from '../../context/ContentContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { AdminHeader } from './components/AdminHeader'

export function AdminPostsScreen() {
  useDocumentTitle('Manage posts')
  const { posts, deletePost } = useContent()
  return <div className="admin-screen"><AdminHeader eyebrow="Content" title="Posts" description="Create, edit and publish every story from one place." action={<Link className="admin-button" to="/admin/posts/new"><Plus size={17}/>New story</Link>}/><section className="admin-card admin-table-card"><div className="admin-table"><div className="admin-table__head"><span>Story</span><span>Status</span><span>Date</span><span>Actions</span></div>{posts.map(post => <div className="admin-table__row" key={post.id}><div className="admin-table__story"><img src={post.image} alt=""/><div><strong>{post.title}</strong><span>{post.category}</span></div></div><span><i className={`status-dot status-dot--${post.status}`}/>{post.status}</span><span>{post.date}</span><div className="admin-table__actions"><Link aria-label={`Edit ${post.title}`} to={`/admin/posts/${post.id}/edit`}><PencilSimple size={17}/></Link><button aria-label={`Delete ${post.title}`} onClick={() => { if (window.confirm(`Delete “${post.title}”?`)) deletePost(post.id) }}><Trash size={17}/></button></div></div>)}</div></section></div>
}
