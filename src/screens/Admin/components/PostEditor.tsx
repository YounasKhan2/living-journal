import { useMemo, useState, type FormEvent } from 'react'
import { FloppyDisk, PaperPlaneRight } from 'phosphor-react'
import type { ArticleSection, Post, PostStatus } from '../../../types/content'
import { slugify } from '../../../utils/format'
import { categories } from '../../../content/categories'

const emptyPost = (): Post => ({
  id: `post-${Date.now()}`,
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

export function PostEditor({ initialPost, onSave }: { initialPost?: Post; onSave: (post: Post) => void }) {
  const [draft, setDraft] = useState<Post>(initialPost ?? emptyPost())
  const [body, setBody] = useState(() => sectionsToEditorText(initialPost?.sections ?? []))
  const slug = useMemo(() => draft.slug || slugify(draft.title), [draft.slug, draft.title])

  const update = <K extends keyof Post>(key: K, value: Post[K]) => setDraft(current => ({ ...current, [key]: value }))
  const commit = (status?: PostStatus) => onSave({ ...draft, slug, status: status ?? draft.status, sections: editorTextToSections(body) })
  const submit = (event: FormEvent) => { event.preventDefault(); commit() }

  return <form className="post-editor" onSubmit={submit}>
    <div className="post-editor__main">
      <div className="editor-field editor-field--title"><label htmlFor="post-title">Story title</label><textarea id="post-title" rows={2} required value={draft.title} onChange={event => update('title', event.target.value)} placeholder="A clear, memorable headline"/></div>
      <div className="editor-field"><label htmlFor="post-dek">Standfirst</label><textarea id="post-dek" rows={3} required value={draft.dek} onChange={event => update('dek', event.target.value)} placeholder="A concise summary that makes the reader care."/></div>
      <div className="editor-field"><label htmlFor="post-body">Article body</label><textarea id="post-body" rows={18} required value={body} onChange={event => setBody(event.target.value)} placeholder="Write the story. Separate paragraphs with a blank line."/><small>Use blank lines between blocks. Prefix a heading with ##, a quote with &gt;, or add images as ![alt](url) "caption".</small></div>
      <div className="editor-field"><label htmlFor="post-seo">SEO title</label><input id="post-seo" value={draft.seoTitle ?? ''} onChange={event => update('seoTitle', event.target.value)} placeholder="Optional search title"/></div>
      <div className="editor-field"><label htmlFor="post-meta">Meta description</label><textarea id="post-meta" rows={3} value={draft.metaDescription ?? ''} onChange={event => update('metaDescription', event.target.value)} placeholder="Optional search description"/></div>
    </div>
    <aside className="post-editor__side">
      <div className="editor-panel"><h2>Publish</h2><label>Status<select value={draft.status} onChange={event => update('status', event.target.value as PostStatus)}><option value="draft">Draft</option><option value="published">Published</option></select></label><label>Date<input value={draft.date} onChange={event => update('date', event.target.value)}/></label><label>Read time<input value={draft.readTime} onChange={event => update('readTime', event.target.value)}/></label><div className="editor-checks"><label><input type="checkbox" checked={Boolean(draft.featured)} onChange={event => update('featured', event.target.checked)}/> Featured story</label><label><input type="checkbox" checked={Boolean(draft.trending)} onChange={event => update('trending', event.target.checked)}/> Trending</label></div></div>
      <div className="editor-panel"><h2>Story details</h2><label>Category<select value={draft.category} onChange={event => update('category', event.target.value)}>{categories.map(category => <option key={category.slug}>{category.name}</option>)}</select></label><label>Author<input value={draft.author} onChange={event => update('author', event.target.value)}/></label><label>Slug<input value={slug} onChange={event => update('slug', event.target.value)}/></label><label>Cover image URL<input value={draft.image} onChange={event => update('image', event.target.value)}/></label><label>Tags<input value={draft.tags.join(', ')} onChange={event => update('tags', event.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}/></label></div>
      <div className="post-editor__actions"><button type="submit" className="admin-button admin-button--ghost"><FloppyDisk size={17}/>Save draft</button><button type="button" className="admin-button" onClick={() => commit('published')}><PaperPlaneRight size={17}/>Publish</button></div>
    </aside>
  </form>
}
