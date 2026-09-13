import 'server-only'

import { createHash } from 'node:crypto'
import { prisma } from '../db/prisma'

export type AuditEvent = 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 'SESSION_REVOKED'

function digest(value: string | null | undefined) {
  return value ? createHash('sha256').update(value).digest('hex') : null
}

function networkFromRequest(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')?.trim()
    || null
}

export async function recordAuthAudit(input: {
  event: AuditEvent
  request?: Request
  userId?: string | null
  identifier?: string | null
}) {
  await prisma.authAudit.create({
    data: {
      event: input.event,
      userId: input.userId ?? null,
      identifierHash: digest(input.identifier),
      networkHash: digest(input.request ? networkFromRequest(input.request) : null),
    },
  }).catch(() => undefined)
}
