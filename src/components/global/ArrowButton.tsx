import type { ReactNode } from 'react'
import { ArrowUpRight } from 'phosphor-react'
import { Link } from 'react-router-dom'

export function ArrowLink({ to, children, variant = 'dark' }: { to: string; children: ReactNode; variant?: 'dark' | 'light' | 'ghost' }) {
  return <Link className={`arrow-button arrow-button--${variant}`} to={to}><span>{children}</span><span className="arrow-button__icon"><ArrowUpRight size={16}/></span></Link>
}
