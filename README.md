<div align="center">

# 📰 The Living Journal

### A human-led, AI-assisted technology publication

**Discover → Research → Edit → Publish → Distribute → Monetize**

![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.10-2D3748?logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![BullMQ](https://img.shields.io/badge/BullMQ-Scheduled%20Publishing-f59e0b)
![Auth](https://img.shields.io/badge/Auth-Implemented-2563eb)
![CMS](https://img.shields.io/badge/CMS-In%20Progress-f59e0b)
![GSAP](https://img.shields.io/badge/GSAP-Motion-88CE02)

A premium editorial experience evolving into a production publishing platform for **AI, software, startups, products, careers, business and future technology**.

[PRD](docs/PRD.md) · [Architecture](docs/ARCHITECTURE.md) · [Roadmap](docs/ROADMAP.md) · [Phase 1](docs/PHASE-1-AUTH-PLAN.md) · [Phase 2](docs/PHASE-2-CMS-PLAN.md)

</div>

---

## ✨ Product principle

> **APIs discover. AI assists. Humans decide. The Journal publishes.**

The Living Journal is deliberately **not** an autonomous news scraper. Original publishing remains first-class; future RSS/API items enter a Content Radar and AI remains an editorial assistant.

---

## 🚦 Current status

| Milestone | Status |
|---|---|
| V2.1 editorial UI baseline | ✅ Stable |
| Phase 0 — Production foundation | ✅ Complete |
| Phase 1 — Auth/RBAC | 🟡 Implemented, final security verification pending |
| Phase 2A — Content persistence | ✅ Implemented |
| Phase 2B — Content application layer | ✅ Implemented |
| Phase 2C — Authorized CMS APIs | ✅ Implemented |
| Phase 2D — Database-backed admin workflow | ✅ Core implemented |
| Phase 2E — Public database read path | ✅ Implemented |
| Revisions + restore | ✅ Implemented |
| Autosave + unsaved warning | ✅ Implemented |
| Private editorial preview | ✅ Implemented |
| Scheduled publishing worker | 🟡 Implemented, runtime verification pending |
| Cloudinary media upload | 🟡 Implemented, credentials/real upload verification pending |
| Phase 3 — Content Radar | ⬜ Planned |

Detailed roadmap: [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## 🧱 Active production architecture

```mermaid
flowchart TB
  Reader[Readers] --> Next[Next.js App Router]
  Editor[Admins / Editors] --> Auth[Server Auth + RBAC]
  Auth --> CMS[Admin CMS]
  Next --> DB[(PostgreSQL + Prisma)]
  CMS --> DB
  CMS --> Media[Cloudinary Media Adapter]
  CMS --> Queue[BullMQ scheduled-publish]
  Queue --> Redis[(Redis)]
  Redis --> Worker[Scheduled Publish Worker]
  Worker --> DB
```

### Authentication

The CMS uses server-side email/password authentication with Argon2id hashing, opaque hashed database sessions, HttpOnly cookies, ADMIN/EDITOR capabilities, Redis login throttling and same-origin mutation protection.

No public signup or default admin credentials exist. Create the first administrator explicitly:

```powershell
npm run auth:bootstrap-admin
```

### Production CMS

PostgreSQL is canonical for stories. The CMS currently supports durable drafts, editing, review, scheduling, publishing, archiving, immutable revision snapshots, revision restore, autosave, protected preview and database-backed public story rendering.

Import the original V2.1 sample stories once when preparing a new local database:

```powershell
npm run cms:import-seed
```

### Scheduled publishing

Scheduling creates BullMQ delayed jobs. A separate continuously running worker performs due publications and periodically reconciles scheduled database rows with Redis jobs:

```powershell
npm run worker:scheduled-publish
```

Run this alongside the Next.js process in environments where scheduled publishing is enabled.

### Media uploads

Cloudinary is the selected Phase 2 image-storage provider. The application persists provider/storage metadata, dimensions, MIME type, alt text and attribution in `MediaAsset`.

Add these **server-only** values to `.env` / deployment secrets before testing uploads:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Never use `NEXT_PUBLIC_` prefixes for these credentials.

---

## 🔁 Quality workflow

The repository provides one deterministic local verification path:

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

Run everything with:

```powershell
npm run verify
```

GitHub-hosted Actions is intentionally not required because the repository account cannot start hosted runners without resolving a billing restriction. The committed lockfile plus `npm ci` and `npm run verify` are the canonical reproducibility checks.

---

## 🗂️ Important structure

```text
prisma/
├── schema.prisma
├── seed.ts
└── migrations/

scripts/
├── bootstrap-admin.ts
├── import-seed-posts.ts
└── scheduled-publish-worker.ts

src/
├── app/
│   ├── (public)/
│   ├── admin/
│   ├── preview/[id]/
│   └── api/
│       ├── auth/
│       ├── admin/
│       │   ├── posts/
│       │   └── media/
│       └── health/
├── server/
│   ├── auth/
│   ├── content/
│   ├── db/
│   ├── jobs/
│   ├── media/
│   └── redis/
├── screens/
├── components/
├── styles/
└── utils/

docs/
├── adr/
├── PRD.md
├── ARCHITECTURE.md
├── ROADMAP.md
├── PHASE-1-AUTH-PLAN.md
└── PHASE-2-CMS-PLAN.md
```

---

## 🛠️ Local setup

### Requirements

- Node.js 20+ (Node.js 22 recommended)
- npm
- Docker Desktop **or** your own PostgreSQL + Redis instances
- Cloudinary account only when testing real media uploads

### 1. Pull and install

```powershell
git pull origin main
npm ci
```

### 2. Environment

For a fresh clone:

```powershell
Copy-Item .env.example .env
```

If `.env` or `.env.local` already exists, **do not overwrite it**. Merge new variables manually.

Core local infrastructure:

```env
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

### 5. Bootstrap CMS access

```powershell
npm run auth:bootstrap-admin
```

Optional first-time content import:

```powershell
npm run cms:import-seed
```

### 6. Verify

```powershell
npm run verify
```

### 7. Run the application

Terminal 1:

```powershell
npm run dev
```

Terminal 2 when testing scheduled publishing:

```powershell
npm run worker:scheduled-publish
```

---

## 🌐 Useful local routes

```text
http://localhost:3000
http://localhost:3000/login
http://localhost:3000/admin
http://localhost:3000/admin/posts
http://localhost:3000/api/health
http://localhost:3000/api/health/database
http://localhost:3000/api/health/redis
```

`/preview/:id` is authenticated and intentionally excluded from indexing.

---

## 🧪 Useful scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Next.js development server |
| `npm run worker:scheduled-publish` | Run durable scheduled publishing worker |
| `npm run verify` | Full local quality gate |
| `npm run auth:bootstrap-admin` | Securely create the first ADMIN |
| `npm run cms:import-seed` | Import starter V2.1 stories into PostgreSQL |
| `npm run db:deploy` | Apply committed migrations |
| `npm run db:studio` | Open Prisma Studio |

---

## 🤖 Contributor / AI-agent rules

Before substantial work, read:

1. [`docs/PRD.md`](docs/PRD.md)
2. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
3. [`docs/ROADMAP.md`](docs/ROADMAP.md)
4. the active phase plan

Non-negotiables:

- preserve the accepted V2.1 editorial identity unless a design change is explicitly approved;
- keep browser APIs in client boundaries;
- keep database/Redis/Cloudinary/provider credentials server-side;
- never commit `.env` or provider credentials;
- treat PostgreSQL as canonical content storage;
- require server authorization for CMS mutations;
- keep revision history immutable;
- do not let AI or ingestion auto-publish content;
- run `npm run verify` before calling implementation complete;
- update documentation whenever setup, architecture, workflow or phase status changes;
- never call a phase complete before its verification gate passes.

---

<div align="center">

### The Living Journal

**Minimal, not empty. Editorial, not generic. Automated where useful, human where it matters.**

`Foundation ✅ → Auth 🟡 → CMS 🟡 → Radar ⬜ → AI ⬜ → SEO ⬜ → Audience ⬜ → Revenue ⬜`

</div>
