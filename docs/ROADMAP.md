# 🗺️ The Living Journal — Production Roadmap

> **Rule:** Complete and verify one phase before expanding the next. Avoid large cross-phase implementation prompts that make regressions hard to audit.

## Current baseline

### ✅ V2 — Reusable editorial frontend

Available today:
- Multi-page React/Vite/TypeScript application.
- Reusable public/admin screen architecture.
- Premium editorial visual system and GSAP home motion.
- Story/category/search/detail UI.
- Local demo CMS using `localStorage`.
- Newsletter demo capture.
- Starter SEO public files.

Known limitation: V2 is a frontend/local publishing demo, **not a production CMS**.

---

## Phase 0 — Architecture decision & production foundation
**Status:** ⏭️ NEXT

### Objectives
- Choose integrated Next.js architecture or separated Vite + NestJS architecture.
- Preserve V2 visual/components while establishing production runtime.
- Add environment validation and local infrastructure.

### Deliverables
- Architecture Decision Record for framework/backend path.
- PostgreSQL connection + migrations.
- Redis/queue foundation if required immediately.
- Environment schema and `.env.example` without secrets.
- Health/readiness checks where relevant.
- CI checks for lint/typecheck/test/build.
- Seed/dev workflow.

### Exit criteria
- Fresh clone can be configured from README.
- Database migration succeeds locally.
- CI/build baseline is green.
- No production content depends on browser `localStorage` after the later migration phase; Phase 0 only establishes infrastructure.

---

## Phase 1 — Authentication & RBAC
**Status:** ⬜ Planned

### Deliverables
- Secure admin login/logout/session.
- `ADMIN` and `EDITOR` roles.
- Server-side authorization guards.
- Bootstrap-first-admin procedure.
- Protected admin routes.
- Rate limiting/security baseline for auth.

### Exit criteria
- Anonymous users cannot access protected admin data/mutations.
- Editor/admin capability tests pass.
- Role enforcement is server-side.

---

## Phase 2 — Production CMS & media
**Status:** ⬜ Planned

### Deliverables
- Post/category/tag/author persistence.
- Draft → review → scheduled → published → archived lifecycle.
- Rich/block editor.
- Autosave.
- Preview.
- Revisions/audit metadata.
- Media upload/storage + alt/attribution metadata.
- Migrate public site from local seed/context to API/server data.

### Exit criteria
- Editor can create, edit, preview, schedule and publish a story end-to-end.
- Published content survives devices/restarts/deploys.
- Public pages read canonical production content.

---

## Phase 3 — Content Radar & ingestion
**Status:** ⬜ Planned

### Deliverables
- Source registry.
- RSS/Atom adapter first.
- Scheduled ingestion worker.
- Normalization/deduplication.
- Radar inbox with filters.
- Save/dismiss/archive.
- Convert lead → draft with source attribution.
- Source-health metrics.

### Exit criteria
- At least one real external source ingests reliably.
- Duplicate leads are controlled.
- No ingested lead can become public without explicit editorial action.

---

## Phase 4 — AI Editorial Copilot
**Status:** ⬜ Planned

### Deliverables
- Research brief.
- Headline/outline assistance.
- Section/draft assistance.
- SEO metadata suggestions.
- Tags/FAQ/social/newsletter summaries.
- Generation metadata/usage logging.
- Explicit source context selection.

### Exit criteria
- AI output always lands in editable editorial state.
- AI has no direct production-publish permission.
- Provider failures do not lose editor content.

---

## Phase 5 — SEO & distribution
**Status:** ⬜ Planned

### Deliverables
- Dynamic canonical metadata.
- Article/Breadcrumb/Organization structured data as applicable.
- Dynamic sitemap.
- RSS/Atom.
- News sitemap when justified.
- Social cards.
- Slug redirects.
- Search Console-ready deployment.

### Exit criteria
- Published articles render crawlable metadata/HTML.
- Sitemap/feed reflect canonical published content automatically.
- Draft/private content is not indexed.

---

## Phase 6 — Audience & newsletter
**Status:** ⬜ Planned

### Deliverables
- Persistent subscribers and consent state.
- Unsubscribe flow.
- Email provider adapter.
- Campaign composer/preview.
- Story selection + optional AI summaries.
- Send/schedule workflow.
- Delivery/open/click metrics where provider supports them.

### Exit criteria
- Subscribe/unsubscribe is production-safe.
- Campaigns cannot accidentally double-send on job retry.
- Subscriber PII remains server-side/protected.

---

## Phase 7 — Monetization
**Status:** ⬜ Planned

### Deliverables
- Monetization feature flags.
- Reusable ad placements.
- Affiliate program/link registry + click events.
- Sponsor/campaign records.
- Sponsored-story disclosures.
- Advertise/media-kit data.
- Revenue dashboard adapters.

### Exit criteria
- Monetization can be enabled/disabled without redesigning articles.
- Affiliate/sponsored content has required disclosure surfaces.
- Revenue/event reporting has traceable source data.

---

## Phase 8 — Analytics, hardening & launch
**Status:** ⬜ Planned

### Deliverables
- Editorial/public analytics dashboards.
- Error/queue/ingestion monitoring.
- Performance optimization and Core Web Vitals pass.
- Accessibility audit.
- Security review.
- Backup/restore documentation.
- Deployment/rollback runbook.
- Production legal/content checklist.

### Exit criteria
- Critical workflows have automated tests.
- Operational failures are observable.
- Deployment and rollback are documented and rehearsable.
- Production launch checklist is signed off.

---

## Later opportunities — after evidence of audience/revenue

- Digital products/store.
- Paid memberships.
- Reader accounts/bookmarks.
- Personalized briefings.
- Multiple publications/tenancy.
- Mobile apps.
- Advanced recommendation engine.
- Sponsor self-service portal.

These are deliberately outside the initial production roadmap.

## Definition of done for every phase

A phase is not complete because the UI exists. It is complete when:

1. Required behavior works end-to-end.
2. Security/authorization is enforced where relevant.
3. Error/empty/loading states exist.
4. Typecheck/build/tests pass.
5. No secrets are committed.
6. Root `README.md` reflects new setup/workflows/status.
7. `PRD.md`, `ARCHITECTURE.md`, or this roadmap are updated if the implementation changed their assumptions.
8. A concise commit/PR summary records what changed, verification performed and known limitations.
