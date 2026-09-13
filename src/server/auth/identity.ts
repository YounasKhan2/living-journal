import { z } from 'zod'

const emailSchema = z.email().max(320)

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function parseNormalizedEmail(email: string) {
  return emailSchema.parse(normalizeEmail(email))
}
