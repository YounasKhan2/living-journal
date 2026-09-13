'use client'

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Archive, ArrowCounterClockwise, Clock, Eye, FloppyDisk, PaperPlaneRight } from 'phosphor-react'
import type { ArticleSection, Post, PostStatus } from '../../../types/content'
import { slugify } from '../../../utils/format'
import { categories } from '../../../content/categories'
import { CoverMediaUploader } from './CoverMediaUploader'
import type { UploadedMediaAsset } from '../cmsApi'

const emptyPost = (): Post => ({
  id: '',
  slug: '',
  title: '',
  dek: '',
  category: 'Artificial Intelligence',
  date: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
  readTime: '6 min read',
  image: 'https://picsum.photos/seed/new-story/1600/1100',
  author: 'The Living Journal',
  status: 'draft',
  tags: [],
  sections: [{ type: 'paragraph', text: '' }],
})

function sectionsToEditorText(sections: ArticleSection[]) {
  return sections.map(section => {
    if (section.type === 'heading') return `## ${section.text}`
    if (section.type === 'quote') return `> ${section.text}`
    if (section.type === 'image') return `![${section.alt}](${section.src})${section.caption ? ` \"${section.caption}\"` : ''}`
    return section.text
  }).join('\n\n')
}

function editorTextToSections(value: string): ArticleSection[] {
  return value.split(/\n\s*\n/).map(block => block.trim()).filter(Boolean).map(block => {
    if (block.startsWith('## ')) return { type: 'heading' as const, text: block.slice(3).trim() }
    if (block.startsWith('> ')) return { type: 'quote' as const, text: block.slice(2).trim() }
    const image = block.match(/^!\[(.*?)\]\((.*?)\)(?: \"(.*?)\")?$/)
    if (image) return { type: 'image' as const, alt: image[1], src: image[2], caption: image[3] || undefined }
    return { type: 'paragraph' as const, text: block }
  })
}

const statusLabel: Record<PostStatus, string> = {
  draft: 'Draft',
  in_review: 'In review',
  scheduled: 'Scheduled',
  published: 'Published',
  archived: 'Archived',
}

type PostEditorProps = {
  initialPost?: Post
  onSave: (post: Post) => Promise<void>
  onTransition?: (status: PostStatus, scheduledAt?: string) => Promise<void>
}

export function PostEditor({ initialPost, onSave, onTransition }: PostEditorProps) {
  const initialValue = initialPost ?? emptyPost()
  const [draft, setDraft] = useState<Post>(initialValue)
  const [body, setBody] = useState(() => sectionsToEditorText(initialPost?.sections ?? [{ type: 'paragraph', text: '' }]))
  const [scheduledAt, setScheduledAt] = useState(initialPost?.scheduledAt?.slice(0, 16) ?? '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [lastAutoSaveAt, setLastAutoSaveAt] = useState<Date | null>(null)
  const slug = useMemo(() => draft.slug || slugify(draft.title), [draft.slug, draft.title])
  const isPersisted = Boolean(draft.id)

  const update = <K extends keyof Post>(key: K, value: Post[K]) => setDraft(current => ({ ...current, [key]: value }))
  const currentPost = useCallback((): Post => ({ ...draft, slug, sections: editorTextToSections(body) }), [body, draft, slug])
  const currentSignature = useMemo(() => JSON.stringify(currentPost()), [currentPost])
  const [lastSavedSignature, setLastSavedSignature] = useState(() => JSON.stringify({
    ...initialValue,
    slug: initialValue.slug || slugify(initialValue.title),
    sections: initialPost?.sections ?? [{ type: 'paragraph', text: '' }],
  }))
  const dirty = currentSignature !== lastSavedSignature

  const persist = useCallback(async (mode: 'manual' | 'auto' = 'manual') => {
    if (pending) return
    setError('')
    setPending(true)
    try {
      const post = currentPost()
      const signature = JSON.stringify(post)
      await onSave(post)
      setLastSavedSignature(signature)
      if (mode === 'auto') setLastAutoSaveAt(new Date())
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save the story.')
    } finally {
      setPending(false)
    }
  }, [currentPost, onSave, pending])

  async function save(event?: FormEvent) {
    event?.preventDefault()
    await persist('manual')
  }

  useEffect(() => {
    if (!dirty) return
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [dirty])

  useEffect(() => {
    if (!isPersisted || !dirty || pending || draft.status === 'archived') return
    const timer = window.setTimeout(() => { void persist('auto') }, 12000)
    return () => window.clearTimeout(timer)
  }, [dirty, draft.status, isPersisted, pending, persist])

  async function transition(status: PostStatus) {
    if (!onTransition || pending) return
    setError('')
    setPending(true)
    try {
      const post = currentPost()
      const signature = JSON.stringify(post)
      await onSave(post)
      setLastSavedSignature(signature)
      const scheduleValue = status === 'scheduled' && scheduledAt ? new Date(scheduledAt).toISOString() : undefined
      await onTransition(status, scheduleValue)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update publishing status.')
    } finally {
      setPending(false)
    }
  }

  function handleMediaUploaded(asset: UploadedMediaAsset) {
    setDraft(current => ({
      ...current,
      image: asset.url,
      coverMediaId: asset.id,
      imageAlt: asset.altText,
      imageAttribution: asset.attribution ?? undefined,
    }))
  }

  function handleCoverUrl(value: string) {
    setDraft(current => ({
      ...current,
      image: value,
      coverMediaId: undefined,
      imageAlt: undefined,
      imageAttribution: undefined,
    }))
  }

  return <form className="post-editor" onSubmit={save}>
    <div className="post-editor__main">
      {error ? <p className="admin-notice admin-notice--error" role="alert">{error}</p> : null}
      <div className="editor-save-state" data-dirty={dirty ? 'true' : 'false'}><span>{dirty ? 'Unsaved changes' : 'All changes saved'}</span><strong>{pending ? 'Saving…' : lastAutoSaveAt ? `Autosaved ${lastAutoSaveAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : isPersisted ? 'Autosave on' : 'Save once to enable autosave'}</strong></div>
      <div className="editor-field editor-field--title"><label htmlFor="post-title">Story title</label><textarea id="post-title" rows={2} required value={draft.title} onChange={event => update('title', event.target.value)} placeholder="A clear, memorable headline"/></div>
      <div className="editor-field"><label htmlFor="post-dek">Standfirst</label><textarea id="post-dek" rows={3} required value={draft.dek} onChange={event => update('dek', event.target.value)} placeholder="A concise summary that makes the reader care."/></div>
      <div className="editor-field"><label htmlFor="post-body">Article body</label><textarea id="post-body" rows={18} required value={body} onChange={event => setBody(event.target.value)} placeholder="Write the story. Separate paragraphs with a blank line."/><small>Use blank lines between blocks. Prefix a heading with ##, a quote with &gt;, or add images as <code>{'![alt](url) "caption"'}</code>.</small></div>
      <div className="editor-field"><label htmlFor="post-seo">SEO title</label><input id="post-seo" value={draft.seoTitle ?? ''} onChange={event => update('seoTitle', event.target.value)} placeholder="Optional search title"/></div>
      <div className="editor-field"><label htmlFor="post-meta">Meta description</label><textarea id="post-meta" rows={3} value={draft.metaDescription ?? ''} onChange={event => update('metaDescription', event.target.value)} placeholder="Optional search description"/></div>
    </div>
    <aside className="post-editor__side">
      <div className="editor-panel">
        <h2>Workflow</h2>
        <div className="editor-status"><span>Status</span><strong>{statusLabel[draft.status]}</strong></div>
        {!isPersisted ? <p className="editor-help">Save this draft once to unlock review and publishing actions.</p> : null}
        {isPersisted ? <Link className="editor-preview-link" href={`/preview/${draft.id}`} target="_blank"><Eye size={16}/>Preview saved version</Link> : null}
        {draft.status === 'in_review' && isPersisted ? <label>Schedule time<input type="datetime-local" value={scheduledAt} onChange={event => setScheduledAt(event.target.value)}/></label> : null}
        <label>Read time<input value={draft.readTime} onChange={event => update('readTime', event.target.value)}/></label>
        <div className="editor-checks"><label><input type="checkbox" checked={Boolean(draft.featured)} onChange={event => update('featured', event.target.checked)}/> Featured story</label><label><input type="checkbox" checked={Boolean(draft.trending)} onChange={event => update('trending', event.target.checked)}/> Trending</label></div>
      </div>
      <div className="editor-panel"><h2>Story details</h2><label>Category<select value={draft.category} onChange={event => update('category', event.target.value)}>{categories.map(category => <option key={category.slug}>{category.name}</option>)}</select></label><label>Author<input value={draft.author} onChange={event => update('author', event.target.value)}/></label><label>Slug<input value={slug} onChange={event => update('slug', event.target.value)}/></label><CoverMediaUploader post={draft} onUploaded={handleMediaUploaded}/><label>Or use external cover URL<input value={draft.image} onChange={event => handleCoverUrl(event.target.value)}/></label><label>Tags<input value={draft.tags.join(', ')} onChange={event => update('tags', event.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}/></label></div>
      <div className="post-editor__actions">
        {draft.status !== 'archived' ? <button disabled={pending || !dirty} type="submit" className="admin-button admin-button--ghost"><FloppyDisk size={17}/>{pending ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}</button> : null}
        {isPersisted && draft.status === 'draft' ? <button disabled={pending} type="button" className="admin-button" onClick={() => void transition('in_review')}><PaperPlaneRight size={17}/>Submit for review</button> : null}
        {isPersisted && draft.status === 'in_review' ? <><button disabled={pending} type="button" className="admin-button admin-button--ghost" onClick={() => void transition('draft')}><ArrowCounterClockwise size={17}/>Return to draft</button><button disabled={pending || !scheduledAt} type="button" className="admin-button admin-button--ghost" onClick={() => void transition('scheduled')}><Clock size={17}/>Schedule</button><button disabled={pending} type="button" className="admin-button" onClick={() => void transition('published')}><PaperPlaneRight size={17}/>Publish</button></> : null}
        {isPersisted && draft.status === 'scheduled' ? <><button disabled={pending} type="button" className="admin-button admin-button--ghost" onClick={() => void transition('draft')}><ArrowCounterClockwise size={17}/>Unschedule</button><button disabled={pending} type="button" className="admin-button" onClick={() => void transition('published')}><PaperPlaneRight size={17}/>Publish now</button></> : null}
        {isPersisted && draft.status === 'published' ? <button disabled={pending} type="button" className="admin-button admin-button--ghost" onClick={() => void transition('archived')}><Archive size={17}/>Archive</button> : null}
        {isPersisted && draft.status === 'archived' ? <button disabled={pending} type="button" className="admin-button" onClick={() => void transition('draft')}><ArrowCounterClockwise size={17}/>Restore as draft</button> : null}
      </div>
    </aside>
  </form>
}
