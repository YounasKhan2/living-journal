# The Living Journal

A reusable, multi-page editorial blog starter built with React, TypeScript, Vite, React Router and GSAP.

The project is structured as a real application rather than a single-page demo. Public pages, screen-specific components, global components, content types, seed data, local publishing state and admin screens are separated so the site can grow without turning `App.tsx` into a monolith.

## Visual direction

The refreshed system uses a restrained editorial palette:

- Bone paper background
- Charcoal typography
- Cobalt primary accent
- Soft periwinkle, sage and peach supporting surfaces
- Large serif editorial headlines with compact sans-serif UI copy
- Rounded media frames, but not card-heavy UI
- GSAP motion reserved for major storytelling moments

Theme tokens live in `src/styles/tokens.css`.

## Project structure

```text
src/
  app/
    App.tsx

  components/
    global/
      ArrowButton.tsx
      ArticleCard.tsx
      Brand.tsx
      NewsletterForm.tsx
      PublicLayout.tsx
      ScrollRestoration.tsx
      SectionHeading.tsx
      SiteFooter.tsx
      SiteHeader.tsx

  content/
    categories.ts
    seedPosts.ts

  context/
    ContentContext.tsx

  hooks/
    useDocumentTitle.ts

  screens/
    Home/
      HomeScreen.tsx
      components/
        Hero.tsx
        LeadStory.tsx
        LatestStories.tsx
        EditorialRail.tsx
        Trending.tsx
        NewsletterBand.tsx

    Stories/
      StoriesScreen.tsx
      components/
        StoriesGrid.tsx

    StoryDetail/
      StoryDetailScreen.tsx
      components/
        ArticleBody.tsx
        RelatedStories.tsx

    Category/
    Search/
    Newsletter/
    About/
    Contact/
    Advertise/
    Legal/
    NotFound/

    Admin/
      AdminDashboardScreen.tsx
      AdminPostsScreen.tsx
      AdminPostEditorScreen.tsx
      AdminAudienceScreen.tsx
      AdminSettingsScreen.tsx
      components/
        AdminHeader.tsx
        AdminLayout.tsx
        PostEditor.tsx

  styles/
    tokens.css
    global.css

  types/
    content.ts

  utils/
    format.ts
```

## Public routes

- `/` — Home
- `/stories` — Story archive with category filtering
- `/stories/:slug` — Full story detail page
- `/category/:slug` — Category archive
- `/search` — Live client-side search
- `/newsletter` — Newsletter landing page
- `/about` — Publication story
- `/contact` — Contact form UI
- `/advertise` — Sponsorship and advertising page
- `/legal/privacy` — Privacy starter
- `/legal/terms` — Terms starter
- `/legal/affiliate-disclosure` — Affiliate disclosure starter

## Publisher routes

- `/admin` — Dashboard
- `/admin/posts` — Manage stories
- `/admin/posts/new` — Create story
- `/admin/posts/:id/edit` — Edit story
- `/admin/audience` — Newsletter subscribers
- `/admin/settings` — Publication settings/demo reset

## Reusable content layer

`ContentContext` provides one source of truth for public and admin screens.

It currently persists to browser `localStorage`, which means the complete publishing flow can be tested without a backend:

- create a post
- edit a post
- save a draft
- publish a post
- mark featured/trending
- delete a post
- filter/search public stories
- capture newsletter emails
- inspect subscribers in admin

For production, keep the components/screens and replace the storage functions in `ContentContext.tsx` with API calls to your backend/database.

## Article editor syntax

The lightweight admin editor understands reusable article blocks:

```text
Normal paragraph

## Heading

> Pull quote

![Alternative text](https://example.com/image.jpg) "Optional caption"
```

This lets headings, quotes, images and paragraphs survive editing. A production version can replace this UI with TipTap or Lexical while keeping the same `ArticleSection` data type.

## SEO/public assets

`public/` includes starter files for:

- `robots.txt`
- `sitemap.xml`
- `rss.xml`

Replace `https://example.com` with the production domain and generate article URLs dynamically when a backend is connected.

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Before production launch

The UI and local publishing flow are complete as a reusable frontend. For a real multi-user production publication, connect:

- PostgreSQL/Supabase or another persistent database
- authenticated admin sessions/RBAC
- object storage for media uploads
- email provider for contact/newsletter delivery
- server-side/dynamic SEO metadata
- analytics
- AdSense/Ad Manager or sponsorship reporting
- server-generated sitemap/RSS

The architecture is intentionally prepared so those services can replace the local adapters without redesigning every screen.

## Visual refresh — Home V2

The landing page now uses a layered editorial canvas instead of a plain white background. The refresh adds:

- Warm stone, sage and soft periwinkle background choreography.
- Fixed grain texture and subtle hero grid/orbit details.
- Scroll-driven hero parallax and image scale interpolation.
- Moving signal ticker between the hero and daily edition.
- A new dense `BriefingGrid` / Editor's Desk section.
- Tighter section spacing and more information per viewport.
- Stronger hover states for latest and trending stories.
- Enhanced dark pinned editorial rail with richer image treatment.
- A more dimensional newsletter close with restrained gradient/orbit details.
- Mobile-specific reductions so the motion/details remain readable and performant.

All new home-specific pieces remain colocated under `src/screens/Home/components` so the reusable architecture stays intact.
