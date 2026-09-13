import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'phosphor-react'
import { useContent } from '../../context/ContentContext'

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const { subscribe } = useContent()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const added = subscribe(email)
    setMessage(added ? 'You are on the list.' : 'That email is already subscribed.')
    if (added) setEmail('')
  }

  return <form className={`newsletter-form ${compact ? 'newsletter-form--compact' : ''}`} onSubmit={submit}>
    <div className="newsletter-form__row">
      <label className="sr-only" htmlFor={compact ? 'newsletter-email-small' : 'newsletter-email'}>Email address</label>
      <input id={compact ? 'newsletter-email-small' : 'newsletter-email'} type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="you@email.com"/>
      <button type="submit" aria-label="Subscribe"><span>{compact ? 'Join' : 'Join the briefing'}</span><ArrowRight size={16}/></button>
    </div>
    {message ? <p className="newsletter-form__message" role="status">{message}</p> : null}
  </form>
}
