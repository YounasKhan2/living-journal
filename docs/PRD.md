# 📘 The Living Journal — Product Requirements Document

> **Status:** Approved baseline for V3 planning  
> **Product:** The Living Journal  
> **Positioning:** An editorial technology publication and publishing platform focused on AI, software, startups, products, careers, business and future technology.

## 1. Product vision

The Living Journal should become more than a visual blog. It is a human-led editorial platform that combines original publishing, external-source discovery, AI-assisted research/drafting, newsletters, SEO distribution and multiple monetization channels.

The product principle is simple:

> **APIs discover. AI assists. Humans decide. The Journal publishes.**

External articles must never be silently copied or auto-published. Every externally discovered story enters an editorial workflow before publication.

## 2. Goals

- Publish high-quality original and timely technology content consistently.
- Give editors one production CMS for manual stories, discovered stories and AI-assisted drafts.
- Build organic search and direct/newsletter audiences.
- Create measurable revenue through advertising, affiliate content, sponsorships and later digital products.
- Preserve the premium Awwwards-style V2 reading experience while making the system production-ready.
- Keep the architecture understandable and maintainable by humans and coding agents.

## 3. Non-goals for V3

- Becoming a general-purpose newspaper.
- Automatically republishing full third-party articles.
- Fully autonomous AI publishing.
- Building a social network or public user-generated publishing platform.
- Building native mobile apps.
- Prematurely implementing complex ad-tech before traffic/content exists.

## 4. Target audience

### Primary readers
- Software developers and engineering students
- AI practitioners and AI-curious professionals
- Startup builders/founders
- Tech professionals and fresh graduates

### Commercial audience
- SaaS and developer-tool companies
- AI companies
- Hosting/cloud providers
- Career/education products
- Technology sponsors and advertisers

### Internal users
- `ADMIN` — publication configuration, users, monetization, sources and all editorial actions
- `EDITOR` — research, create/edit/review/schedule/publish content
- Future `AUTHOR` — draft own assigned content with limited publishing rights

## 5. Editorial pillars

1. Artificial Intelligence
2. Development
3. Startups
4. Products & Tools
5. Career
6. Business
7. Future Tech

Recommended editorial mix: roughly **70% original evergreen/analysis** and **30% timely news/current-event coverage**. This is a strategy target, not a hard application constraint.

## 6. Core content workflows

### A. Manual publishing

`Admin → New Story → Draft → SEO/Media → Preview → Review → Publish/Schedule`

The editor must be able to create an original story without any external source or AI dependency.

### B. Content Radar

`Sources → Ingestion → Normalize → Deduplicate → Radar → Editor selects item → Research workspace → Draft → Review → Publish`

Radar items should retain source attribution, original URL, source publication time and ingestion metadata. They are leads, not publishable articles.

### C. AI-assisted story creation

`Topic/Radar item → AI research brief → Headline ideas → Outline → Draft assistance → SEO suggestions → Human edit → Publish`

AI output is always editable and remains a draft until an authorized human publishes it. Generated claims should preserve source references in the editorial workspace where possible.

### D. Newsletter

`Published stories → Editor selects/AI summarizes → Newsletter draft → Preview → Schedule/send → Metrics`

### E. Monetization

`Article → configured placements/affiliate links/sponsor metadata → reader interaction → analytics → revenue dashboard`

## 7. Functional requirements

### Public publication
- Responsive home, story archive, category, search and story-detail pages.
- Author/date/read-time/category metadata.
- Related and trending content.
- Newsletter signup.
- About, contact, advertise and legal pages.
- Accessible navigation and reduced-motion support.
- Strong performance despite GSAP storytelling motion.

### Production CMS
- Authenticated admin area.
- Role-based permissions.
- Create/edit/delete/preview stories.
- Draft, review, scheduled and published states.
- Featured/trending controls.
- Structured rich-text/block editor.
- Categories/tags/authors.
- Cover/social images and media library.
- SEO title, description, canonical URL and social metadata.
- Revision history and basic audit trail.
- Autosave and safe unsaved-change handling.

### Content Radar
- Configurable source registry.
- RSS/Atom first; selected licensed/approved APIs later.
- Scheduled ingestion jobs.
- Normalized source-item schema.
- URL/title/source deduplication.
- Search/filter by source, category, age and status.
- Save/dismiss/archive actions.
- Convert a radar item into an editorial draft while preserving attribution.
- Source health/last-success visibility.

### AI editorial assistant
- Research brief from selected source material.
- Headline variants.
- Outline generation.
- Draft/section assistance.
- SEO title/meta suggestions.
- FAQ/tag suggestions where appropriate.
- Newsletter/social summaries.
- AI actions must be explicit; no autonomous production publish.
- Store generation metadata needed for cost/quality monitoring.

### SEO & distribution
- Server-renderable/crawlable story pages in the production architecture.
- Dynamic metadata and canonical URLs.
- Article, Breadcrumb and Organization structured data where applicable.
- Dynamic XML sitemap.
- News sitemap when publication requirements justify it.
- RSS/Atom feed.
- Open Graph/social cards.
- Search Console/analytics readiness.
- Redirect strategy when slugs change.

### Audience
- Subscriber capture with consent metadata.
- Confirmed/unsubscribed states.
- Newsletter composition and delivery-provider integration.
- Subscriber counts and campaign metrics.
- No email addresses exposed in public/client bundles.

### Monetization
- Configurable ad-slot components; initially disabled until appropriate.
- Affiliate-link management with disclosure support.
- Sponsored-story flag and clear disclosure.
- Sponsor/campaign records and placement dates.
- Advertise/media-kit page.
- Revenue/click/conversion reporting when providers make data available.
- Digital-product commerce is a later phase, not V3 launch-critical.

### Analytics
- Page views and traffic sources.
- Story performance.
- Newsletter conversion.
- Affiliate outbound clicks.
- Sponsor/ad events where permitted.
- Editorial dashboard should favor useful decisions over vanity metrics.

## 8. Proposed content lifecycle

`IDEA → DRAFT → IN_REVIEW → SCHEDULED → PUBLISHED → ARCHIVED`

Radar lifecycle:

`NEW → SAVED/SELECTED → CONVERTED/DISMISSED → ARCHIVED`

Publishing transitions must be authorized server-side. Scheduled publishing must be handled by a durable server/worker process, not an open browser tab.

## 9. Core domain entities

- User
- AuthorProfile
- Post
- PostRevision
- Category
- Tag
- MediaAsset
- Source
- SourceItem
- PostSource
- AiGeneration
- Subscriber
- NewsletterCampaign
- AffiliateProgram
- AffiliateLink
- Sponsor
- SponsorshipCampaign
- AnalyticsEvent / provider aggregate
- AuditLog

Exact database fields belong in `ARCHITECTURE.md`/implementation design rather than this product document.

## 10. Quality & safety requirements

- No third-party full-text copying by default.
- Preserve attribution for externally inspired/researched stories.
- Sanitize rich content before rendering.
- Validate all API inputs server-side.
- Protect admin mutations with authentication, authorization and CSRF/session protections appropriate to the chosen auth model.
- Rate-limit auth, public forms and expensive AI endpoints.
- Keep secrets server-side and out of Git.
- Back up production database/media.
- Log ingestion/publishing failures without leaking secrets or reader PII.
- Respect `prefers-reduced-motion`.

## 11. Success metrics

### Product
- Time from discovered lead to editorial draft.
- Publishing frequency and scheduled-publish reliability.
- CMS save/publish failure rate.
- Source ingestion success rate.

### Audience
- Organic sessions.
- Returning readers.
- Newsletter signup conversion.
- Subscriber growth and engagement.
- Story completion/engagement signals where privacy-compliant.

### Revenue
- Affiliate outbound CTR and conversions where available.
- Sponsorship revenue.
- Ad revenue after activation.
- Revenue per 1,000 sessions/readers as the business matures.

## 12. V3 launch acceptance criteria

V3 is production-ready only when:

- Real database persistence replaces `localStorage` for production content.
- Admin authentication/RBAC is enforced server-side.
- Editors can create, edit, preview, schedule and publish stories reliably.
- Media uploads use persistent object storage.
- At least one real RSS/API ingestion path feeds Content Radar.
- Radar items cannot publish without explicit editorial action.
- AI assistance cannot publish directly.
- Public story metadata, sitemap and RSS are generated from production content.
- Newsletter signup persists safely and unsubscribe flow exists before real campaigns.
- Analytics baseline is connected.
- Legal/disclosure surfaces are ready before monetization is enabled.
- Deployment, environment and rollback instructions are documented.

## 13. Product principles for contributors and agents

1. Read this PRD and `docs/ARCHITECTURE.md` before major implementation.
2. Do not silently expand product scope.
3. Do not replace human editorial approval with automation.
4. Preserve V2's reusable screen/component architecture and visual identity.
5. Prefer reusable domain/services over feature logic buried in UI components.
6. Update documentation in the same change whenever workflows, architecture, routes, setup, environment variables or phase status change.
7. Keep root `README.md` friendly and high-level; place deep technical detail under `docs/`.
