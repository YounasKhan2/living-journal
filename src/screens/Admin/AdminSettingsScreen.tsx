'use client'

import { useState } from 'react'
import { useContent } from '../../context/ContentContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { AdminHeader } from './components/AdminHeader'

export function AdminSettingsScreen() {
  useDocumentTitle('Settings')
  const { resetDemoContent } = useContent()
  const [saved, setSaved] = useState(false)
  return <div className="admin-screen"><AdminHeader eyebrow="System" title="Settings" description="Publication-level defaults and temporary audience-demo controls."/><section className="settings-grid"><form className="admin-card settings-card" onSubmit={event => { event.preventDefault(); setSaved(true) }}><h2>Publication</h2><label>Publication name<input defaultValue="The Living Journal"/></label><label>Tagline<input defaultValue="Independent stories on technology and culture"/></label><label>Default author<input defaultValue="The Living Journal"/></label><label>Contact email<input type="email" defaultValue="editor@livingjournal.test"/></label><button className="admin-button" type="submit">Save settings</button>{saved ? <p role="status">Settings UI saved for this demo session; durable publication settings are a later configuration slice.</p> : null}</form><div className="admin-card settings-card"><h2>Audience demo data</h2><p>Newsletter subscribers remain a local demo until the audience/newsletter phase. Story content is now owned by the production CMS database path.</p><button className="admin-button admin-button--danger" type="button" onClick={() => { if (window.confirm('Reset local newsletter demo data?')) resetDemoContent() }}>Reset audience demo</button></div></section></div>
}
