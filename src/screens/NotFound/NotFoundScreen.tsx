'use client'

import { ArrowLink } from '../../components/global/ArrowButton'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function NotFoundScreen() {
  useDocumentTitle('Page not found')
  return <main className="not-found page-gutter"><span className="not-found__code">404</span><div><span className="eyebrow">Wrong turn</span><h1>This page slipped<br/><span className="serif">out of the edition.</span></h1><ArrowLink href="/">Return home</ArrowLink></div></main>
}
