import 'server-only'
import IORedis from 'ioredis'
import { serverEnv } from '../env'

type RedisGlobal = typeof globalThis & {
  __livingJournalRedis?: IORedis
}

const redisGlobal = globalThis as RedisGlobal

function createRedisClient() {
  return new IORedis(serverEnv.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: true,
  })
}

export const redis = redisGlobal.__livingJournalRedis ?? createRedisClient()

if (process.env.NODE_ENV !== 'production') {
  redisGlobal.__livingJournalRedis = redis
}

export async function ensureRedisConnected() {
  if (redis.status === 'wait') {
    await redis.connect()
  }

  if (redis.status !== 'ready') {
    await redis.ping()
  }

  return redis
}
