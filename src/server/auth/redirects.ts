export function safeReturnTo(value: string | null | undefined, fallback = '/admin') {
  if (!value) return fallback
  if (!value.startsWith('/') || value.startsWith('//')) return fallback
  if (value.includes('\\')) return fallback

  try {
    const url = new URL(value, 'http://local.invalid')
    if (url.origin !== 'http://local.invalid') return fallback
    if (!url.pathname.startsWith('/admin')) return fallback
    if (url.pathname.split('/').some(segment => segment === '..')) return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}
