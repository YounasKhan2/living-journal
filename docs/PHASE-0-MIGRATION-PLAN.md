# 🚧 Phase 0 — Production Foundation & Next.js Migration Plan

> **Goal:** move the stable V2.1 React/Vite frontend onto the accepted Next.js production runtime without redesigning the product, then establish the database/environment/CI foundation required for later phases.

## Scope guard

Phase 0 includes **runtime migration and production foundation only**.

It does **not** include:
- real admin authentication/RBAC;
- production CMS persistence;
- Content Radar ingestion;
- AI generation;
- newsletter delivery;
- monetization providers.

Those remain in later phases.

---

## Phase 0A — Freeze and inventory the V2.1 baseline

### Tasks
- Record all current routes and page-level UI behavior.
- Record all client-only dependencies and browser APIs.
- Record localStorage-backed flows that must remain demo-only during migration.
- Keep `tokens.css`, `global.css` and `polish.css` unchanged unless a Next.js compatibility issue requires a documented fix.
- Capture a manual visual QA checklist for Home, Stories, Story Detail, Search, About and Admin.

### Gate
- Current Vite app still runs/builds before migration changes begin.

---

## Phase 0B — Introduce Next.js App Router

### Tasks
- Replace Vite runtime/build configuration with Next.js.
- Add root `src/app/layout.tsx` and global style imports.
- Map public routes:
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
- Map admin demo routes under `/admin/*` without adding auth yet.
- Preserve current screen/components during transition rather than rewriting all JSX.
- Introduce client boundaries only where hooks, localStorage, GSAP or browser APIs require them.
- Replace React Router `Link`, params and navigation usage with Next.js equivalents.
- Replace document-title hook usage with Next.js metadata where practical; dynamic production metadata remains Phase 5.

### Gate
- Every V2.1 route renders under Next.js.
- Direct URL navigation/refresh works for internal routes.
- UI matches the V2.1 baseline closely.

---

## Phase 0C — Stabilize motion and browser-only behavior

### Tasks
- Keep GSAP animations inside client components.
- Ensure `ScrollTrigger` registration only occurs in browser-safe/client modules.
- Confirm cleanup under React strict/development behavior.
- Preserve `prefers-reduced-motion`.
- Make localStorage demo persistence browser-safe under SSR.
- Remove any remaining direct `window`, `document`, `matchMedia` or `innerWidth` access from server-evaluated paths.

### Gate
- No hydration/runtime errors.
- Motion works on desktop/mobile and reduced-motion mode remains usable.

---

## Phase 0D — Environment and database foundation

### Tasks
- Add `prisma/schema.prisma`.
- Add PostgreSQL connection configuration.
- Add server-only Prisma client helper.
- Add environment validation.
- Add `.env.example` with placeholders only.
- Add initial migration and development seed foundation.
- Initial schema should include only entities needed to prove the foundation cleanly; avoid prematurely implementing the whole CMS.

### Initial database entities
Recommended minimal Phase 0 schema:
- `SystemSetting` or equivalent small foundation table, **or** minimal `User`/`Post` shells only if needed for migration validation.

Prefer the smallest schema that proves migrations and data access without accidentally starting Phase 1/2.

### Gate
- Fresh local Postgres database can migrate successfully.
- A server-only health/data-access check confirms DB connectivity.
- No database credentials enter Git/client code.

---

## Phase 0E — Redis/queue boundary

Redis/BullMQ are part of the target architecture, but should not be added blindly.

### Decision
- Add the **adapter/module boundary** in Phase 0 if useful.
- Add actual Redis/BullMQ runtime only if Phase 0 health/infrastructure verification benefits from it.
- Durable jobs become mandatory before Phase 3 ingestion and scheduled publishing/newsletter workflows.

This keeps local setup lighter while preserving the architecture.

---

## Phase 0F — CI and developer experience

### Required scripts/checks
- lint
- typecheck
- build
- test baseline (even if initially small)

### CI
Add GitHub Actions that install dependencies and run the required checks on pushes/PRs.

### Developer setup
README must document:
1. install dependencies;
2. configure `.env.local` from `.env.example`;
3. start/point to PostgreSQL;
4. run Prisma migration/generate/seed commands;
5. run development server;
6. run verification commands.

### Gate
- Clean clone setup is reproducible from documentation.
- CI is green on the migration branch/main integration.

---

## Phase 0G — Visual regression/manual QA

Before declaring Phase 0 complete, check at minimum:

### Public
- Home hero/layout/motion
- Signal ticker
- Latest stories
- Briefing/editorial/trending sections
- Stories archive
- Category archive
- Story detail body/related stories
- Search
- Newsletter
- About
- Contact
- Advertise
- Legal pages
- 404

### Admin demo
- Dashboard
- Posts list
- New/edit post editor
- Audience
- Settings

### Breakpoints
- Desktop
- Tablet
- Mobile
- Narrow mobile

### Accessibility/performance basics
- keyboard focus visible;
- mobile navigation usable;
- reduced-motion mode;
- no horizontal overflow;
- no hydration warnings;
- images/content do not collapse during load.

---

## Execution order

```text
0A Freeze V2.1 baseline
        ↓
0B Next.js runtime + route migration
        ↓
0C client/motion/SSR stabilization
        ↓
0D PostgreSQL + Prisma + env foundation
        ↓
0E queue boundary decision
        ↓
0F CI + setup workflow
        ↓
0G visual/manual regression audit
        ↓
Phase 0 complete
        ↓
Phase 1 Auth/RBAC
```

## Commit strategy

Keep Phase 0 auditable. Prefer several coherent commits rather than one giant migration:

1. `docs: accept Next.js production architecture`
2. `refactor: migrate app runtime and routes to Next.js`
3. `fix: stabilize GSAP and browser-only client boundaries`
4. `feat: add PostgreSQL Prisma and environment foundation`
5. `ci: add production foundation checks`
6. `docs: finalize Phase 0 setup and verification`

Do not mix Phase 1 authentication into these commits.

## Phase 0 definition of done

Phase 0 is complete when:
- ADR-001 remains accepted and implementation matches it;
- Next.js fully replaces Vite as the active runtime;
- V2.1 visual experience remains intact;
- current routes have working equivalents;
- SSR/client boundaries are stable;
- PostgreSQL/Prisma environment is reproducible;
- build/typecheck/lint/tests and CI are green;
- README and architecture/roadmap docs describe reality;
- no Phase 1+ product feature is accidentally claimed as complete.
