import { prisma } from '../../../../server/db/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startedAt = Date.now()

  try {
    await prisma.$queryRaw`SELECT 1`

    return Response.json({
      status: 'ok',
      service: 'living-journal',
      dependency: 'postgresql',
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Database health check failed', error)

    return Response.json({
      status: 'error',
      service: 'living-journal',
      dependency: 'postgresql',
      timestamp: new Date().toISOString(),
    }, { status: 503 })
  }
}
