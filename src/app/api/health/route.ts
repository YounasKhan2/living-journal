export const dynamic = 'force-dynamic'
export function GET() { return Response.json({ status: 'ok', service: 'living-journal', runtime: 'nextjs', timestamp: new Date().toISOString() }) }
