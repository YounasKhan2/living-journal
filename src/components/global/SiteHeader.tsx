import { useEffect, useState, type CSSProperties } from 'react'
import { List, MagnifyingGlass, X } from 'phosphor-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Brand } from './Brand'

const links = [
  ['Stories', '/stories'],
  ['AI', '/category/ai'],
  ['Development', '/category/development'],
  ['Business', '/category/business'],
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  return <>
    <header className="site-header">
      <Brand/>
      <nav className="site-header__nav" aria-label="Primary navigation">
        {links.map(([label, to]) => <NavLink key={to} to={to}>{label}</NavLink>)}
      </nav>
      <div className="site-header__actions">
        <Link className="icon-link" to="/search" aria-label="Search"><MagnifyingGlass size={18}/></Link>
        <Link className="subscribe-link" to="/newsletter">Subscribe</Link>
        <button className="menu-toggle" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><List size={22}/></button>
      </div>
    </header>
    <div className={`menu-overlay ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <button className="menu-overlay__close" aria-label="Close menu" onClick={() => setOpen(false)}><X size={24}/></button>
      <div className="menu-overlay__inner">
        <span className="eyebrow">Explore the journal</span>
        <nav aria-label="Mobile navigation">
          {[...links, ['Newsletter', '/newsletter'], ['About', '/about'], ['Contact', '/contact']].map(([label, to], index) => <Link key={to} to={to} style={{'--menu-index': index} as CSSProperties}>{label}</Link>)}
        </nav>
      </div>
    </div>
  </>
}
