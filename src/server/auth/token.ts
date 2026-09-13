import 'server-only'

import { createHash, randomBytes } from 'node:crypto'
import { AUTH_SESSION_TOKEN_BYTES, AUTH_SESSION_TTL_HOURS } from './constants'

export function generateSessionToken() {
  return randomBytes(AUTH_SESSION_TOKEN_BYTES).toString('base64url')
}

export function hashSessionToken(token: string) {
  return createHash('sha256').update(token, 'utf8').digest('hex')
}

export function sessionExpiryFromNow(now = new Date()) {
  return new Date(now.getTime() + AUTH_SESSION_TTL_HOURS * 60 * 60 * 1000)
}
