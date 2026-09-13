import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '../../../../server/db/prisma'
import { recordAuthAudit } from '../../../../server/auth/audit'
import { assertSameOrigin } from '../../../../server/auth/csrf'
import { parseNormalizedEmail } from '../../../../server/auth/identity'
import { hashPassword, verifyPassword } from '../../../../server/auth/password'
import {
  checkIdentifierLoginRateLimit,
  checkNetworkLoginRateLimit,
  clearIdentifierLoginFailures,
  recordIdentifierLoginFailure,
} from '../../../../server/auth/rate-limit'
import { safeReturnTo } from '../../../../server/auth/redirects'
import { createSession } from '../../../../server/auth/session'

const loginSchema = z.object({
  email: z.string().min(1).max(320),
  password: z.string().min(1).max(128),
  returnTo: z.string().max(2048).optional(),
})

const INVALID_CREDENTIALS = 'Invalid email or password.'

export async function POST(request: Request) {
  try {
    assertSameOrigin(request)
  } catch {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const networkLimit = await checkNetworkLoginRateLimit(request).catch(() => null)
  if (!networkLimit) {
    return NextResponse.json({ error: 'Authentication service is temporarily unavailable.' }, { status: 503 })
  }
  if (!networkLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(networkLimit.retryAfterSeconds) } },
    )
  }

  const body = await request.json().catch(() => null)
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 400 })
  }

  let email: string
  try {
    email = parseNormalizedEmail(parsed.data.email)
  } catch {
    return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 })
  }

  const identifierLimit = await checkIdentifierLoginRateLimit(email).catch(() => null)
  if (!identifierLimit) {
    return NextResponse.json({ error: 'Authentication service is temporarily unavailable.' }, { status: 503 })
  }
  if (!identifierLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(identifierLimit.retryAfterSeconds) } },
    )
  }

  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || user.status !== 'ACTIVE') {
    await hashPassword('internal-timing-placeholder')
    await recordIdentifierLoginFailure(email).catch(() => undefined)
    await recordAuthAudit({ event: 'LOGIN_FAILURE', request, identifier: email })
    return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 })
  }

  const validPassword = await verifyPassword(user.passwordHash, parsed.data.password)
  if (!validPassword) {
    await recordIdentifierLoginFailure(email).catch(() => undefined)
    await recordAuthAudit({ event: 'LOGIN_FAILURE', request, userId: user.id, identifier: email })
    return NextResponse.json({ error: INVALID_CREDENTIALS }, { status: 401 })
  }

  await clearIdentifierLoginFailures(email).catch(() => undefined)
  await createSession(user.id)
  await recordAuthAudit({ event: 'LOGIN_SUCCESS', request, userId: user.id, identifier: email })

  return NextResponse.json({
    ok: true,
    redirectTo: safeReturnTo(parsed.data.returnTo),
  })
}
