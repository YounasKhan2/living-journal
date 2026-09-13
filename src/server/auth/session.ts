import 'server-only'

import { cookies } from 'next/headers'
import { prisma } from '../db/prisma'
import { AUTH_SESSION_COOKIE } from './constants'
import { generateSessionToken, hashSessionToken, sessionExpiryFromNow } from './token'

export async function createSession(userId: string) {
  const rawToken = generateSessionToken()
  const tokenHash = hashSessionToken(rawToken)
  const expiresAt = sessionExpiryFromNow()

  await prisma.session.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  })

  const cookieStore = await cookies()
  cookieStore.set(AUTH_SESSION_COOKIE, rawToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  })

  return { expiresAt }
}

export async function readSession() {
  const cookieStore = await cookies()
  const rawToken = cookieStore.get(AUTH_SESSION_COOKIE)?.value
  if (!rawToken) return null

  const tokenHash = hashSessionToken(rawToken)
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  })

  if (!session) return null
  if (session.expiresAt <= new Date() || session.user.status !== 'ACTIVE') return null

  return session
}

export async function revokeCurrentSession() {
  const cookieStore = await cookies()
  const rawToken = cookieStore.get(AUTH_SESSION_COOKIE)?.value

  if (rawToken) {
    const tokenHash = hashSessionToken(rawToken)
    await prisma.session.deleteMany({ where: { tokenHash } })
  }

  cookieStore.delete(AUTH_SESSION_COOKIE)
}
