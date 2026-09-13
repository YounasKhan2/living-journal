import { ensureRedisConnected, redis } from '../../../../server/redis/client'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startedAt = Date.now()

  try {
    await ensureRedisConnected()
    const pong = await redis.ping()

    return Response.json({
      status: pong === 'PONG' ? 'ok' : 'error',
      service: 'living-journal',
      dependency: 'redis',
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    }, { status: pong === 'PONG' ? 200 : 503 })
  } catch (error) {
    console.error('Redis health check failed', error)

    return Response.json({
      status: 'error',
      service: 'living-journal',
      dependency: 'redis',
      timestamp: new Date().toISOString(),
    }, { status: 503 })
  }
}
