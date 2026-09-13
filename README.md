<div align="center">

# 📰 The Living Journal

### A human-led, AI-assisted technology publication

**Discover → Research → Edit → Publish → Distribute → Monetize**

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?logo=prisma&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-Motion-88CE02)
![Phase](https://img.shields.io/badge/Phase%200D-Verification%20Gate-f59e0b)

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
| 0D — PostgreSQL + Prisma foundation | 🟡 Implemented; fresh-DB verification now |
| 0E — Redis/queue boundary | ⬜ Planned |
| 0F — CI + reproducible setup | ⬜ Planned |
| 0G — final regression QA | ⬜ Planned |
| Phase 1 — Auth/RBAC | ⬜ Planned |
| Phase 2 — Production CMS | ⬜ Planned |

Detailed gates: [`docs/PHASE-0-MIGRATION-PLAN.md`](docs/PHASE-0-MIGRATION-PLAN.md).

---

## 🗄️ Phase 0D — database foundation

The repository now includes a deliberately small production data foundation:

```text
PostgreSQL 16
     ↓
Prisma ORM 7.10 (pinned)
     ↓
@prisma/adapter-pg
     ↓
server-only Prisma client
     ↓
Next.js server routes/services
```

### Added

- `prisma/schema.prisma`
- `prisma.config.ts`
- committed initial migration
- explicit Prisma seed
- server-only environment validation with Zod
- server-only Prisma singleton
- `GET /api/health/database`
- optional local PostgreSQL service in `compose.yaml`
- database scripts in `package.json`

### Why the schema is tiny

Only `SystemSetting` exists in Phase 0. It proves migrations, JSONB, Prisma generation, seeding and server-side connectivity **without prematurely implementing Auth or CMS models**.

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
│   └── api/
│       └── health/
│           ├── route.ts
│           └── database/route.ts
├── server/
│   ├── env.ts
│   └── db/prisma.ts
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
- Docker Desktop **or** your own PostgreSQL instance

### 1. Pull and install

```powershell
git pull origin main
npm install
```

### 2. Create environment file

```powershell
Copy-Item .env.example .env
```

Default local value:

```text
DATABASE_URL=postgresql://living_journal:living_journal@localhost:5432/living_journal?schema=public
```

Never commit `.env`.

### 3. Start PostgreSQL

With Docker:

```powershell
docker compose up -d postgres
docker compose ps
```

If you already run PostgreSQL yourself, skip Docker and update `DATABASE_URL`.

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
```

Expected DB health response is HTTP **200** and includes:

```json
{
  "status": "ok",
  "dependency": "postgresql"
}
```

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

## 🌐 Runtime routes

Public/editorial routes remain unchanged from V2.1/Next migration. Runtime checks now include:

```text
GET /api/health
GET /api/health/database
```

The second endpoint intentionally returns **503** if PostgreSQL is unavailable; it does not leak credentials or raw errors to clients.

---

## 🧱 Accepted architecture

```mermaid
flowchart TB
  Public[Public Publication] --> Next[Next.js App Router]
  CMS[Admin CMS] --> Next
  Next --> Server[Server/Application Layer]
  Server --> DB[(PostgreSQL + Prisma)]
  Server --> Storage[(Object Storage - later)]
  Server --> Redis[(Redis / BullMQ - Phase 0E+)]
  Sources[RSS / APIs - later] --> Workers[Workers]
  Workers --> DB
```

We are intentionally **not** running a separate NestJS service at this stage. See [`ADR-001`](docs/adr/ADR-001-nextjs-production-architecture.md).

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
- keep database/provider/secrets server-side;
- never commit `.env` or provider credentials;
- do not add User/Post/Auth/CMS models during Phase 0D;
- do not implement Phase 1+ features early;
- update README/docs whenever setup, architecture, workflow or phase status changes;
- never call a phase complete before its verification gate passes.

---

<div align="center">

### The Living Journal

**Minimal, not empty. Editorial, not generic. Automated where useful, human where it matters.**

`V2.1 ✅ → Next.js ✅ → SSR/GSAP ✅ → PostgreSQL/Prisma 🟡 → Queue → CI → QA → Auth`

</div>
