import type { ReactNode } from 'react'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'
import { ScrollRestoration } from './ScrollRestoration'

export function PublicLayout({ children }: { children: ReactNode }) {
  return <div className="public-shell"><ScrollRestoration/><SiteHeader/><div className="public-content">{children}</div><SiteFooter/></div>
}
