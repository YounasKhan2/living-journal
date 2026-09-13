import 'server-only'

function expectedOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!configured) return null

  try {
    return new URL(configured).origin
  } catch {
    return null
  }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  const expected = expectedOrigin()

  if (!origin || !expected || origin !== expected) {
    throw new Error('INVALID_ORIGIN')
  }
}
