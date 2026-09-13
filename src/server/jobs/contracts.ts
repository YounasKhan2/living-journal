import 'server-only'

/**
 * Stable queue names reserved by the architecture.
 * Phase 0E defines infrastructure contracts only; product jobs are introduced
 * in their owning phases and must not be enqueued before a worker exists.
 */
export const QUEUE_NAMES = {
  contentIngestion: 'content-ingestion',
  scheduledPublish: 'scheduled-publish',
  newsletterSend: 'newsletter-send',
  aiBackground: 'ai-background',
} as const

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES]

export const JOB_NAMES = {
  contentIngestion: 'ingest-source',
  scheduledPublish: 'publish-post',
  newsletterSend: 'send-campaign',
  aiBackground: 'run-ai-task',
} as const

export const DEFAULT_JOB_OPTIONS = Object.freeze({
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 1_000,
  },
  removeOnComplete: 100,
  removeOnFail: 500,
})
