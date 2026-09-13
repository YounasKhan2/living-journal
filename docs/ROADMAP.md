# 🗺️ The Living Journal — Production Roadmap

> **Rule:** Complete and verify one phase before expanding the next. A UI existing does not mean a production phase is done.

## Current baseline

### ✅ V2.1 — Stable editorial visual baseline

The accepted V2.1 experience remains frozen during Phase 0: reusable screens/components, premium editorial styling, GSAP motion, public/internal routes and local demo publishing behavior.

### ✅ Runtime, database, queue and developer verification foundations

The project owner has locally verified Next.js/GSAP/SSR, PostgreSQL/Prisma, Redis/BullMQ and the deterministic developer quality gate.

---

## Phase 0 — Next.js migration & production foundation
**Status:** 🟡 IN PROGRESS

### Architecture decisions ✅
- Next.js App Router accepted via ADR-001.
- PostgreSQL + Prisma selected as canonical data foundation.
- Redis/BullMQ selected for durable background-job infrastructure.
- No separate NestJS service initially.

### Execution status

- ✅ **0A — V2.1 baseline frozen.**
- ✅ **0B — Next.js App Router migration.**
- ✅ **0C — GSAP/browser/SSR stabilization verified locally.**
- ✅ **0D — PostgreSQL + Prisma + environment validation verified locally.**
- ✅ **0E — Redis/BullMQ boundary verified locally.** Redis health, typecheck and build passed; no product workers/jobs were introduced.
- ✅ **0F — Reproducible developer verification complete.** Current lockfile is committed; `npm ci` is available and `npm run verify` passed locally end-to-end with 0 lint errors, green typecheck/tests and a successful production build. Hosted GitHub Actions is intentionally not required because the account cannot run Actions without billing.
- 🟡 **0G — Full visual/manual regression audit.** Current Phase 0 task.

Detailed gates: [`PHASE-0-MIGRATION-PLAN.md`](PHASE-0-MIGRATION-PLAN.md).

### Phase 0 exit criteria
- fresh clone can be configured from README;
- deterministic dependency installation works from the committed lockfile;
- lint/typecheck/test/build pass locally;
- all V2.1 routes/navigation work;
- visual/motion behavior is preserved;
- no hydration/browser-only runtime warnings;
- PostgreSQL migration + seed + DB health check succeed;
- Redis health check succeeds and BullMQ producer boundary typechecks;
- documentation describes reality;
- no Phase 1+ feature is falsely claimed complete.

---

## Phase 1 — Authentication & RBAC
**Status:** ⬜ Planned

Secure admin login/logout/session, `ADMIN`/`EDITOR`, server authorization, bootstrap-first-admin, protected routes and auth rate limiting.

**Exit:** anonymous protected access is blocked and role tests pass.

## Phase 2 — Production CMS & media
**Status:** ⬜ Planned

Persistent content domain, lifecycle, structured editor, autosave/preview/revisions, media storage and public pages backed by canonical database content.

**Exit:** editor can create, review, schedule and publish durable content end-to-end.

## Phase 3 — Content Radar & ingestion
**Status:** ⬜ Planned

Source registry, RSS/Atom first, scheduled ingestion, normalization/deduplication, Radar workflow, attribution and source health.

**Exit:** at least one real source ingests reliably and nothing auto-publishes.

## Phase 4 — AI Editorial Copilot
**Status:** ⬜ Planned

Research/headline/outline/draft/SEO assistance with source context and usage metadata.

**Exit:** AI output remains editable and never directly publishes.

## Phase 5 — SEO & distribution
**Status:** ⬜ Planned

Canonical metadata, structured data, dynamic sitemap/RSS, optional news sitemap, social cards, redirects and Search Console readiness.

## Phase 6 — Audience & newsletter
**Status:** ⬜ Planned

Persistent consent-aware subscribers, unsubscribe, provider adapter, campaign workflow/metrics and retry-safe sends.

## Phase 7 — Monetization
**Status:** ⬜ Planned

Feature flags, ads, affiliates, sponsors, disclosures, media kit and revenue adapters.

## Phase 8 — Analytics, hardening & launch
**Status:** ⬜ Planned

Analytics, monitoring, Core Web Vitals, accessibility/security audits, backups, deployment/rollback and launch checklist.

---

## Later opportunities

Digital products, memberships, reader accounts/bookmarks, personalized briefings, multi-publication support, native apps, advanced recommendations and sponsor self-service remain outside the initial roadmap.

## Definition of done for every phase

A phase requires working end-to-end behavior, relevant security, edge states, verification/tests, no committed secrets, updated README/docs, and a clear record of remaining limitations.
