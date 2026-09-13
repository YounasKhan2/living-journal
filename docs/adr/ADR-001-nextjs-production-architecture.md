# ADR-001 — Adopt Next.js as the production application runtime

- **Status:** Accepted
- **Date:** 2026-09-13
- **Decision owners:** Living Journal maintainers
- **Supersedes:** Open choice between Vite + NestJS and integrated Next.js architecture

## Context

The Living Journal is an SEO-heavy editorial product. Its public pages need crawlable HTML, per-story metadata, canonical URLs, dynamic sitemap/RSS generation, previews, scheduled publishing, authenticated admin workflows and eventually Content Radar/AI/newsletter/monetization capabilities.

V2.1 is a working React + Vite frontend and must remain the visual baseline. The goal of Phase 0 is not to redesign the application; it is to establish the production runtime without losing the current UI/UX.

Two options were considered:

1. Keep Vite for the frontend and add a separate NestJS API.
2. Migrate the React application to Next.js App Router and use its server runtime for the initial application/backend boundary.

## Decision

We will migrate to **Next.js App Router + TypeScript** as the production application runtime.

The initial production stack will be:

- **Next.js App Router** — public rendering, route handlers/server actions where appropriate, metadata and application runtime
- **React + TypeScript** — existing component model preserved
- **Existing CSS token/global/polish layers + GSAP** — visual system preserved during migration
- **PostgreSQL** — canonical durable database
- **Prisma** — schema, migrations and typed database access
- **Redis** — introduced when required for rate limiting, caching and jobs
- **BullMQ** — introduced before durable ingestion/scheduled publishing/newsletter job workflows
- **S3-compatible storage or Cloudinary adapter** — later in CMS/media phase
- Provider adapters for AI, email, analytics and external content sources

We are deliberately **not** creating a separate NestJS service during Phase 0. If system scale or organizational needs later justify service extraction, the server modules/adapters should be designed so they can be moved without rewriting the domain model.

## Why Next.js

### 1. SEO is a first-class requirement

The publication needs server-rendered/crawlable stories, dynamic metadata, canonical links, structured data, RSS and sitemaps. Next.js provides a natural production path without maintaining a separate SSR layer around Vite.

### 2. The current UI is already React

Most components can be migrated rather than rewritten. Client-only motion and browser behavior can remain in focused client components while article/layout/data surfaces can use server rendering.

### 3. One deployment boundary is appropriate now

The product is still a single publication, not a distributed enterprise platform. A separate frontend/API service would add deployment, auth, CORS, DTO and operational complexity before it creates real value.

### 4. Server/client separation can still be strict

Using one Next.js application does not mean mixing concerns. Database, auth, queues, provider adapters and domain services will remain under explicit server-only modules.

## Rejected alternative — Vite + NestJS

Vite + NestJS remains technically valid and would provide a very explicit service boundary. We are not choosing it now because:

- the public publication would still need an SSR/prerender strategy;
- two runtimes/deployments add complexity for a small team;
- auth/session handling becomes more involved across frontend/backend boundaries;
- many product requirements fit comfortably inside a modular Next.js application today.

This alternative may be reconsidered only through a new ADR if future requirements justify service extraction.

## Migration constraints

The migration must obey these rules:

1. **No visual redesign during Phase 0.** V2.1 is the reference UI.
2. Do not rewrite CSS into Tailwind merely because Next.js is introduced.
3. Preserve reusable components wherever practical.
4. Keep GSAP only in client components that actually need browser APIs.
5. Do not connect production content persistence until database/runtime foundation is verified.
6. Do not implement auth, Content Radar, AI or monetization early just because the new runtime makes it possible.
7. Keep the current Vite version recoverable in Git history throughout migration.

## Target application boundaries

```text
src/
├── app/                      # Next.js routes/layouts/metadata
├── components/               # reusable UI
├── features/                 # domain-facing UI modules
├── server/
│   ├── db/                   # Prisma client/repositories
│   ├── services/             # application/domain services
│   ├── auth/                 # Phase 1
│   ├── jobs/                 # later BullMQ workers/producers
│   └── adapters/             # email, AI, sources, storage, analytics
├── styles/
├── types/
└── lib/

prisma/
└── schema.prisma
```

The existing `screens/` structure can be retained while migrating and reduced gradually only where Next.js route composition makes a clearer boundary. File movement is not a goal by itself.

## Deployment direction

Initial recommendation:

- **Web/application:** Vercel or another Node-compatible Next.js deployment
- **PostgreSQL:** managed Postgres provider
- **Redis:** managed Redis when jobs/rate limiting are introduced
- **Workers:** separate long-running worker runtime when BullMQ is introduced; do not assume serverless request handlers can safely run persistent workers

Provider selection is intentionally deferred until environment/cost requirements are implemented and documented.

## Consequences

### Positive

- Stronger SEO and metadata path.
- Fewer application runtimes in early production.
- Easier server-rendered article delivery.
- Existing React UI remains useful.
- Cleaner path to secure server-side content operations.

### Trade-offs

- Existing React Router routes must be mapped to App Router routes.
- GSAP/browser-only code requires explicit client boundaries.
- Background workers still need a separate runtime once BullMQ arrives.
- Team must respect server/client module boundaries to avoid bloated client bundles or leaked secrets.

## Verification required before ADR implementation is considered complete

- All current public/internal routes have an equivalent Next.js route.
- V2.1 visual behavior is manually compared before/after migration.
- Production build passes.
- Direct navigation to internal routes works without SPA fallback assumptions.
- No server secret/database module appears in client bundles.
- README/setup/architecture docs match the implemented runtime.
