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

  const now = new Date()
  if (session.expiresAt <= now || session.user.status !== 'ACTIVE') {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => undefined)
    cookieStore.delete(AUTH_SESSION_COOKIE)
    return null
  }

  if (now.getTime() - session.lastSeenAt.getTime() > 5 * 60 * 1000) {
    await prisma.session.update({
      where: { id: session.id },
      data: { lastSeenAt: now },
    }).catch(() => undefined)
  }

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
