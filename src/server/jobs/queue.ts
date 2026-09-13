import 'server-only'
import { Queue } from 'bullmq'
import { redis } from '../redis/client'
import { DEFAULT_JOB_OPTIONS, type QueueName } from './contracts'

type QueueRegistry = Map<QueueName, Queue>
type QueueGlobal = typeof globalThis & {
  __livingJournalQueues?: QueueRegistry
}

const queueGlobal = globalThis as QueueGlobal
const queues = queueGlobal.__livingJournalQueues ?? new Map<QueueName, Queue>()

if (process.env.NODE_ENV !== 'production') {
  queueGlobal.__livingJournalQueues = queues
}

/**
 * Returns a singleton producer queue for a reserved queue name.
 * Workers are intentionally not created in Phase 0E.
 */
export function getQueue(name: QueueName) {
  const existing = queues.get(name)
  if (existing) return existing

  const queue = new Queue(name, {
    connection: redis,
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  })

  queues.set(name, queue)
  return queue
}
