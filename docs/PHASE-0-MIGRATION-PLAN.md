# 🚧 Phase 0 — Production Foundation & Next.js Migration Plan

> **Goal:** establish the production runtime/data/CI foundation without redesigning V2.1 or prematurely implementing Auth/CMS/Radar/AI.

## Current checkpoint

| Subphase | Scope | Status |
|---|---|---|
| 0A | Freeze/inventory V2.1 | ✅ Complete |
| 0B | Next.js App Router migration | ✅ Complete |
| 0C | GSAP + browser/SSR stabilization | ✅ Verified locally |
| 0D | PostgreSQL + Prisma + env validation | ✅ Verified locally |
| 0E | Redis/BullMQ queue boundary | 🟡 Implemented; local verification required |
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

Implemented safeguards include explicit client boundaries for GSAP/browser state, `gsap.context()` cleanup, reduced-motion support and SSR-safe localStorage hydration.

## 0D — PostgreSQL + Prisma ✅

Verified locally by the project owner on 2026-09-13:
- PostgreSQL Compose container healthy on host port `5433`;
- Prisma schema validation/generation succeeded;
- migration + seed completed after aligning `DATABASE_URL`;
- `GET /api/health/database` returned HTTP 200 with `dependency: "postgresql"`.

Prisma remains pinned to 7.10.0. Only the minimal `SystemSetting` foundation model exists; User/Auth/Post/CMS models remain deferred.

## 0E — Redis/BullMQ boundary 🟡

### Implemented

- Redis 7 Alpine local service in `compose.yaml` with AOF persistence and health check.
- Host port `6380` maps to container port `6379` to reduce collisions with local Redis installations.
- `REDIS_URL` added to `.env.example` and typed server environment validation.
- `ioredis` server-only singleton with development hot-reload reuse.
- BullMQ dependency and server-only queue producer factory.
- Reserved queue names:
  - `content-ingestion`
  - `scheduled-publish`
  - `newsletter-send`
  - `ai-background`
- Reserved job names for future owning phases.
- Retry/backoff/removal defaults centralized in the queue contract.
- `GET /api/health/redis` added.

### Deliberate boundary

Phase 0E **does not create workers or enqueue fake product jobs**. Content ingestion belongs to Phase 3, scheduled publishing to the production CMS lifecycle, newsletter sending to Phase 6, and AI background work to Phase 4. A producer queue is created only when a future feature explicitly requests it.

### Local verification gate

After pulling and installing, merge the new Redis setting into existing local env files rather than overwriting secrets/configuration:

```text
REDIS_URL=redis://localhost:6380
```

Then:

```powershell
docker compose up -d postgres redis
docker compose ps
npm run typecheck
npm run build
npm run dev
```

Verify:

```text
GET http://localhost:3000/api/health/database
GET http://localhost:3000/api/health/redis
```

Expected Redis response is HTTP 200 and includes:

```json
{
  "status": "ok",
  "dependency": "redis"
}
```

### Gate

0E becomes ✅ only when:
- Redis Compose service reports healthy;
- `/api/health/redis` returns HTTP 200;
- database health remains green;
- typecheck/build remain green;
- no product jobs/workers were prematurely introduced.

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
0D ✅ PostgreSQL + Prisma verified
      ↓
0E 🟡 Redis / BullMQ boundary → local verification
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

Phase 0 is complete only when the Next.js runtime is verified, V2.1 remains visually intact, browser/client boundaries are stable, PostgreSQL/Prisma and Redis/BullMQ foundations are reproducible, verification/CI is green, documentation describes reality and no Phase 1+ feature is falsely claimed as complete.
