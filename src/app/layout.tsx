import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import '../styles/tokens.css'
import '../styles/global.css'
import '../styles/polish.css'
import '../styles/auth.css'
import '../styles/cms.css'
import { ContentProvider } from '../context/ContentContext'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: 'The Living Journal', template: '%s — The Living Journal' },
  description: 'Independent stories on artificial intelligence, software, business and modern work.',
  applicationName: 'The Living Journal',
  openGraph: { type: 'website', siteName: 'The Living Journal', title: 'The Living Journal', description: 'Independent stories on artificial intelligence, software, business and modern work.' },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body><ContentProvider>{children}</ContentProvider></body></html>
}
