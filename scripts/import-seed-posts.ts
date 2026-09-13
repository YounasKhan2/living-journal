import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { Prisma, PrismaClient } from '../src/generated/prisma/client'
import { seedPosts } from '../src/content/seedPosts'
import { slugify } from '../src/utils/format'
import { parseNormalizedEmail } from '../src/server/auth/identity'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is required to import seed posts')

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

async function main() {
  const rl = createInterface({ input, output })
  const email = parseNormalizedEmail(await rl.question('Attribute imported stories to admin/editor email: '))
  rl.close()

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.status !== 'ACTIVE') throw new Error('An ACTIVE editorial user with that email is required.')

  let imported = 0
  let skipped = 0

  for (const source of seedPosts) {
    const exists = await prisma.post.findUnique({ where: { slug: source.slug }, select: { id: true } })
    if (exists) {
      skipped += 1
      continue
    }

    await prisma.$transaction(async tx => {
      const categorySlug = slugify(source.category)
      const category = await tx.category.upsert({
        where: { slug: categorySlug },
        update: { name: source.category },
        create: { slug: categorySlug, name: source.category },
      })

      const publishedAt = source.status === 'published' ? new Date(source.date) : null
      const post = await tx.post.create({
        data: {
          id: source.id,
          slug: source.slug,
          title: source.title,
          dek: source.dek,
          body: source.sections as Prisma.InputJsonValue,
          authorName: source.author,
          readTime: source.readTime,
          status: source.status === 'published' ? 'PUBLISHED' : 'DRAFT',
          categoryId: category.id,
          coverImageUrl: source.image || null,
          featured: Boolean(source.featured),
          trending: Boolean(source.trending),
          seoTitle: source.seoTitle ?? null,
          metaDescription: source.metaDescription ?? null,
          publishedAt: publishedAt && !Number.isNaN(publishedAt.getTime()) ? publishedAt : null,
          createdById: user.id,
          updatedById: user.id,
        },
      })

      for (const tagName of source.tags) {
        const tagSlug = slugify(tagName)
        if (!tagSlug) continue
        const tag = await tx.tag.upsert({
          where: { slug: tagSlug },
          update: { name: tagName },
          create: { slug: tagSlug, name: tagName },
        })
        await tx.postTag.create({ data: { postId: post.id, tagId: tag.id } })
      }

      await tx.postRevision.create({
        data: {
          postId: post.id,
          version: 1,
          createdById: user.id,
          snapshot: {
            slug: source.slug,
            title: source.title,
            dek: source.dek,
            body: source.sections,
            authorName: source.author,
            readTime: source.readTime,
            status: post.status,
            category: { slug: category.slug, name: category.name },
            coverImageUrl: source.image,
            featured: Boolean(source.featured),
            trending: Boolean(source.trending),
            seoTitle: source.seoTitle ?? null,
            metaDescription: source.metaDescription ?? null,
            tags: source.tags,
          } as Prisma.InputJsonValue,
        },
      })
    })

    imported += 1
  }

  console.log(`Imported ${imported} story/stories; skipped ${skipped} existing slug(s).`)
}

main()
  .catch(error => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
