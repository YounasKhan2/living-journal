import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PublicLayout } from '../components/global/PublicLayout'
import { ScrollRestoration } from '../components/global/ScrollRestoration'
import { ContentProvider } from '../context/ContentContext'
import { AboutScreen } from '../screens/About/AboutScreen'
import { AdminAudienceScreen } from '../screens/Admin/AdminAudienceScreen'
import { AdminDashboardScreen } from '../screens/Admin/AdminDashboardScreen'
import { AdminPostEditorScreen } from '../screens/Admin/AdminPostEditorScreen'
import { AdminPostsScreen } from '../screens/Admin/AdminPostsScreen'
import { AdminSettingsScreen } from '../screens/Admin/AdminSettingsScreen'
import { AdminLayout } from '../screens/Admin/components/AdminLayout'
import { AdvertiseScreen } from '../screens/Advertise/AdvertiseScreen'
import { CategoryScreen } from '../screens/Category/CategoryScreen'
import { ContactScreen } from '../screens/Contact/ContactScreen'
import { HomeScreen } from '../screens/Home/HomeScreen'
import { NewsletterScreen } from '../screens/Newsletter/NewsletterScreen'
import { LegalScreen } from '../screens/Legal/LegalScreen'
import { NotFoundScreen } from '../screens/NotFound/NotFoundScreen'
import { SearchScreen } from '../screens/Search/SearchScreen'
import { StoriesScreen } from '../screens/Stories/StoriesScreen'
import { StoryDetailScreen } from '../screens/StoryDetail/StoryDetailScreen'

export function App() {
  return <ContentProvider>
    <BrowserRouter>
      <ScrollRestoration/>
      <Routes>
        <Route element={<PublicLayout/>}>
          <Route index element={<HomeScreen/>}/>
          <Route path="stories" element={<StoriesScreen/>}/>
          <Route path="stories/:slug" element={<StoryDetailScreen/>}/>
          <Route path="category/:slug" element={<CategoryScreen/>}/>
          <Route path="search" element={<SearchScreen/>}/>
          <Route path="newsletter" element={<NewsletterScreen/>}/>
          <Route path="about" element={<AboutScreen/>}/>
          <Route path="contact" element={<ContactScreen/>}/>
          <Route path="advertise" element={<AdvertiseScreen/>}/>
          <Route path="legal/:page" element={<LegalScreen/>}/>
        </Route>
        <Route path="admin" element={<AdminLayout/>}>
          <Route index element={<AdminDashboardScreen/>}/>
          <Route path="posts" element={<AdminPostsScreen/>}/>
          <Route path="posts/new" element={<AdminPostEditorScreen/>}/>
          <Route path="posts/:id/edit" element={<AdminPostEditorScreen/>}/>
          <Route path="audience" element={<AdminAudienceScreen/>}/>
          <Route path="settings" element={<AdminSettingsScreen/>}/>
        </Route>
        <Route path="*" element={<NotFoundScreen/>}/>
      </Routes>
    </BrowserRouter>
  </ContentProvider>
}
