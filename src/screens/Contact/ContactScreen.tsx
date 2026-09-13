'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'phosphor-react'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export function ContactScreen() {
  useDocumentTitle('Contact')
  const [sent, setSent] = useState(false)
  const submit = (event: FormEvent) => { event.preventDefault(); setSent(true) }
  return <main className="contact-page page-gutter page-top"><header className="page-intro"><span className="eyebrow">Contact</span><h1>Send a note.<br/><span className="serif">We read every one.</span></h1></header><div className="contact-layout"><div><p>Have a story tip, correction, partnership idea or something worth discussing? Use the form and route it to the right desk.</p><div className="contact-note"><span>Editorial</span><p>Story ideas, corrections and source material.</p></div><div className="contact-note"><span>Commercial</span><p>Sponsorships, advertising and brand partnerships.</p></div></div><form className="contact-form" onSubmit={submit}><label>Name<input required name="name" placeholder="Your name"/></label><label>Email<input required type="email" name="email" placeholder="you@email.com"/></label><label>Topic<select name="topic"><option>Editorial</option><option>Advertising</option><option>Partnership</option><option>Other</option></select></label><label>Message<textarea required name="message" rows={6} placeholder="Tell us what you have in mind."/></label><button type="submit">Send message <ArrowRight size={16}/></button>{sent ? <p role="status">Message captured in this demo. Connect this form to your email API before launch.</p> : null}</form></div></main>
}
