import 'server-only'

import { seedPosts } from '../../content/seedPosts'
import type { Post } from '../../types/content'
import { toUiPost } from './presenters'
import { listPublishedPosts } from './queries'

export async function loadPublishedUiPosts(): Promise<Post[]> {
  try {
    const posts = await listPublishedPosts()
    if (posts.length > 0) return posts.map(toUiPost)
    return process.env.NODE_ENV === 'production' ? [] : seedPosts.filter(post => post.status === 'published')
  } catch (error) {
    if (process.env.NODE_ENV === 'production') throw error
    return seedPosts.filter(post => post.status === 'published')
  }
}
