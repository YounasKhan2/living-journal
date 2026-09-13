# 🚧 Phase 0 — Production Foundation & Next.js Migration Plan

> **Goal:** move the accepted V2.1 frontend onto the production runtime without redesigning it, then establish the data, environment and CI foundation required for later phases.

## Current checkpoint

| Subphase | Scope | Status |
|---|---|---|
| 0A | Freeze/inventory V2.1 | ✅ Complete |
| 0B | Next.js App Router migration | ✅ Implemented |
| 0C | GSAP + browser/SSR stabilization | 🟡 Implementation in place; local verification required |
| 0D | PostgreSQL + Prisma + env validation | ⬜ Next after 0C verification |
| 0E | Redis/queue boundary | ⬜ Planned |
| 0F | CI + developer experience | ⬜ Planned |
| 0G | Visual/manual regression QA | ⬜ Planned |

Phase 0 does **not** include authentication/RBAC, production CMS persistence, Content Radar, AI generation, newsletter delivery or monetization providers.

---

## 0A — Freeze and inventory V2.1 ✅

The accepted V2.1 visual baseline is preserved through:

- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/styles/polish.css`
- existing reusable screens/components
- stabilized GSAP behavior from V2.1

The migration is a runtime/framework migration, not a redesign.

---

## 0B — Next.js App Router ✅ Implemented

### Completed

- Replaced Vite as the active runtime with Next.js App Router.
- Replaced React Router navigation/params with Next.js routing primitives.
- Added root metadata/layout and route groups.
- Preserved the existing `screens/` and reusable component architecture.
- Added public routes:
  - `/`
  - `/stories`
  - `/stories/[slug]`
  - `/category/[slug]`
  - `/search`
  - `/newsletter`
  - `/about`
  - `/contact`
  - `/advertise`
  - `/legal/[page]`
- Added admin demo routes:
  - `/admin`
  - `/admin/posts`
  - `/admin/posts/new`
  - `/admin/posts/[id]/edit`
  - `/admin/audience`
  - `/admin/settings`
- Added `GET /api/health`.
- Added Next.js metadata scaffolding and initial story metadata from seed content.
- Added `.env.example` with `NEXT_PUBLIC_SITE_URL`.
- Removed obsolete Vite entry/config files.

### Runtime files

```text
src/app/
├── layout.tsx
├── not-found.tsx
├── (public)/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── stories/
│   ├── category/
│   ├── search/
│   ├── newsletter/
│   ├── about/
│   ├── contact/
│   ├── advertise/
│   └── legal/
├── admin/
└── api/health/route.ts
```

### Verification note

The structural migration is committed, but a full `next build` could not be executed in the assistant environment because npm dependencies cannot be downloaded there. The local developer gate below must therefore be run before 0B/0C are considered verified:

```bash
npm install
npm run typecheck
npm run build
npm run dev
```

Then manually open the route matrix and `/api/health`.

---

## 0C — Motion and browser-only behavior 🟡

### Already implemented

- GSAP/ScrollTrigger stays in a client component.
- GSAP uses `gsap.context()` and cleanup on unmount.
- The fragile full-page pinning behavior remains removed.
- `prefers-reduced-motion` is preserved.
- `localStorage` hydration now starts from deterministic seed state and reads browser storage only after mount.
- Site header/mobile state, newsletter form, admin demo flows and search/filter interactions have explicit client boundaries.

### Remaining gate

Verify locally that there are:

- no hydration warnings;
- no server-evaluation errors from `window`, `document`, `localStorage` or GSAP;
- no duplicated ScrollTrigger behavior in development;
- no visual regression on desktop/mobile;
- correct reduced-motion behavior.

0C is complete only after that local verification passes.

---

## 0D — PostgreSQL + Prisma + environment foundation ⬜

After 0C verification:

- add `prisma/schema.prisma`;
- add PostgreSQL configuration;
- add a server-only Prisma client helper;
- add environment validation;
- expand `.env.example` with placeholders only;
- add an initial migration and small development seed;
- add a DB-aware health/readiness check.

Use the smallest schema that proves migrations and server-side data access. Do not accidentally begin the Phase 1 auth or Phase 2 CMS domain.

### Gate

- fresh local PostgreSQL database migrates successfully;
- server-only DB connectivity check passes;
- no database credentials enter Git/client code.

---

## 0E — Redis/queue boundary ⬜

Redis/BullMQ remain part of the accepted architecture for durable workflows. Actual runtime infrastructure may wait until a durable job is needed, but the server boundary must be explicit before Content Radar, scheduled publishing or newsletter jobs are implemented.

---

## 0F — CI and developer experience ⬜

Required baseline:

- typecheck
- lint
- build
- test
- GitHub Actions on pushes/PRs
- reproducible README setup

The setup guide must cover environment creation, PostgreSQL, migrations/generation/seed and verification commands.

---

## 0G — Visual/manual regression QA ⬜

Check at minimum:

**Public:** Home, ticker, latest, briefing, editorial rail, trending, Stories, Category, Story Detail, Search, Newsletter, About, Contact, Advertise, Legal, 404.

**Admin demo:** Dashboard, Posts, New/Edit, Audience, Settings.

**Breakpoints:** desktop, tablet, mobile and narrow mobile.

**Basics:** keyboard focus, mobile menu, reduced motion, horizontal overflow, hydration console, image/content layout stability.

---

## Execution order

```text
0A ✅ V2.1 frozen
      ↓
0B ✅ Next.js App Router implemented
      ↓
0C 🟡 local runtime / hydration / motion verification
      ↓
0D PostgreSQL + Prisma + env validation
      ↓
0E queue boundary
      ↓
0F CI + reproducible setup
      ↓
0G visual/manual regression audit
      ↓
Phase 0 complete
      ↓
Phase 1 Auth/RBAC
```

## Phase 0 definition of done

Phase 0 is complete only when Next.js is the verified active runtime, V2.1 remains visually intact, browser/client boundaries are stable, PostgreSQL/Prisma setup is reproducible, verification/CI is green, documentation describes reality and no Phase 1+ feature is falsely claimed as complete.
