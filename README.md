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
![GSAP](https://img.shields.io/badge/GSAP-Motion-88CE02)
![Phase](https://img.shields.io/badge/Phase%200E-Verification%20Gate-f59e0b)

A premium editorial experience evolving into a production publishing platform for **AI, software, startups, products, careers, business and future technology**.

[PRD](docs/PRD.md) · [Architecture](docs/ARCHITECTURE.md) · [Roadmap](docs/ROADMAP.md) · [ADR-001](docs/adr/ADR-001-nextjs-production-architecture.md) · [Phase 0 Plan](docs/PHASE-0-MIGRATION-PLAN.md)

</div>

---

## ✨ Product principle

> **APIs discover. AI assists. Humans decide. The Journal publishes.**

The product is deliberately **not** an autonomous news scraper. Original publishing remains first-class; future RSS/API items enter a Content Radar and AI remains an editorial assistant.

---

## 🚦 Current status

| Milestone | Status |
|---|---|
| V2.1 editorial UI baseline | ✅ Stable |
| 0A — Freeze V2.1 | ✅ Complete |
| 0B — Next.js App Router | ✅ Complete |
| 0C — GSAP + SSR/client verification | ✅ Passed locally |
| 0D — PostgreSQL + Prisma foundation | ✅ Passed locally |
| 0E — Redis/BullMQ boundary | 🟡 Implemented; local verification now |
| 0F — CI + reproducible setup | ⬜ Planned |
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

### Queue boundary 🟡

Phase 0E adds Redis 7, `ioredis`, BullMQ contracts and a producer factory. It intentionally adds **no workers and no fake product jobs**. Future phases own the real workloads:

| Queue | Owning future workflow |
|---|---|
| `content-ingestion` | Phase 3 Content Radar |
| `scheduled-publish` | Production CMS publishing lifecycle |
| `newsletter-send` | Phase 6 Audience/newsletter |
| `ai-background` | Phase 4 AI Editorial Copilot |

---

## 🗂️ Important structure

```text
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
└── styles/

docs/
├── adr/
├── PRD.md
├── ARCHITECTURE.md
├── ROADMAP.md
└── PHASE-0-MIGRATION-PLAN.md
```

The V2.1 visual layer remains frozen while infrastructure work continues.

---

## 🛠️ Fresh local setup

### Requirements

- Node.js 20+
- npm
- Docker Desktop **or** your own PostgreSQL + Redis instances

### 1. Pull and install

```powershell
git pull origin main
npm install
```

### 2. Create environment file on a fresh clone

```powershell
Copy-Item .env.example .env
```

If `.env` already exists, **do not overwrite it**. Add any new variables from `.env.example` manually.

Default local infrastructure values:

```text
DATABASE_URL=postgresql://living_journal:living_journal@localhost:5433/living_journal?schema=public
REDIS_URL=redis://localhost:6380
```

Never commit `.env`.

### 3. Start local infrastructure

```powershell
docker compose up -d postgres redis
docker compose ps
```

Expected host mappings:

```text
PostgreSQL  localhost:5433 → container:5432
Redis       localhost:6380 → container:6379
```

If you run either service yourself, update the corresponding environment URL instead.

### 4. Verify Prisma + database

```powershell
npm run db:validate
npm run db:generate
npm run db:deploy
npm run db:seed
```

Useful optional command:

```powershell
npm run db:studio
```

### 5. Verify application

```powershell
npm run typecheck
npm run build
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/api/health
http://localhost:3000/api/health/database
http://localhost:3000/api/health/redis
```

Expected dependency health responses are HTTP **200** with `dependency: "postgresql"` and `dependency: "redis"` respectively.

---

## 🧪 Database scripts

| Command | Purpose |
|---|---|
| `npm run db:validate` | Validate Prisma schema/config |
| `npm run db:generate` | Generate typed Prisma client |
| `npm run db:migrate` | Create/apply a development migration |
| `npm run db:deploy` | Apply committed migrations |
| `npm run db:seed` | Seed development foundation data |
| `npm run db:studio` | Open Prisma Studio |

`build` and `typecheck` run Prisma generation first so generated types match the committed schema.

---

## 🌐 Runtime health routes

```text
GET /api/health
GET /api/health/database
GET /api/health/redis
```

Dependency endpoints return **503** when unavailable and do not expose connection strings or raw errors to clients.

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
- do not enqueue jobs before their owning feature has a real worker and idempotency design;
- do not implement Phase 1+ features early;
- update README/docs whenever setup, architecture, workflow or phase status changes;
- never call a phase complete before its verification gate passes.

---

<div align="center">

### The Living Journal

**Minimal, not empty. Editorial, not generic. Automated where useful, human where it matters.**

`V2.1 ✅ → Next.js ✅ → PostgreSQL/Prisma ✅ → Redis/BullMQ 🟡 → CI → QA → Auth`

</div>
