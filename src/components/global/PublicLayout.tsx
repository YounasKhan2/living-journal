import { Outlet } from 'react-router-dom'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function PublicLayout() {
  return <div className="public-shell"><SiteHeader/><Outlet/><SiteFooter/></div>
}
