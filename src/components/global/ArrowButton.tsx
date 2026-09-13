import type { ReactNode } from 'react'
import { ArrowUpRight } from 'phosphor-react'
import Link from 'next/link'

export function ArrowLink({ href, children, variant = 'dark' }: { href: string; children: ReactNode; variant?: 'dark' | 'light' | 'ghost' }) {
  return <Link className={`arrow-button arrow-button--${variant}`} href={href}><span>{children}</span><span className="arrow-button__icon"><ArrowUpRight size={16}/></span></Link>
}
