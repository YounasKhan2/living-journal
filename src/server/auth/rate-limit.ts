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

async function incrementWindow(key: string) {
  const redis = await ensureRedisConnected()
  const value = await redis.incr(key)
  if (value === 1) await redis.expire(key, WINDOW_SECONDS)
  const ttl = await redis.ttl(key)
  return { value, ttl: Math.max(ttl, 1) }
}

export async function checkLoginRateLimit(request: Request, normalizedEmail: string) {
  const network = await incrementWindow(`auth:login:network:${clientNetworkKey(request)}`)
  const identifier = await incrementWindow(`auth:login:identifier:${digest(normalizedEmail)}`)

  const allowed = network.value <= NETWORK_LIMIT && identifier.value <= IDENTIFIER_LIMIT
  return {
    allowed,
    retryAfterSeconds: Math.max(network.ttl, identifier.ttl),
  }
}
