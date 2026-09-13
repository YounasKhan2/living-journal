import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { StoryDetailScreen } from '../../../screens/StoryDetail/StoryDetailScreen'
import { getAuthorizedUser } from '../../../server/auth/authorize'
import { toUiPost } from '../../../server/content/presenters'
import { getCmsPostById, listPublishedPosts } from '../../../server/content/queries'

export const metadata: Metadata = {
  title: 'Editorial preview',
  robots: { index: false, follow: false, nocache: true },
}

export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getAuthorizedUser('cms:read')
  if (!user) redirect(`/login?returnTo=${encodeURIComponent(`/preview/${id}`)}`)

  const post = await getCmsPostById(id)
  if (!post) return <main className="empty-page page-gutter page-top"><span className="eyebrow">Preview</span><h1>Story not found.</h1></main>

  const relatedRows = await listPublishedPosts(4)
  const related = relatedRows.filter(item => item.id !== post.id).slice(0, 3).map(toUiPost)

  return <div className="editorial-preview">
    <div className="editorial-preview__bar"><span>Private editorial preview</span><strong>{post.status.replace('_', ' ')}</strong><a href={`/admin/posts/${post.id}/edit`}>Back to editor</a></div>
    <StoryDetailScreen post={toUiPost(post)} related={related}/>
  </div>
}
