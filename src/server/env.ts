import 'server-only'
import { z } from 'zod'

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required').refine(
    value => value.startsWith('postgresql://') || value.startsWith('postgres://'),
    'DATABASE_URL must be a PostgreSQL connection string',
  ),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required').refine(
    value => value.startsWith('redis://') || value.startsWith('rediss://'),
    'REDIS_URL must be a Redis connection string',
  ),
})

const parsed = serverEnvSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_URL: process.env.REDIS_URL,
})

if (!parsed.success) {
  const details = parsed.error.issues
    .map(issue => `${issue.path.join('.') || 'environment'}: ${issue.message}`)
    .join('; ')

  throw new Error(`Invalid server environment: ${details}`)
}

export const serverEnv = Object.freeze(parsed.data)
