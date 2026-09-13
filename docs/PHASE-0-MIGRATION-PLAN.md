# ✅ Phase 0 — Production Foundation & Next.js Migration

> **Goal:** establish the production runtime/data/developer-verification foundation without redesigning V2.1 or prematurely implementing Auth/CMS/Radar/AI.

## Completion status

**Phase 0: ✅ COMPLETE**

| Subphase | Scope | Status |
|---|---|---|
| 0A | Freeze/inventory V2.1 | ✅ Complete |
| 0B | Next.js App Router migration | ✅ Complete |
| 0C | GSAP + browser/SSR stabilization | ✅ Verified locally |
| 0D | PostgreSQL + Prisma + env validation | ✅ Verified locally |
| 0E | Redis/BullMQ queue boundary | ✅ Verified locally |
| 0F | Reproducible developer verification | ✅ Verified locally |
| 0G | Visual/manual regression QA | ✅ Verified locally |

Phase 0 deliberately did **not** implement authentication/RBAC, production CMS persistence, Content Radar, AI generation, newsletter delivery or monetization providers.

## 0A — V2.1 baseline ✅

The V2.1 visual baseline remains preserved through the existing screen/component architecture plus `tokens.css`, `global.css` and `polish.css`.

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
- ESLint 9 + Next.js core-web-vitals/TypeScript configuration;
- Node test-runner baseline via `tsx --test`;
- utility tests for canonical slug formatting;
- aggregate `npm run verify` command: `db:validate → lint → typecheck → test → build`;
- current `package-lock.json` committed and deterministic `npm ci` supported;
- local verification passed end-to-end;
- generated TypeScript build metadata ignored.

GitHub-hosted Actions is not part of the required project gate because the account cannot start hosted jobs without resolving a billing restriction. Local deterministic verification is the canonical gate.

## 0G — Visual/manual regression QA ✅

The project owner completed the final browser regression pass after the 0G hardening changes and confirmed it passed. The audit covered the public/admin demo experience, responsive layouts, navigation/interactions, browser/runtime smoke checks and preservation of the accepted V2.1 visual system.

The detailed checklist remains in [`PHASE-0G-QA.md`](PHASE-0G-QA.md).

## Final Phase 0 verification path

```powershell
git pull origin main
npm ci
npm run verify
```

## Phase 0 definition of done — satisfied ✅

Phase 0 exits with:
- Next.js runtime verified;
- V2.1 visually intact;
- browser/client boundaries stable;
- PostgreSQL/Prisma foundation reproducible;
- Redis/BullMQ foundation reproducible;
- deterministic dependency installation and local verification available;
- final regression QA passed;
- documentation aligned with implementation;
- no Phase 1+ feature falsely claimed complete.

## Next

```text
Phase 0 foundation ✅
        ↓
Phase 1 Authentication & RBAC 🟡
```
