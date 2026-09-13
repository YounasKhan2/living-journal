export type PostStatus = 'draft' | 'in_review' | 'scheduled' | 'published' | 'archived'

export type ArticleSection =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }

export type Post = {
  id: string
  slug: string
  title: string
  dek: string
  category: string
  date: string
  readTime: string
  image: string
  author: string
  featured?: boolean
  trending?: boolean
  status: PostStatus
  tags: string[]
  seoTitle?: string
  metaDescription?: string
  scheduledAt?: string
  sections: ArticleSection[]
}

export type Category = {
  slug: string
  name: string
  description: string
}
