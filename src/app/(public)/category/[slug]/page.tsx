import { CategoryScreen } from '../../../../screens/Category/CategoryScreen'
import { loadPublishedUiPosts } from '../../../../server/content/public'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const posts = await loadPublishedUiPosts()
  return <CategoryScreen slug={slug} posts={posts}/>
}
