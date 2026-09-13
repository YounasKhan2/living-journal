import { NextResponse } from 'next/server'
import { recordAuthAudit } from '../../../../server/auth/audit'
import { assertSameOrigin } from '../../../../server/auth/csrf'
import { readSession, revokeCurrentSession } from '../../../../server/auth/session'

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
  } catch {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const session = await readSession()
  await revokeCurrentSession()

  if (session) {
    await recordAuthAudit({ event: 'LOGOUT', request, userId: session.userId })
  }

  return NextResponse.json({ ok: true, redirectTo: '/login' })
}
