import { StoriesScreen } from '../../../screens/Stories/StoriesScreen'
import { loadPublishedUiPosts } from '../../../server/content/public'

export default async function Page() {
  const posts = await loadPublishedUiPosts()
  return <StoriesScreen posts={posts}/>
}
