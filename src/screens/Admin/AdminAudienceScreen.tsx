'use client'

import { useContent } from '../../context/ContentContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { AdminHeader } from './components/AdminHeader'

export function AdminAudienceScreen() {
  useDocumentTitle('Audience')
  const { subscribers } = useContent()
  return <div className="admin-screen"><AdminHeader eyebrow="Audience" title="Subscribers" description="Newsletter signups captured by the reusable subscription form."/><section className="admin-card"><div className="subscriber-list">{subscribers.length ? subscribers.map((email, index) => <div key={email}><span>{String(index + 1).padStart(2, '0')}</span><strong>{email}</strong><span>Active</span></div>) : <p className="admin-empty">No subscribers yet. Use the public newsletter form to test the flow.</p>}</div></section></div>
}
