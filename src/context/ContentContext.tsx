import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { seedPosts } from '../content/seedPosts'
import type { Post } from '../types/content'

const POSTS_KEY = 'living-journal-posts-v2'
const SUBSCRIBERS_KEY = 'living-journal-subscribers-v2'

type ContentContextValue = {
  posts: Post[]
  subscribers: string[]
  publishedPosts: Post[]
  createPost: (post: Post) => void
  updatePost: (post: Post) => void
  deletePost: (id: string) => void
  subscribe: (email: string) => boolean
  resetDemoContent: () => void
}

const ContentContext = createContext<ContentContextValue | null>(null)

function safeGetItem(key: string) {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: string, value: string) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // The demo remains usable even when storage is blocked/private.
  }
}

function safeRemoveItem(key: string) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Ignore unavailable storage in the local demo.
  }
}

function readPosts() {
  const saved = safeGetItem(POSTS_KEY)
  if (!saved) return seedPosts
  try {
    const parsed = JSON.parse(saved) as Post[]
    return Array.isArray(parsed) ? parsed : seedPosts
  } catch {
    return seedPosts
  }
}

function readSubscribers() {
  const saved = safeGetItem(SUBSCRIBERS_KEY)
  if (!saved) return []
  try {
    const parsed = JSON.parse(saved) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(readPosts)
  const [subscribers, setSubscribers] = useState<string[]>(readSubscribers)

  const persistPosts = (next: Post[]) => {
    setPosts(next)
    safeSetItem(POSTS_KEY, JSON.stringify(next))
  }

  const createPost = (post: Post) => persistPosts([post, ...posts])
  const updatePost = (post: Post) => persistPosts(posts.map(item => item.id === post.id ? post : item))
  const deletePost = (id: string) => persistPosts(posts.filter(item => item.id !== id))

  const subscribe = (email: string) => {
    const normalized = email.trim().toLowerCase()
    if (!normalized || subscribers.includes(normalized)) return false
    const next = [...subscribers, normalized]
    setSubscribers(next)
    safeSetItem(SUBSCRIBERS_KEY, JSON.stringify(next))
    return true
  }

  const resetDemoContent = () => {
    persistPosts(seedPosts)
    setSubscribers([])
    safeRemoveItem(SUBSCRIBERS_KEY)
  }

  const value = useMemo<ContentContextValue>(() => ({
    posts,
    subscribers,
    publishedPosts: posts.filter(post => post.status === 'published'),
    createPost,
    updatePost,
    deletePost,
    subscribe,
    resetDemoContent,
  }), [posts, subscribers])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) throw new Error('useContent must be used inside ContentProvider')
  return context
}
