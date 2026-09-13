import 'server-only'

import { JOB_NAMES, QUEUE_NAMES } from './contracts'
import { getQueue } from './queue'

export const scheduledPublishJobId = (postId: string) => `publish-post-${postId}`

export async function schedulePublishJob(postId: string, scheduledAt: Date) {
  const queue = getQueue(QUEUE_NAMES.scheduledPublish)
  const jobId = scheduledPublishJobId(postId)
  const existing = await queue.getJob(jobId)
  if (existing) await existing.remove().catch(() => undefined)

  return queue.add(
    JOB_NAMES.scheduledPublish,
    { postId, scheduledAt: scheduledAt.toISOString() },
    {
      jobId,
      delay: Math.max(0, scheduledAt.getTime() - Date.now()),
    },
  )
}

export async function cancelScheduledPublishJob(postId: string) {
  const queue = getQueue(QUEUE_NAMES.scheduledPublish)
  const job = await queue.getJob(scheduledPublishJobId(postId))
  if (job) await job.remove().catch(() => undefined)
}
