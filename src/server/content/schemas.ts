import { z } from 'zod'

const paragraphSection = z.object({ type: z.literal('paragraph'), text: z.string().min(1).max(20000) })
const headingSection = z.object({ type: z.literal('heading'), text: z.string().min(1).max(500) })
const quoteSection = z.object({ type: z.literal('quote'), text: z.string().min(1).max(5000) })
const imageSection = z.object({
  type: z.literal('image'),
  src: z.string().url().max(2048),
  alt: z.string().min(1).max(500),
  caption: z.string().max(1000).optional(),
})

export const articleSectionSchema = z.discriminatedUnion('type', [
  paragraphSection,
  headingSection,
  quoteSection,
  imageSection,
])

export const postStatusSchema = z.enum(['DRAFT', 'IN_REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'])

export const postInputSchema = z.object({
  slug: z.string().min(1).max(180),
  title: z.string().min(1).max(300),
  dek: z.string().min(1).max(1000),
  categorySlug: z.string().min(1).max(120),
  categoryName: z.string().min(1).max(120).optional(),
  authorName: z.string().min(1).max(160),
  readTime: z.string().min(1).max(80),
  coverImageUrl: z.string().url().max(2048).nullable().optional(),
  coverMediaId: z.string().min(1).max(191).nullable().optional(),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  seoTitle: z.string().max(300).nullable().optional(),
  metaDescription: z.string().max(500).nullable().optional(),
  tags: z.array(z.string().min(1).max(80)).max(20).default([]),
  sections: z.array(articleSectionSchema).max(300),
})

export const postPatchSchema = postInputSchema.partial().refine(
  value => Object.keys(value).length > 0,
  'At least one field must be supplied.',
)

export const transitionInputSchema = z.object({
  status: postStatusSchema,
  scheduledAt: z.string().datetime().optional(),
})

export const postRevisionSnapshotSchema = z.object({
  slug: z.string().min(1).max(180),
  title: z.string().min(1).max(300),
  dek: z.string().min(1).max(1000),
  body: z.array(articleSectionSchema).max(300),
  authorName: z.string().min(1).max(160),
  readTime: z.string().min(1).max(80),
  status: postStatusSchema,
  category: z.object({
    slug: z.string().min(1).max(120),
    name: z.string().min(1).max(120),
  }),
  coverImageUrl: z.string().url().max(2048).nullable(),
  coverMediaId: z.string().nullable(),
  featured: z.boolean(),
  trending: z.boolean(),
  seoTitle: z.string().max(300).nullable(),
  metaDescription: z.string().max(500).nullable(),
  scheduledAt: z.string().datetime().nullable(),
  publishedAt: z.string().datetime().nullable(),
  tags: z.array(z.string().min(1).max(80)).max(20),
})

export type PostInput = z.infer<typeof postInputSchema>
export type PostPatch = z.infer<typeof postPatchSchema>
export type PostStatusValue = z.infer<typeof postStatusSchema>
export type PostRevisionSnapshot = z.infer<typeof postRevisionSnapshotSchema>
