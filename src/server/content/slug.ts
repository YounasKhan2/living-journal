import { slugify } from '../../utils/format'

export function normalizePostSlug(value: string) {
  const slug = slugify(value).slice(0, 180)
  if (!slug) throw new Error('INVALID_POST_SLUG')
  return slug
}
