'use client'

import type { ReactNode } from 'react'
import { Article, ChartBar, Gear, House, PlusCircle, SignOut, Users } from 'phosphor-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brand } from '../../../components/global/Brand'

const items = [
  { href: '/admin', label: 'Overview', icon: ChartBar, exact: true },
  { href: '/admin/posts', label: 'Posts', icon: Article },
  { href: '/admin/posts/new', label: 'New story', icon: PlusCircle },
  { href: '/admin/audience', label: 'Audience', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Gear },
]

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand"><Brand/><span>Publisher</span></div>
      <nav>{items.map(item => { const Icon = item.icon; const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`); return <Link className={active ? 'active' : undefined} key={item.href} href={item.href}><Icon size={18}/><span>{item.label}</span></Link> })}</nav>
      <div className="admin-sidebar__bottom"><Link href="/"><House size={18}/><span>View website</span></Link><button type="button"><SignOut size={18}/><span>Sign out</span></button></div>
    </aside>
    <main className="admin-main">{children}</main>
  </div>
}
