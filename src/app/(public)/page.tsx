import { HomeScreen } from '../../screens/Home/HomeScreen'
import { loadPublishedUiPosts } from '../../server/content/public'

export default async function Page() {
  const posts = await loadPublishedUiPosts()
  return <HomeScreen posts={posts}/>
}
