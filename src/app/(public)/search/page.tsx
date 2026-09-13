import { SearchScreen } from '../../../screens/Search/SearchScreen'
import { loadPublishedUiPosts } from '../../../server/content/public'

export default async function Page() {
  const posts = await loadPublishedUiPosts()
  return <SearchScreen posts={posts}/>
}
