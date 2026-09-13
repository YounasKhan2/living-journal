# 🗺️ The Living Journal — Production Roadmap

> **Rule:** Complete and verify one phase before expanding the next. A UI existing does not mean a production phase is done.

## Current baseline

### ✅ V2.1 — Stable editorial visual baseline

The accepted V2.1 experience is preserved during Phase 0: reusable screens/components, premium editorial styling, GSAP motion, public/internal routes and local demo publishing behavior.

### 🟡 Active runtime migration

Next.js App Router is now the active project runtime in `main`. The framework migration is implemented; local build/hydration/visual verification is the immediate gate before database work begins.

---

## Phase 0 — Next.js migration & production foundation
**Status:** 🟡 IN PROGRESS

### Architecture decisions ✅
- ADR-001: **Next.js App Router** accepted.
- PostgreSQL + Prisma selected as the canonical data foundation.
- Redis/BullMQ retained for durable jobs when required.
- No separate NestJS service in the initial production architecture.

### Execution status

- ✅ **0A — V2.1 baseline frozen.**
- ✅ **0B — Next.js App Router migration implemented.** Public/admin route equivalents, Next navigation, root metadata/layout, `/api/health`, and Vite cleanup are in `main`.
- 🟡 **0C — GSAP/browser/SSR stabilization.** Client boundaries and hydration-safe local demo storage are implemented; local console/build/visual verification remains.
- ⬜ **0D — PostgreSQL + Prisma + environment validation.**
- ⬜ **0E — Redis/queue boundary.**
- ⬜ **0F — CI + reproducible developer setup.**
- ⬜ **0G — Full visual/manual regression audit.**

Detailed gates: [`PHASE-0-MIGRATION-PLAN.md`](PHASE-0-MIGRATION-PLAN.md).

### Phase 0 exit criteria
- fresh clone can be configured from README;
- `npm run typecheck` and `npm run build` pass;
- all V2.1 routes work directly and through navigation;
- V2.1 visual/motion behavior is preserved;
- no hydration/runtime warnings from browser-only code;
- PostgreSQL migration succeeds locally;
- lint/test/build/typecheck CI baseline is green;
- documentation describes the implemented system;
- no Phase 1+ feature is incorrectly claimed as complete.

---

## Phase 1 — Authentication & RBAC
**Status:** ⬜ Planned

- secure admin login/logout/session;
- `ADMIN` and `EDITOR` roles;
- server-side authorization guards;
- bootstrap-first-admin workflow;
- protected admin routes;
- auth rate limiting/security baseline.

**Exit:** anonymous access to protected data/mutations is blocked and role tests pass.

---

## Phase 2 — Production CMS & media
**Status:** ⬜ Planned

- persistent posts/categories/tags/authors;
- Draft → Review → Scheduled → Published → Archived lifecycle;
- production structured editor;
- autosave/preview/revisions;
- media storage + metadata;
- public pages read canonical database content rather than local demo state.

**Exit:** an editor can create, review, schedule and publish durable content end-to-end.

---

## Phase 3 — Content Radar & ingestion
**Status:** ⬜ Planned

- source registry;
- RSS/Atom first;
- scheduled ingestion;
- normalization/deduplication;
- Radar inbox/filter/save/dismiss/archive;
- source attribution and lead → draft conversion;
- source health metrics.

**Exit:** at least one real source ingests reliably and nothing auto-publishes.

---

## Phase 4 — AI Editorial Copilot
**Status:** ⬜ Planned

- research brief;
- headlines/outlines;
- section/draft assistance;
- SEO/tag/FAQ/social/newsletter suggestions;
- generation/usage metadata;
- explicit source context.

**Exit:** AI output remains editable, attributable where needed and never directly publishes.

---

## Phase 5 — SEO & distribution
**Status:** ⬜ Planned

- canonical metadata;
- Article/Breadcrumb/Organization structured data;
- dynamic sitemap/RSS;
- News sitemap when justified;
- social cards;
- redirects;
- Search Console readiness.

**Exit:** canonical published content is crawlable and private/draft content is not indexed.

---

## Phase 6 — Audience & newsletter
**Status:** ⬜ Planned

- persistent consent-aware subscribers;
- unsubscribe;
- email provider adapter;
- campaign composition/preview/scheduling;
- metrics where available;
- retry-safe sends.

---

## Phase 7 — Monetization
**Status:** ⬜ Planned

- monetization feature flags;
- ad placements;
- affiliate registry/events;
- sponsor/campaign records;
- disclosure surfaces;
- media-kit/revenue adapters.

---

## Phase 8 — Analytics, hardening & launch
**Status:** ⬜ Planned

- editorial/public analytics;
- error/queue/ingestion monitoring;
- Core Web Vitals optimization;
- accessibility/security audits;
- backups/restore;
- deployment/rollback runbook;
- production launch checklist.

---

## Later opportunities

Digital products, memberships, reader accounts/bookmarks, personalized briefings, multi-publication support, native apps, advanced recommendations and sponsor self-service remain outside the initial roadmap.

## Definition of done for every phase

A phase requires working end-to-end behavior, relevant security, edge states, verification/tests, no committed secrets, updated README/docs, and a clear record of remaining limitations.
