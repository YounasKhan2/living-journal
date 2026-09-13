# ✍️ Phase 2 — Production CMS & Media Plan

> Goal: replace the temporary localStorage publishing demo with durable, server-authorized editorial content while preserving the accepted V2.1 reading/admin experience.

## Status

**⬜ PLANNED — implementation may proceed after Phase 1 code is in place; final Phase 1 verification remains required before Phase 2 is called complete.**

## Core principles

- PostgreSQL is canonical; localStorage is not production content storage.
- Every write is authenticated and authorized server-side.
- Public pages read only publishable canonical content.
- Editorial revisions are immutable snapshots, not overwritten history.
- Slug changes and publishing transitions are explicit application operations.
- Media metadata is durable even when provider integration is staged.
- The V2.1 visual language is preserved; Phase 2 changes data/workflow, not brand identity.

## 2A — Content domain persistence

Add Prisma models/enums for:

- `Post`
- `PostRevision`
- `Category`
- `Tag`
- `PostTag`
- `MediaAsset`
- `PostStatus`: `DRAFT`, `IN_REVIEW`, `SCHEDULED`, `PUBLISHED`, `ARCHIVED`

Initial post fields cover the currently rendered/editor-managed contract:

- slug/title/dek/body JSON;
- author display metadata until a dedicated AuthorProfile phase;
- category;
- cover image/media reference;
- read time;
- featured/trending;
- SEO title/meta description;
- published/scheduled timestamps;
- creator/updater attribution.

**Gate:** migration applies cleanly and schema supports existing seed/demo story shape without lossy conversion.

## 2B — Application/repository layer

Create server-only modules under `src/server/content/`:

- validation schemas;
- public read queries;
- CMS list/detail queries;
- create/update draft services;
- publication transition service;
- revision snapshot service;
- slug normalization/uniqueness handling.

UI components must not import Prisma directly.

**Gate:** domain tests cover validation, status transitions and slug rules.

## 2C — Authorized CMS mutations

Expose server Route Handlers for admin UI needs, initially:

```text
GET    /api/admin/posts
POST   /api/admin/posts
GET    /api/admin/posts/:id
PATCH  /api/admin/posts/:id
POST   /api/admin/posts/:id/transition
DELETE /api/admin/posts/:id
```

Rules:

- session required;
- capability required (`content:write` or `content:publish`);
- same-origin protection on mutations;
- validated request bodies only;
- generic server errors to clients;
- revision created for meaningful saved changes;
- transition rules enforced on server.

## 2D — Admin UI migration

Replace localStorage post reads/writes with API-backed state while retaining existing screens/components.

Required UX:

- loading/error/empty states;
- create draft;
- edit/save;
- publish/review/schedule controls matching server state;
- delete/archive confirmation;
- no optimistic state that can silently diverge from server truth.

Newsletter subscriber demo state may remain temporary until Phase 6.

## 2E — Public canonical read path

Move public content to server-backed queries:

- homepage story sections;
- `/stories`;
- `/stories/[slug]`;
- `/category/[slug]`;
- related/trending queries;
- story metadata generation.

Only `PUBLISHED` content with valid publish timing is public.

## 2F — Revisions and media foundation

Revisions:

- capture canonical snapshot on save/transition;
- show revision history in admin;
- support explicit restore through a new draft revision rather than mutating history.

Media foundation:

- persist provider/storage key, MIME type, size, dimensions, alt text and attribution;
- provider access remains behind an adapter;
- no browser blob URLs as durable assets.

A concrete object-storage provider must be selected before upload UI is called production-ready.

## 2G — Phase 2 regression

- `npm run verify`;
- DB migration/seed verification;
- ADMIN and EDITOR end-to-end publishing flow;
- direct endpoint authorization checks;
- public visibility rules;
- story metadata regression;
- responsive/admin visual regression;
- documentation synchronization.

## Exit criteria

Phase 2 is complete only when:

- production story content persists in PostgreSQL;
- localStorage is no longer canonical for posts;
- authorized editors can create/edit/review/publish durable content;
- transitions are enforced server-side;
- revisions are durable;
- public pages render canonical published DB content;
- persistent media storage is wired for publication assets;
- automated tests and `npm run verify` pass;
- Phase 1 auth remains intact;
- README/architecture/roadmap describe reality.
