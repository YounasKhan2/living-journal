import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { Queue, Worker, type Job } from 'bullmq'
import IORedis from 'ioredis'
import { PrismaClient, Prisma } from '../src/generated/prisma/client'

type ScheduledPublishPayload = {
  postId: string
  scheduledAt: string
}

const databaseUrl = process.env.DATABASE_URL
const redisUrl = process.env.REDIS_URL

if (!databaseUrl) throw new Error('DATABASE_URL is required')
if (!redisUrl) throw new Error('REDIS_URL is required')

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) })
const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null })
const producerConnection = new IORedis(redisUrl, { maxRetriesPerRequest: null })
const queue = new Queue<ScheduledPublishPayload>('scheduled-publish', { connection: producerConnection })

const jobIdFor = (postId: string) => `publish-post-${postId}`

async function ensureJob(postId: string, scheduledAt: Date) {
  const jobId = jobIdFor(postId)
  const existing = await queue.getJob(jobId)
  if (existing) return

  await queue.add(
    'publish-post',
    { postId, scheduledAt: scheduledAt.toISOString() },
    {
      jobId,
      delay: Math.max(0, scheduledAt.getTime() - Date.now()),
      attempts: 3,
      backoff: { type: 'exponential', delay: 1_000 },
      removeOnComplete: 100,
      removeOnFail: 500,
    },
  )
}

async function reconcileScheduledPosts() {
  const rows = await prisma.post.findMany({
    where: { status: 'SCHEDULED', scheduledAt: { not: null } },
    select: { id: true, scheduledAt: true },
  })

  for (const row of rows) {
    if (row.scheduledAt) await ensureJob(row.id, row.scheduledAt)
  }
}

async function publishScheduledPost(job: Job<ScheduledPublishPayload>) {
  const { postId } = job.data
  const now = new Date()

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { category: true, tags: { include: { tag: true } } },
  })

  if (!post || post.status !== 'SCHEDULED' || !post.scheduledAt) return { skipped: true, reason: 'not-scheduled' }

  if (post.scheduledAt > now) {
    await ensureJob(post.id, post.scheduledAt)
    return { skipped: true, reason: 'not-due' }
  }

  await prisma.$transaction(async tx => {
    const current = await tx.post.findUnique({
      where: { id: postId },
      include: { category: true, tags: { include: { tag: true } } },
    })

    if (!current || current.status !== 'SCHEDULED' || !current.scheduledAt || current.scheduledAt > now) return

    const updated = await tx.post.update({
      where: { id: postId },
      data: {
        status: 'PUBLISHED',
        publishedAt: current.publishedAt ?? now,
        scheduledAt: null,
      },
      include: { category: true, tags: { include: { tag: true } } },
    })

    const aggregate = await tx.postRevision.aggregate({
      where: { postId },
      _max: { version: true },
    })

    const snapshot = {
      slug: updated.slug,
      title: updated.title,
      dek: updated.dek,
      body: updated.body,
      authorName: updated.authorName,
      readTime: updated.readTime,
      status: updated.status,
      category: { slug: updated.category.slug, name: updated.category.name },
      coverImageUrl: updated.coverImageUrl,
      coverMediaId: updated.coverMediaId,
      featured: updated.featured,
      trending: updated.trending,
      seoTitle: updated.seoTitle,
      metaDescription: updated.metaDescription,
      scheduledAt: null,
      publishedAt: updated.publishedAt?.toISOString() ?? null,
      tags: updated.tags.map(item => item.tag.name),
    }

    await tx.postRevision.create({
      data: {
        postId,
        version: (aggregate._max.version ?? 0) + 1,
        snapshot: snapshot as Prisma.InputJsonValue,
        createdById: current.updatedById,
      },
    })
  })

  return { published: true }
}

const worker = new Worker<ScheduledPublishPayload>('scheduled-publish', publishScheduledPost, {
  connection,
  concurrency: 2,
})

worker.on('completed', job => console.log(`[scheduled-publish] completed ${job.id}`))
worker.on('failed', (job, error) => console.error(`[scheduled-publish] failed ${job?.id ?? 'unknown'}`, error))
worker.on('error', error => console.error('[scheduled-publish] worker error', error))

await reconcileScheduledPosts()
console.log('[scheduled-publish] worker ready')

const reconcileTimer = setInterval(() => {
  void reconcileScheduledPosts().catch(error => console.error('[scheduled-publish] reconcile failed', error))
}, 60_000)

async function shutdown() {
  clearInterval(reconcileTimer)
  await worker.close()
  await queue.close()
  await connection.quit()
  await producerConnection.quit()
  await prisma.$disconnect()
  process.exit(0)
}

process.once('SIGINT', () => { void shutdown() })
process.once('SIGTERM', () => { void shutdown() })
