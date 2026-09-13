# ✍️ Phase 2 — Production CMS & Media Plan

> Goal: replace the temporary localStorage publishing demo with durable, server-authorized editorial content while preserving the accepted V2.1 reading/admin experience.

## Status

**🟡 IN PROGRESS — core persistence, authorized CMS workflows, public DB reads, revision history, autosave, preview, scheduled publishing infrastructure and Cloudinary-backed media upload are implemented. Final verification/regression and deployment configuration remain.**

Phase 1 authentication code is in place and working locally, but final ADMIN/EDITOR security-matrix verification must still be recorded before either phase is marked complete.

## Core principles

- PostgreSQL is canonical; localStorage is not production content storage.
- Every write is authenticated and authorized server-side.
- Public pages read only publishable canonical content.
- Editorial revisions are immutable snapshots, not overwritten history.
- Slug changes and publishing transitions are explicit application operations.
- Media metadata is durable and provider-backed.
- The V2.1 visual language is preserved; Phase 2 changes data/workflow, not brand identity.

## 2A — Content domain persistence ✅ IMPLEMENTED

Implemented Prisma models/enums:

- `Post`
- `PostRevision`
- `Category`
- `Tag`
- `PostTag`
- `MediaAsset`
- `PostStatus`: `DRAFT`, `IN_REVIEW`, `SCHEDULED`, `PUBLISHED`, `ARCHIVED`

The content schema covers slug/title/dek/body JSON, author display metadata, category/tags, cover media, read time, featured/trending, SEO fields, publish/schedule timestamps and creator/updater attribution.

The production-content migration has already applied successfully in the project owner's local PostgreSQL environment and the six V2.1 seed stories were imported.

## 2B — Application/repository layer ✅ IMPLEMENTED

Server-only content modules now provide:

- validation schemas;
- public read queries;
- CMS list/detail queries;
- create/update services;
- controlled publication transitions;
- revision snapshots and restore;
- slug normalization/uniqueness handling;
- media association validation.

UI components do not import Prisma directly.

## 2C — Authorized CMS mutations ✅ IMPLEMENTED

Implemented authenticated endpoints include:

```text
GET    /api/admin/posts
POST   /api/admin/posts
GET    /api/admin/posts/:id
PATCH  /api/admin/posts/:id
POST   /api/admin/posts/:id/transition
DELETE /api/admin/posts/:id
GET    /api/admin/posts/:id/revisions
POST   /api/admin/posts/:id/revisions/:revisionId/restore
POST   /api/admin/media
```

Mutations use server-side session/capability authorization, same-origin protection, validated inputs and server-owned transition rules.

## 2D — Admin UI migration ✅ CORE IMPLEMENTED

The admin content experience is now API/database backed rather than localStorage backed for production posts.

Implemented UX:

- loading/error/empty states;
- durable draft creation;
- edit/save;
- 12-second dirty-state autosave for persisted stories;
- browser unsaved-change protection;
- review/publish/schedule/archive workflow;
- delete confirmation;
- private saved-version preview;
- revision history and immutable restore-as-new-draft behavior;
- recent-content dashboard backed by PostgreSQL.

Newsletter subscriber demo state intentionally remains temporary until Phase 6.

## 2E — Public canonical read path ✅ IMPLEMENTED

Database-backed published content is used for:

- homepage story sections;
- `/stories`;
- `/stories/[slug]`;
- `/category/[slug]`;
- search;
- related/trending content;
- story metadata generation.

Only `PUBLISHED` rows with eligible publish timing are public.

## 2F — Revisions, media, preview and scheduling 🟡 IMPLEMENTED / CONFIGURATION PENDING

### Revisions ✅

- canonical snapshots are created on save/transition;
- revision history is visible in the editor;
- restoring an older revision creates a new `DRAFT` revision rather than mutating history.

### Preview ✅

- `/preview/:id` is authenticated;
- unpublished content can be reviewed using the public story presentation;
- preview metadata is `noindex`, `nofollow`, `nocache`.

### Autosave ✅

- persisted stories autosave after a dirty interval;
- unsaved state is visible;
- browser close/reload receives unsaved-change protection.

### Scheduled publishing ✅ CODE IMPLEMENTED

- scheduling creates an idempotent BullMQ delayed job;
- unschedule/archive/restore paths cancel stale jobs;
- `scripts/scheduled-publish-worker.ts` publishes due posts server-side;
- worker startup and one-minute reconciliation recover scheduled rows that are missing Redis jobs;
- run with `npm run worker:scheduled-publish`.

Production deployment still needs a continuously running worker process alongside the Next.js application.

### Media 🟡 CODE IMPLEMENTED / CREDENTIALS REQUIRED

Cloudinary is the selected Phase 2 image-storage provider.

Implemented:

- authenticated image upload endpoint;
- JPEG/PNG/WebP validation;
- 10 MB size limit;
- required alt text and optional attribution;
- server-only signed Cloudinary upload;
- durable `MediaAsset` metadata persistence;
- cover-media relation on `Post`;
- editor upload UI plus external-URL fallback.

Required deployment/local configuration before uploads can succeed:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

These values must remain server-only.

## 2G — Phase 2 regression ⬜ PENDING

Still required before Phase 2 can be called complete:

- `npm run verify` after the latest CMS batch;
- run `npm run worker:scheduled-publish` and test a real scheduled publication;
- configure Cloudinary and test a real upload;
- ADMIN and EDITOR end-to-end publishing flow;
- direct endpoint authorization checks;
- revision restore regression;
- preview/noindex check;
- autosave/unsaved-warning regression;
- public visibility rules;
- story metadata regression;
- responsive/admin visual regression;
- final documentation synchronization.

## Exit criteria

Phase 2 is complete only when:

- production story content persists in PostgreSQL;
- localStorage is no longer canonical for posts;
- authorized editors can create/edit/review/publish durable content;
- transitions are enforced server-side;
- revisions are durable and restorable;
- public pages render canonical published DB content;
- Cloudinary media upload works with configured production credentials;
- scheduled publishing worker is deployed and verified;
- automated tests and `npm run verify` pass;
- Phase 1 auth remains intact under ADMIN/EDITOR testing;
- README/architecture/roadmap describe the verified reality.
