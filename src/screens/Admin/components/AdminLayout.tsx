'use client'

import { useState, type ReactNode } from 'react'
import { Article, ChartBar, Gear, House, PlusCircle, SignOut, Users } from 'phosphor-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Brand } from '../../../components/global/Brand'

type AdminUser = {
  name: string
  email: string
  role: 'ADMIN' | 'EDITOR'
}

const items = [
  { href: '/admin', label: 'Overview', icon: ChartBar, exact: true },
  { href: '/admin/posts', label: 'Posts', icon: Article },
  { href: '/admin/posts/new', label: 'New story', icon: PlusCircle },
  { href: '/admin/audience', label: 'Audience', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Gear, adminOnly: true },
]

export function AdminLayout({ children, user }: { children: ReactNode; user: AdminUser }) {
  const pathname = usePathname()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const visibleItems = items.filter(item => !item.adminOnly || user.role === 'ADMIN')

  async function signOut() {
    if (signingOut) return
    setSigningOut(true)

    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' })
      const payload = await response.json().catch(() => ({})) as { redirectTo?: string }
      router.replace(payload.redirectTo || '/login')
      router.refresh()
    } finally {
      setSigningOut(false)
    }
  }

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand"><Brand/><span>Publisher</span></div>
      <div className="admin-sidebar__identity">
        <strong>{user.name}</strong>
        <span>{user.role === 'ADMIN' ? 'Administrator' : 'Editor'}</span>
      </div>
      <nav>{visibleItems.map(item => { const Icon = item.icon; const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`); return <Link className={active ? 'active' : undefined} key={item.href} href={item.href}><Icon size={18}/><span>{item.label}</span></Link> })}</nav>
      <div className="admin-sidebar__bottom"><Link href="/"><House size={18}/><span>View website</span></Link><button type="button" onClick={signOut} disabled={signingOut}><SignOut size={18}/><span>{signingOut ? 'Signing out…' : 'Sign out'}</span></button></div>
    </aside>
    <main className="admin-main">{children}</main>
  </div>
}
