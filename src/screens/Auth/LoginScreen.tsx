'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, LockKey } from 'phosphor-react'
import { useRouter } from 'next/navigation'
import { Brand } from '../../components/global/Brand'

type LoginScreenProps = {
  returnTo: string
}

export function LoginScreen({ returnTo }: LoginScreenProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return

    setError('')
    setSubmitting(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnTo }),
      })

      const payload = await response.json().catch(() => ({})) as { error?: string; redirectTo?: string }
      if (!response.ok) {
        setError(payload.error || 'Unable to sign in right now.')
        return
      }

      router.replace(payload.redirectTo || '/admin')
      router.refresh()
    } catch {
      setError('Unable to sign in right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return <main className="auth-page">
    <section className="auth-panel" aria-labelledby="login-title">
      <div className="auth-panel__brand"><Brand/><span>Publisher</span></div>
      <div className="auth-panel__copy">
        <span className="eyebrow">Editorial access</span>
        <h1 id="login-title">Enter the newsroom.</h1>
        <p>Sign in with an authorized Living Journal editorial account.</p>
      </div>

      <form className="auth-form" onSubmit={submit} noValidate>
        <label>
          <span>Email</span>
          <input
            type="email"
            name="email"
            autoComplete="username"
            value={email}
            onChange={event => setEmail(event.target.value)}
            required
            maxLength={320}
          />
        </label>
        <label>
          <span>Password</span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            required
            maxLength={128}
          />
        </label>

        {error ? <p className="auth-form__error" role="alert">{error}</p> : null}

        <button className="auth-form__submit" type="submit" disabled={submitting}>
          <span>{submitting ? 'Signing in…' : 'Sign in'}</span>
          <ArrowRight size={18}/>
        </button>
      </form>

      <p className="auth-panel__security"><LockKey size={14}/> Private editorial workspace. No public registration.</p>
    </section>
    <aside className="auth-aside" aria-hidden="true">
      <span>THE LIVING JOURNAL</span>
      <strong>Ideas become editions here.</strong>
      <div className="auth-aside__index">01 / PUBLISHER</div>
    </aside>
  </main>
}
