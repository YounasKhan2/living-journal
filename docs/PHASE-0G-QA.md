# ✅ Phase 0G — Final Regression QA

> Goal: verify that the accepted V2.1 editorial experience still behaves correctly after the Next.js, Prisma, Redis and developer-foundation migration work.

## Gate

Phase 0G is complete only when:

- every public and admin demo route loads without runtime errors;
- desktop, tablet, mobile and narrow-mobile layouts remain usable;
- the mobile navigation opens/closes correctly, including Escape-key dismissal;
- keyboard focus is visible and navigation remains usable without a mouse;
- reduced-motion mode removes non-essential motion without hiding content;
- there is no horizontal overflow at supported viewport widths;
- hydration/browser console errors are absent;
- article images/layouts remain stable enough to preserve the V2.1 baseline;
- `npm run verify` remains green after any 0G fixes.

## 1. Route matrix

### Public

- [ ] `/`
- [ ] `/stories`
- [ ] `/stories/[slug]` using a known seeded story
- [ ] `/category/ai`
- [ ] `/category/development`
- [ ] `/category/business`
- [ ] `/search`
- [ ] `/newsletter`
- [ ] `/about`
- [ ] `/contact`
- [ ] `/advertise`
- [ ] `/legal/privacy`
- [ ] `/legal/terms`
- [ ] unknown route → custom 404

### Admin demo

- [ ] `/admin`
- [ ] `/admin/posts`
- [ ] `/admin/posts/new`
- [ ] `/admin/posts/[id]/edit` using an existing demo post
- [ ] `/admin/audience`
- [ ] `/admin/settings`

### Runtime health

- [ ] `/api/health` → 200
- [ ] `/api/health/database` → 200 while PostgreSQL is healthy
- [ ] `/api/health/redis` → 200 while Redis is healthy

## 2. Viewport matrix

Check the homepage, stories archive, story detail, one information page and one admin page at minimum:

- [ ] 1440px desktop
- [ ] 1024px laptop/tablet landscape
- [ ] 768px tablet portrait
- [ ] 390px mobile
- [ ] 320px narrow mobile

For each viewport confirm:

- [ ] no horizontal scrollbar;
- [ ] no clipped headings, controls or navigation;
- [ ] readable line lengths and spacing;
- [ ] images do not collapse or overlap text;
- [ ] fixed/sticky UI does not cover important content.

## 3. Navigation and interaction

- [ ] Header links navigate to the expected Next.js routes.
- [ ] Search icon opens `/search`.
- [ ] Subscribe opens `/newsletter`.
- [ ] Mobile menu opens and locks background scrolling.
- [ ] Mobile menu closes via close button.
- [ ] Mobile menu closes with the `Escape` key.
- [ ] Mobile menu closes after following a route.
- [ ] Active primary-navigation state is correct.
- [ ] Browser back/forward navigation behaves normally.
- [ ] Route changes restore expected scroll position.

## 4. Keyboard/accessibility smoke test

- [ ] `Tab` exposes a visible focus indicator.
- [ ] Header navigation is keyboard reachable.
- [ ] Mobile-menu controls are keyboard reachable.
- [ ] Form fields have associated labels.
- [ ] Icon-only controls have accessible labels.
- [ ] Focus never disappears behind an overlay.

This is a smoke gate, not the full accessibility audit planned for the later hardening phase.

## 5. Motion / reduced motion

Normal motion:

- [ ] hero motion initializes once and does not jump on route changes;
- [ ] ticker/reveals remain smooth;
- [ ] ScrollTrigger behavior does not leave pinned/blank sections;
- [ ] animations do not duplicate after navigating away and back.

Reduced motion:

1. Enable **Reduce motion** in the OS/browser environment.
2. Reload the site.
3. Confirm:
   - [ ] essential content remains visible;
   - [ ] no large parallax/reveal dependency blocks reading;
   - [ ] navigation remains fully functional.

## 6. Hydration / browser console

With DevTools Console open, hard-refresh `/`, a story route and an admin route.

Must not contain:

- [ ] hydration mismatch errors;
- [ ] `window is not defined` / browser-only SSR errors;
- [ ] repeated React key warnings;
- [ ] uncaught GSAP/ScrollTrigger exceptions;
- [ ] uncaught localStorage exceptions;
- [ ] failed application API calls that should be healthy locally.

## 7. Demo content workflow

### Posts

- [ ] create a draft from `/admin/posts/new`;
- [ ] confirm it appears in `/admin/posts`;
- [ ] edit it and save;
- [ ] publish it;
- [ ] confirm published content appears where expected;
- [ ] delete/reset demo content if the UI exposes those actions;
- [ ] refresh the browser and confirm local demo persistence remains coherent.

### Newsletter demo

- [ ] valid email can be submitted once;
- [ ] duplicate email is handled without a runtime error;
- [ ] refresh does not corrupt subscriber state.

## 8. Visual baseline

The purpose of 0G is regression detection, not redesign.

Confirm that V2.1 still reads as:

- [ ] warm editorial canvas, not a generic app shell;
- [ ] stone/sage/periwinkle layered surfaces;
- [ ] oversized serif editorial typography;
- [ ] premium spacing and section rhythm;
- [ ] Lead Story, Latest, Briefing Grid, Editorial Rail, Trending and Newsletter sections remain visually distinct;
- [ ] internal/public pages retain the same editorial family;
- [ ] admin demo remains coherent with the publication without being visually confused with the public site.

## 9. Final technical gate

After all regression fixes:

```powershell
git pull origin main
npm ci
npm run verify
```

Expected:

- Prisma schema valid;
- ESLint: 0 errors;
- TypeScript passes;
- tests pass;
- production build succeeds.

## Current code-side 0G hardening

Completed before the manual browser pass:

- stabilized ContentContext callbacks and functional post updates to avoid stale state;
- removed the admin editor side-effect ternary lint warning;
- added Escape-key dismissal and stronger ARIA state for mobile navigation;
- retained the frozen V2.1 visual system without redesigning sections.

## Completion record

When the checklist is fully verified, update:

- `docs/ROADMAP.md` → 0G ✅ and Phase 0 ✅;
- `docs/PHASE-0-MIGRATION-PLAN.md` → Phase 0 complete;
- `README.md` → current milestone moves to Phase 1 Auth/RBAC.
