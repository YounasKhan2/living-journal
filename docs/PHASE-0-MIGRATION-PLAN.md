# 🚧 Phase 0 — Production Foundation & Next.js Migration Plan

> **Goal:** establish the production runtime/data/developer-verification foundation without redesigning V2.1 or prematurely implementing Auth/CMS/Radar/AI.

## Current checkpoint

| Subphase | Scope | Status |
|---|---|---|
| 0A | Freeze/inventory V2.1 | ✅ Complete |
| 0B | Next.js App Router migration | ✅ Complete |
| 0C | GSAP + browser/SSR stabilization | ✅ Verified locally |
| 0D | PostgreSQL + Prisma + env validation | ✅ Verified locally |
| 0E | Redis/BullMQ queue boundary | ✅ Verified locally |
| 0F | Reproducible developer verification | ✅ Verified locally |
| 0G | Visual/manual regression QA | 🟡 Current |

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

## 0F — Reproducible developer verification ✅

Implemented and verified:
- ESLint 9 + Next.js core-web-vitals/TypeScript configuration.
- `npm run lint`.
- Node test-runner baseline via `tsx --test`.
- Initial utility tests for canonical slug formatting.
- `npm run test`.
- Aggregate `npm run verify` command:

```text
db:validate → lint → typecheck → test → build
```

- Current `package-lock.json` is committed and deterministic `npm ci` installs are supported.
- Local verification passed end-to-end with 0 lint errors, green typecheck, 3/3 baseline tests and a successful production Next.js build.
- Generated TypeScript build metadata is ignored.

GitHub-hosted Actions was evaluated but is not part of the required project gate because the account cannot start hosted jobs without resolving a billing restriction. The hosted workflow has therefore been removed rather than leaving every push with a false red status. Local deterministic verification is the canonical Phase 0F gate.

### Local verification gate

```powershell
git pull origin main
npm ci
npm run verify
```

Infrastructure should remain healthy:

```powershell
docker compose ps
```

### Gate ✅

0F is complete because:
- current dependency lockfile is committed;
- deterministic `npm ci` installation is available;
- local lint/typecheck/test/build pass;
- README setup matches the actual workflow.

## 0G — Visual/manual regression QA 🟡

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
0F ✅ deterministic local verification
      ↓
0G 🟡 regression QA
      ↓
Phase 0 complete
      ↓
Phase 1 Auth/RBAC
```

## Phase 0 definition of done

Phase 0 is complete only when the Next.js runtime is verified, V2.1 remains visually intact, browser/client boundaries are stable, PostgreSQL/Prisma and Redis/BullMQ foundations are reproducible, dependency installation and local verification are deterministic, documentation describes reality and no Phase 1+ feature is falsely claimed as complete.
