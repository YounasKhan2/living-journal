# 🗺️ The Living Journal — Production Roadmap

> **Rule:** Complete and verify one phase before expanding the next. Implementation may advance ahead of manual verification when explicitly authorized, but no phase is marked complete until its exit gate passes.

## Current baseline

### ✅ V2.1 — Stable editorial visual baseline

The accepted V2.1 experience remains intact: reusable screens/components, premium editorial styling, GSAP motion, public/internal routes and the publication's visual identity.

### ✅ Phase 0 — Production foundation complete

The project owner locally verified the Next.js/GSAP/SSR migration, PostgreSQL/Prisma, Redis/BullMQ foundation, deterministic developer verification and final visual/manual regression pass.

---

## Phase 0 — Next.js migration & production foundation
**Status:** ✅ COMPLETE

- ✅ 0A — V2.1 baseline frozen.
- ✅ 0B — Next.js App Router migration.
- ✅ 0C — GSAP/browser/SSR stabilization verified locally.
- ✅ 0D — PostgreSQL + Prisma verified locally.
- ✅ 0E — Redis/BullMQ boundary verified locally.
- ✅ 0F — Reproducible developer verification complete.
- ✅ 0G — Full visual/manual regression audit verified.

Detailed Phase 0 record: [`PHASE-0-MIGRATION-PLAN.md`](PHASE-0-MIGRATION-PLAN.md) and [`PHASE-0G-QA.md`](PHASE-0G-QA.md).

---

## Phase 1 — Authentication & RBAC
**Status:** 🟡 IMPLEMENTED — FINAL SECURITY MATRIX VERIFICATION PENDING

Implemented:
- email/password login and logout;
- Argon2id password hashing;
- opaque hashed PostgreSQL sessions;
- HttpOnly secure-cookie policy;
- protected `/admin/**` boundary;
- centralized `ADMIN` / `EDITOR` capabilities;
- ADMIN-only settings enforcement;
- first-admin bootstrap command;
- Redis login throttling;
- same-origin mutation protection;
- privacy-minimized auth audit records;
- auth-focused tests and editorial login UI.

Still required before Phase 1 is marked complete:
- explicit EDITOR account matrix verification;
- direct ADMIN-only endpoint denial check;
- expired/revoked/disabled-session checks;
- final auth regression plus `npm run verify` after the latest code batch.

Detailed plan: [`PHASE-1-AUTH-PLAN.md`](PHASE-1-AUTH-PLAN.md).

---

## Phase 2 — Production CMS & media
**Status:** 🟡 IN PROGRESS — CORE WORKFLOW IMPLEMENTED

Implemented:
- durable PostgreSQL content models and imported seed stories;
- authenticated CMS APIs;
- draft/edit/review/schedule/publish/archive lifecycle;
- public DB-backed homepage/archive/category/search/story reads;
- canonical story metadata;
- immutable revision history and restore-as-new-draft;
- dirty-state autosave and browser unsaved-change protection;
- authenticated noindex editorial preview;
- BullMQ delayed scheduled-publish jobs plus worker/reconciliation process;
- Cloudinary media adapter, upload endpoint, durable `MediaAsset` metadata and cover-image upload UI.

Remaining Phase 2 gate:
- configure Cloudinary credentials and verify real upload;
- run/deploy and verify the scheduled publishing worker;
- full ADMIN/EDITOR publishing regression;
- direct endpoint/public visibility checks;
- final responsive/metadata/revision/autosave regression;
- `npm run verify` after latest CMS work;
- documentation closure.

Detailed plan: [`PHASE-2-CMS-PLAN.md`](PHASE-2-CMS-PLAN.md).

---

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
