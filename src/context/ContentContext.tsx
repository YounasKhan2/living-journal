'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
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

function readStoredPosts(): Post[] {
  try {
    const saved = window.localStorage.getItem(POSTS_KEY)
    return saved ? JSON.parse(saved) as Post[] : seedPosts
  } catch {
    return seedPosts
  }
}

function readStoredSubscribers(): string[] {
  try {
    const saved = window.localStorage.getItem(SUBSCRIBERS_KEY)
    return saved ? JSON.parse(saved) as string[] : []
  } catch {
    return []
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  // Deterministic initial state keeps the first server/client render identical.
  // Browser demo storage is hydrated only after mount.
  const [posts, setPosts] = useState<Post[]>(seedPosts)
  const [subscribers, setSubscribers] = useState<string[]>([])

  useEffect(() => {
    setPosts(readStoredPosts())
    setSubscribers(readStoredSubscribers())
  }, [])

  const persistPosts = (next: Post[]) => {
    setPosts(next)
    try { window.localStorage.setItem(POSTS_KEY, JSON.stringify(next)) } catch { /* demo storage may be unavailable */ }
  }

  const createPost = (post: Post) => persistPosts([post, ...posts])
  const updatePost = (post: Post) => persistPosts(posts.map(item => item.id === post.id ? post : item))
  const deletePost = (id: string) => persistPosts(posts.filter(item => item.id !== id))

  const subscribe = (email: string) => {
    const normalized = email.trim().toLowerCase()
    if (!normalized || subscribers.includes(normalized)) return false
    const next = [...subscribers, normalized]
    setSubscribers(next)
    try { window.localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(next)) } catch { /* demo storage may be unavailable */ }
    return true
  }

  const resetDemoContent = () => {
    persistPosts(seedPosts)
    setSubscribers([])
    try { window.localStorage.removeItem(SUBSCRIBERS_KEY) } catch { /* demo storage may be unavailable */ }
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
