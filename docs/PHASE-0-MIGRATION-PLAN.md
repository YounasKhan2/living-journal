# 🚧 Phase 0 — Production Foundation & Next.js Migration Plan

> **Goal:** establish the production runtime/data/CI foundation without redesigning V2.1 or prematurely implementing Auth/CMS/Radar/AI.

## Current checkpoint

| Subphase | Scope | Status |
|---|---|---|
| 0A | Freeze/inventory V2.1 | ✅ Complete |
| 0B | Next.js App Router migration | ✅ Complete |
| 0C | GSAP + browser/SSR stabilization | ✅ Verified locally |
| 0D | PostgreSQL + Prisma + env validation | 🟡 Implemented; local DB verification required |
| 0E | Redis/queue boundary | ⬜ Planned |
| 0F | CI + developer experience | ⬜ Planned |
| 0G | Visual/manual regression QA | ⬜ Planned |

Phase 0 does **not** include authentication/RBAC, production CMS persistence, Content Radar, AI generation, newsletter delivery or monetization providers.

## 0A — V2.1 baseline ✅

The V2.1 visual baseline remains frozen through the existing screen/component architecture plus `tokens.css`, `global.css` and `polish.css`. Phase 0 changes compatibility/runtime boundaries only.

## 0B — Next.js App Router ✅

Completed:
- Next.js App Router is the active runtime.
- Public/admin route matrix migrated from React Router.
- `/api/health` added.
- Vite runtime files removed.
- Existing screens/components retained.
- Initial metadata scaffolding added.

## 0C — Browser/SSR/motion stabilization ✅

Verified locally by the project owner after running the migrated application/build.

Implemented safeguards include:
- explicit client boundaries for GSAP/browser state;
- `gsap.context()` cleanup;
- no fragile full-page pinned rail;
- reduced-motion support;
- SSR-safe localStorage hydration;
- no stale React Router/Vite references.

## 0D — PostgreSQL + Prisma 🟡

### Implemented

- Prisma ORM **7.10.0** is deliberately pinned while Prisma 8 tooling is in transition.
- PostgreSQL driver adapter (`@prisma/adapter-pg`) and `pg` added.
- `prisma.config.ts` added with migration + seed configuration.
- `prisma/schema.prisma` added.
- Minimal `SystemSetting` model added strictly to prove the foundation.
- Initial SQL migration committed.
- Explicit development seed added (`foundation.status`).
- Typed server-only Zod environment validation added.
- Server-only singleton Prisma client added.
- `GET /api/health/database` added.
- `.env.example` now documents `DATABASE_URL`.
- `compose.yaml` provides optional PostgreSQL 16 local infrastructure.
- DB scripts added to `package.json`.

### Why only `SystemSetting`?

Phase 0 must prove schema/migration/data access without starting Phase 1/2. User/Auth/Post/CMS models are intentionally deferred.

### Local verification gate

```bash
# after git pull + npm install
Copy-Item .env.example .env

docker compose up -d postgres
npm run db:validate
npm run db:generate
npm run db:deploy
npm run db:seed
npm run typecheck
npm run build
npm run dev
```

Then verify:

```text
GET http://localhost:3000/api/health
GET http://localhost:3000/api/health/database
```

Expected database health status: HTTP 200 with `dependency: "postgresql"`.

If PostgreSQL is installed separately, Docker is optional; point `DATABASE_URL` at that instance instead.

### Gate

0D becomes ✅ only when:
- migration deploy succeeds against a fresh PostgreSQL database;
- seed succeeds;
- `/api/health/database` returns 200;
- typecheck/build remain green;
- no secrets are committed.

## 0E — Redis/queue boundary ⬜

Redis/BullMQ remain required before durable ingestion, scheduled publishing or newsletter jobs. Phase 0E will define the adapter/runtime boundary without inventing jobs that do not yet exist.

## 0F — CI/developer experience ⬜

Required baseline:
- lint
- typecheck
- build
- test
- GitHub Actions on pushes/PRs
- reproducible README setup

## 0G — Visual/manual regression QA ⬜

Final audit covers all public/admin demo routes, desktop/tablet/mobile/narrow-mobile, keyboard focus, mobile menu, reduced motion, overflow, hydration console and image/layout stability.

## Execution order

```text
0A ✅ V2.1 frozen
      ↓
0B ✅ Next.js App Router
      ↓
0C ✅ SSR / GSAP verified
      ↓
0D 🟡 PostgreSQL + Prisma implemented → local DB verification
      ↓
0E Redis / queue boundary
      ↓
0F CI + reproducible setup
      ↓
0G regression QA
      ↓
Phase 0 complete
      ↓
Phase 1 Auth/RBAC
```

## Phase 0 definition of done

Phase 0 is complete only when the Next.js runtime is verified, V2.1 remains visually intact, browser/client boundaries are stable, PostgreSQL/Prisma setup is reproducible, verification/CI is green, documentation describes reality and no Phase 1+ feature is falsely claimed as complete.
