# 🚧 Phase 0 — Production Foundation & Next.js Migration Plan

> **Goal:** establish the production runtime/data/CI foundation without redesigning V2.1 or prematurely implementing Auth/CMS/Radar/AI.

## Current checkpoint

| Subphase | Scope | Status |
|---|---|---|
| 0A | Freeze/inventory V2.1 | ✅ Complete |
| 0B | Next.js App Router migration | ✅ Complete |
| 0C | GSAP + browser/SSR stabilization | ✅ Verified locally |
| 0D | PostgreSQL + Prisma + env validation | ✅ Verified locally |
| 0E | Redis/BullMQ queue boundary | ✅ Verified locally |
| 0F | CI + developer experience | 🟡 Implemented; verification + lockfile sync required |
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

Verified locally by the project owner after running the migrated application/build. Safeguards include explicit client boundaries, GSAP cleanup, reduced-motion support and SSR-safe localStorage hydration.

## 0D — PostgreSQL + Prisma ✅

Verified locally by the project owner:
- PostgreSQL Compose container healthy on host port `5433`;
- Prisma validation/generation/migration/seed succeeded;
- `GET /api/health/database` returned HTTP 200.

Prisma remains pinned to 7.10.0. Only the minimal `SystemSetting` foundation model exists; User/Auth/Post/CMS models remain deferred.

## 0E — Redis/BullMQ boundary ✅

Verified locally by the project owner:
- Redis Compose service healthy on host port `6380`;
- `GET /api/health/redis` returned HTTP 200;
- typecheck/build remained green.

The boundary includes a server-only Redis client, BullMQ producer factory, queue/job contracts and retry defaults. It intentionally includes no real workers/product jobs yet.

## 0F — CI and developer experience 🟡

### Implemented

- ESLint 9 + Next.js core-web-vitals/TypeScript configuration.
- `npm run lint`.
- Node test-runner baseline via `tsx --test`.
- Initial utility tests for canonical slug formatting.
- `npm run test`.
- Aggregate `npm run verify` command:

```text
db:validate → lint → typecheck → test → build
```

- GitHub Actions workflow at `.github/workflows/ci.yml`.
- CI provisions isolated PostgreSQL 16 and Redis 7 service containers.
- CI applies migrations + seed before lint/typecheck/test/build.
- CI runs on `main` pushes and pull requests with concurrency cancellation.

### Lockfile migration note

The committed `package-lock.json` predates the Next.js/Prisma/Redis migration and is stale. CI therefore temporarily uses `npm install`, not `npm ci`.

**0F is not fully complete until a refreshed lockfile generated from current `package.json` is committed.** Once that happens, CI must switch to `npm ci` and dependency caching may be enabled safely.

### Local verification gate

```powershell
git pull origin main
npm install
npm run lint
npm run typecheck
npm run test
npm run build
# or run the aggregate check:
npm run verify
```

Infrastructure should remain healthy:

```powershell
docker compose ps
```

### Gate

0F becomes ✅ only when:
- local lint/typecheck/test/build pass;
- GitHub Actions run is green;
- refreshed current lockfile is committed;
- CI is switched from `npm install` to `npm ci`;
- README setup matches the actual workflow.

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
0E ✅ Redis / BullMQ verified
      ↓
0F 🟡 CI + lockfile verification
      ↓
0G regression QA
      ↓
Phase 0 complete
      ↓
Phase 1 Auth/RBAC
```

## Phase 0 definition of done

Phase 0 is complete only when the Next.js runtime is verified, V2.1 remains visually intact, browser/client boundaries are stable, PostgreSQL/Prisma and Redis/BullMQ foundations are reproducible, CI/dependency installation is deterministic, documentation describes reality and no Phase 1+ feature is falsely claimed as complete.
