import { Article, ChartBar, Gear, House, PlusCircle, SignOut, Users } from 'phosphor-react'
import { NavLink, Outlet } from 'react-router-dom'
import { Brand } from '../../../components/global/Brand'

const items = [
  { to: '/admin', label: 'Overview', icon: ChartBar, end: true },
  { to: '/admin/posts', label: 'Posts', icon: Article },
  { to: '/admin/posts/new', label: 'New story', icon: PlusCircle },
  { to: '/admin/audience', label: 'Audience', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Gear },
]

export function AdminLayout() {
  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand"><Brand/><span>Publisher</span></div>
      <nav>{items.map(item => { const Icon = item.icon; return <NavLink end={item.end} key={item.to} to={item.to}><Icon size={18}/><span>{item.label}</span></NavLink> })}</nav>
      <div className="admin-sidebar__bottom"><NavLink to="/"><House size={18}/><span>View website</span></NavLink><button type="button"><SignOut size={18}/><span>Sign out</span></button></div>
    </aside>
    <main className="admin-main"><Outlet/></main>
  </div>
}
