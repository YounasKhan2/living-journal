<div align="center">

# 📰 The Living Journal

### A human-led, AI-assisted technology publication

**Discover → Research → Edit → Publish → Distribute → Monetize**

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-Queue%20Boundary-f59e0b)
![CI](https://img.shields.io/badge/CI-Verification%20Gate-f59e0b?logo=githubactions)
![GSAP](https://img.shields.io/badge/GSAP-Motion-88CE02)

A premium editorial experience evolving into a production publishing platform for **AI, software, startups, products, careers, business and future technology**.

[PRD](docs/PRD.md) · [Architecture](docs/ARCHITECTURE.md) · [Roadmap](docs/ROADMAP.md) · [ADR-001](docs/adr/ADR-001-nextjs-production-architecture.md) · [Phase 0 Plan](docs/PHASE-0-MIGRATION-PLAN.md)

</div>

---

## ✨ Product principle

> **APIs discover. AI assists. Humans decide. The Journal publishes.**

The Living Journal is deliberately **not** an autonomous news scraper. Original publishing remains first-class; future RSS/API items enter a Content Radar and AI remains an editorial assistant.

```mermaid
flowchart LR
  Sources[RSS / Approved APIs] --> Radar[Content Radar]
  Manual[Original Story] --> Draft[Editorial Draft]
  Radar --> Research[Research]
  Research --> AI[AI Assistance]
  AI --> Draft
  Draft --> Review[Human Review]
  Review --> Publish[Publish / Schedule]
  Publish --> Web[Website + SEO]
  Publish --> Newsletter[Newsletter]
  Web --> Revenue[Ads / Affiliate / Sponsors]
```

---

## 🚦 Current status

| Milestone | Status |
|---|---|
| V2.1 editorial UI baseline | ✅ Stable |
| 0A — Freeze V2.1 | ✅ Complete |
| 0B — Next.js App Router | ✅ Complete |
| 0C — GSAP + SSR/client verification | ✅ Passed locally |
| 0D — PostgreSQL + Prisma | ✅ Passed locally |
| 0E — Redis/BullMQ boundary | ✅ Passed locally |
| 0F — CI + developer workflow | 🟡 Implemented; verification + lockfile sync |
| 0G — final regression QA | ⬜ Planned |
| Phase 1 — Auth/RBAC | ⬜ Planned |
| Phase 2 — Production CMS | ⬜ Planned |

Detailed gates: [`docs/PHASE-0-MIGRATION-PLAN.md`](docs/PHASE-0-MIGRATION-PLAN.md).

---

## 🧱 Production foundation

```mermaid
flowchart TB
  Public[Public Publication] --> Next[Next.js App Router]
  CMS[Admin CMS - later] --> Next
  Next --> Server[Server/Application Layer]
  Server --> DB[(PostgreSQL + Prisma)]
  Server --> Queue[BullMQ producer boundary]
  Queue --> Redis[(Redis)]
  Redis -. future .-> Workers[Durable workers]
  Workers -. later phases .-> DB
```

### Database ✅

PostgreSQL 16 + Prisma 7.10 are verified locally. The deliberately tiny `SystemSetting` model proves migration, seed and server connectivity without prematurely implementing Auth/CMS models.

### Queue boundary ✅

Redis 7 + BullMQ are verified locally. Phase 0 defines the connection/producer contracts but **does not start real workers or fake product jobs**.

| Queue | Owning future workflow |
|---|---|
| `content-ingestion` | Phase 3 Content Radar |
| `scheduled-publish` | Production CMS lifecycle |
| `newsletter-send` | Phase 6 Audience/newsletter |
| `ai-background` | Phase 4 AI Editorial Copilot |

---

## 🔁 Quality workflow

Phase 0F adds one consistent verification path for humans, coding agents and GitHub Actions:

```text
Prisma schema validation
        ↓
ESLint
        ↓
TypeScript
        ↓
Unit tests
        ↓
Next.js production build
```

Run everything locally with:

```powershell
npm run verify
```

Or individually:

```powershell
npm run db:validate
npm run lint
npm run typecheck
npm run test
npm run build
```

GitHub Actions also provisions isolated **PostgreSQL 16 + Redis 7** services, applies the committed migration + seed, then performs the same code-quality/build checks.

### ⚠️ Temporary lockfile gate

The committed `package-lock.json` is still from the original Vite-era prototype. The current CI therefore uses:

```text
npm install
```

instead of `npm ci`.

After pulling Phase 0F, your local `npm install` will regenerate the lockfile from the current Next.js/Prisma/Redis/ESLint dependency graph. Once that refreshed lockfile is committed, CI will be switched to deterministic `npm ci`. **0F is not marked complete until this is done.**

---

## 🗂️ Important structure

```text
.github/
└── workflows/
    └── ci.yml

prisma/
├── schema.prisma
├── seed.ts
└── migrations/

src/
├── app/
│   ├── (public)/
│   ├── admin/
│   └── api/health/
│       ├── route.ts
│       ├── database/route.ts
│       └── redis/route.ts
├── server/
│   ├── env.ts
│   ├── db/prisma.ts
│   ├── redis/client.ts
│   └── jobs/
│       ├── contracts.ts
│       └── queue.ts
├── screens/
├── components/
├── styles/
└── utils/
    ├── format.ts
    └── format.test.ts

docs/
├── adr/
├── PRD.md
├── ARCHITECTURE.md
├── ROADMAP.md
└── PHASE-0-MIGRATION-PLAN.md
```

The V2.1 visual layer remains frozen while infrastructure work continues.

---

## 🛠️ Local setup

### Requirements

- Node.js 20+ (CI uses Node.js 22)
- npm
- Docker Desktop **or** your own PostgreSQL + Redis instances

### 1. Pull and install

```powershell
git pull origin main
npm install
```

### 2. Environment

For a fresh clone:

```powershell
Copy-Item .env.example .env
```

If `.env` or `.env.local` already exists, **do not overwrite it**. Merge new variables manually.

Default local infrastructure values:

```text
DATABASE_URL=postgresql://living_journal:living_journal@localhost:5433/living_journal?schema=public
REDIS_URL=redis://localhost:6380
```

Never commit `.env`.

### 3. Start infrastructure

```powershell
docker compose up -d postgres redis
docker compose ps
```

Expected host mappings:

```text
PostgreSQL  localhost:5433 → container:5432
Redis       localhost:6380 → container:6379
```

### 4. Prepare database

```powershell
npm run db:validate
npm run db:generate
npm run db:deploy
npm run db:seed
```

### 5. Verify the repository

```powershell
npm run verify
```

### 6. Run the application

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/api/health
http://localhost:3000/api/health/database
http://localhost:3000/api/health/redis
```

---

## 🧪 Useful scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run lint` | Run ESLint/Next rules |
| `npm run typecheck` | Generate Prisma client + TypeScript check |
| `npm run test` | Run baseline Node/TS tests |
| `npm run build` | Generate Prisma client + production Next build |
| `npm run verify` | Run the full local quality gate |
| `npm run db:validate` | Validate Prisma schema/config |
| `npm run db:generate` | Generate typed Prisma client |
| `npm run db:migrate` | Create/apply development migration |
| `npm run db:deploy` | Apply committed migrations |
| `npm run db:seed` | Seed foundation data |
| `npm run db:studio` | Open Prisma Studio |

---

## 🌐 Runtime health routes

```text
GET /api/health
GET /api/health/database
GET /api/health/redis
```

Dependency endpoints return **503** when unavailable and never expose connection strings or raw internal errors to clients.

---

## 🤖 Contributor / AI-agent rules

Before substantial work, read in order:

1. [`docs/PRD.md`](docs/PRD.md)
2. [`docs/adr/ADR-001-nextjs-production-architecture.md`](docs/adr/ADR-001-nextjs-production-architecture.md)
3. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
4. [`docs/PHASE-0-MIGRATION-PLAN.md`](docs/PHASE-0-MIGRATION-PLAN.md)
5. [`docs/ROADMAP.md`](docs/ROADMAP.md)

Non-negotiables:

- preserve V2.1 visual behavior during Phase 0;
- keep browser APIs in client boundaries;
- keep database/Redis/provider credentials server-side;
- never commit `.env` or provider credentials;
- do not implement User/Auth/Post/CMS models during infrastructure-only subphases;
- do not enqueue jobs before their owning feature has a real worker + idempotency design;
- run `npm run verify` before calling implementation complete;
- update README/docs whenever setup, architecture, workflow or phase status changes;
- never call a phase complete before its verification gate passes.

---

<div align="center">

### The Living Journal

**Minimal, not empty. Editorial, not generic. Automated where useful, human where it matters.**

`V2.1 ✅ → Next.js ✅ → PostgreSQL/Prisma ✅ → Redis/BullMQ ✅ → CI 🟡 → QA → Auth`

</div>
