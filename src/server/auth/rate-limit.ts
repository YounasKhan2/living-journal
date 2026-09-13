import 'server-only'

import { createHash } from 'node:crypto'
import { ensureRedisConnected } from '../redis/client'

const WINDOW_SECONDS = 15 * 60
const NETWORK_LIMIT = 10
const IDENTIFIER_LIMIT = 5

function digest(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

function clientNetworkKey(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = request.headers.get('x-real-ip')?.trim()
  return digest(forwarded || realIp || 'unknown')
}

function identifierKey(normalizedEmail: string) {
  return `auth:login:identifier:${digest(normalizedEmail)}`
}

async function incrementWindow(key: string) {
  const redis = await ensureRedisConnected()
  const value = await redis.incr(key)
  if (value === 1) await redis.expire(key, WINDOW_SECONDS)
  const ttl = await redis.ttl(key)
  return { value, ttl: Math.max(ttl, 1) }
}

export async function checkNetworkLoginRateLimit(request: Request) {
  const network = await incrementWindow(`auth:login:network:${clientNetworkKey(request)}`)
  return {
    allowed: network.value <= NETWORK_LIMIT,
    retryAfterSeconds: network.ttl,
  }
}

export async function checkIdentifierLoginRateLimit(normalizedEmail: string) {
  const redis = await ensureRedisConnected()
  const key = identifierKey(normalizedEmail)
  const value = Number(await redis.get(key) ?? 0)
  const ttl = Math.max(await redis.ttl(key), 1)
  return {
    allowed: value < IDENTIFIER_LIMIT,
    retryAfterSeconds: ttl,
  }
}

export async function recordIdentifierLoginFailure(normalizedEmail: string) {
  return incrementWindow(identifierKey(normalizedEmail))
}

export async function clearIdentifierLoginFailures(normalizedEmail: string) {
  const redis = await ensureRedisConnected()
  await redis.del(identifierKey(normalizedEmail))
}
