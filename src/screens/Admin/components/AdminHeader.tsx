import type { ReactNode } from 'react'

export function AdminHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <header className="admin-header"><div><span>{eyebrow}</span><h1>{title}</h1>{description ? <p>{description}</p> : null}</div>{action ? <div>{action}</div> : null}</header>
}
