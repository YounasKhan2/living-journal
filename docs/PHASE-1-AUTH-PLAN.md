# 🔐 Phase 1 — Authentication & RBAC Plan

> Goal: replace the open admin demo boundary with production-grade server authentication and authorization while preserving the accepted V2.1 CMS UI.

Architecture decision: [`ADR-002`](adr/ADR-002-authentication-session-rbac.md).

## Phase status

**🟡 CURRENT — design approved, implementation not started**

Phase 1 is complete only when anonymous admin access is blocked, ADMIN/EDITOR capabilities are enforced server-side, login/logout/session behavior is reliable, brute-force protection is active, the first admin can be bootstrapped safely, and auth tests plus `npm run verify` pass.

---

## 1. Scope

### Included

- Prisma `User`, `Session` and auth audit data needed for Phase 1;
- Argon2id password hashing;
- email/password login;
- logout;
- opaque HttpOnly cookie sessions;
- server session lookup and expiry enforcement;
- `ADMIN` / `EDITOR` roles;
- server authorization helpers;
- protected `/admin/**` layout/routes;
- sensitive route/mutation capability checks;
- Redis login throttling;
- same-origin protection for state-changing auth/admin requests;
- safe local redirect handling;
- first-admin bootstrap command;
- login UI consistent with the publication/admin visual family;
- auth-focused unit/integration tests;
- documentation/env updates.

### Explicitly deferred

- public signup;
- reader accounts;
- OAuth/social login;
- password-reset email flow;
- email verification;
- MFA;
- SSO;
- full user-management product UI;
- CMS persistence work from Phase 2.

---

## 2. Data model

Planned Prisma additions:

```prisma
enum UserRole {
  ADMIN
  EDITOR
}

enum UserStatus {
  ACTIVE
  DISABLED
}

model User {
  id           String     @id @default(cuid())
  email        String     @unique
  name         String
  passwordHash String
  role         UserRole   @default(EDITOR)
  status       UserStatus @default(ACTIVE)
  sessions     Session[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}

model Session {
  id           String   @id @default(cuid())
  tokenHash    String   @unique
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt    DateTime
  lastSeenAt   DateTime @default(now())
  createdAt    DateTime @default(now())

  @@index([userId])
  @@index([expiresAt])
}
```

Email is stored normalized to lowercase/trimmed form before persistence.

No raw session token is stored in PostgreSQL.

### Audit trail

Phase 1 should capture a minimal server-side auth/security audit record for events such as:

- login success;
- login failure (without storing supplied password);
- logout;
- session revocation;
- user disabled/enabled when that operation exists.

The final field shape should avoid unnecessary PII and must not store raw cookies/tokens.

---

## 3. Session design

### Login flow

```text
POST credentials
    ↓
Validate body
    ↓
Apply Redis rate limits
    ↓
Normalize email
    ↓
Load ACTIVE user
    ↓
Argon2id verify
    ↓
Generate random token
    ↓
Store SHA-256(token) Session row
    ↓
Set HttpOnly cookie
    ↓
Redirect to validated local return path or /admin
```

### Request flow

```text
/admin/** request
    ↓
Read session cookie server-side
    ↓
Hash cookie token
    ↓
Find non-expired Session + ACTIVE User
    ↓
No valid session → /login?returnTo=...
    ↓
Valid role → render route
```

### Logout flow

```text
POST logout
    ↓
Same-origin validation
    ↓
Delete/revoke current Session
    ↓
Clear cookie
    ↓
Redirect to /login
```

### Expiration policy

Initial recommendation:

- absolute lifetime: **24 hours**;
- no indefinite remember-me session in Phase 1;
- expired sessions are rejected immediately;
- cleanup of expired rows can initially be opportunistic/manual and later move to a maintenance job if needed.

Keep the policy centralized so production can change it without touching route code.

---

## 4. RBAC matrix

Initial capability contract:

| Capability | ADMIN | EDITOR |
|---|---:|---:|
| Enter CMS | ✅ | ✅ |
| Read content workspace | ✅ | ✅ |
| Create/edit drafts | ✅ | ✅ |
| Review/publish | ✅ | ✅ |
| Audience read access | ✅ | ✅ initially |
| Manage sources | ✅ | ⏳ future decision |
| Manage publication settings | ✅ | ❌ |
| Manage monetization | ✅ | ❌ |
| Manage users/roles | ✅ | ❌ |

Phase 1 must implement capability helpers rather than scattering string role comparisons through components.

Recommended shape:

```ts
type Capability =
  | 'cms:read'
  | 'content:write'
  | 'content:publish'
  | 'audience:read'
  | 'settings:manage'
  | 'users:manage'
  | 'monetization:manage'
```

A central role → capability map becomes the source of truth.

---

## 5. Route design

### Public auth route

```text
/login
```

No public registration route exists.

### Protected routes

Existing `/admin/**` remains protected at the server layout boundary.

Sensitive subroutes additionally require capabilities. At minimum:

```text
/admin/settings → ADMIN
```

Future user-management routes, when introduced, are ADMIN-only.

### API/server endpoints

Initial shape may use Route Handlers:

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/session   (only if a client need is proven)
```

Prefer direct server-side session reads in Server Components over creating a session API merely for convenience.

---

## 6. Server module boundaries

Recommended structure:

```text
src/server/auth/
├── constants.ts
├── password.ts
├── session.ts
├── guards.ts
├── permissions.ts
├── rate-limit.ts
├── csrf.ts
├── redirects.ts
└── types.ts
```

Responsibilities:

- `password.ts` — Argon2id hash/verify only;
- `session.ts` — create/read/revoke session + cookie rules;
- `guards.ts` — `requireUser`, `requireRole`, `requireCapability`;
- `permissions.ts` — centralized role/capability matrix;
- `rate-limit.ts` — Redis auth throttling;
- `csrf.ts` — same-origin assertion for state-changing requests;
- `redirects.ts` — safe local `returnTo` validation;
- `constants.ts` — cookie/session lifetimes and names.

No React component should import password/token internals.

---

## 7. Login UI

The login screen should feel like a restrained entry point to The Living Journal CMS, not a generic SaaS template.

Requirements:

- publication wordmark/identity;
- email field;
- password field;
- submit/loading state;
- generic invalid-credentials error;
- rate-limit error state;
- accessible labels and keyboard flow;
- no account-creation CTA;
- no fake forgot-password link until the feature exists;
- responsive narrow-mobile behavior;
- preserve existing visual tokens rather than introducing a new design system.

---

## 8. First-admin bootstrap

Provide an explicit command such as:

```powershell
npm run auth:bootstrap-admin
```

The command should:

1. verify DB connectivity;
2. prompt for email, name and password without echoing the password;
3. normalize/validate the email;
4. enforce the password policy;
5. hash with Argon2id;
6. create `ADMIN + ACTIVE`;
7. refuse silent overwrite when the email already exists;
8. never print the raw password;
9. never rely on a committed default credential.

This is safer than public signup or embedding bootstrap secrets in `prisma/seed.ts`.

---

## 9. Password policy

Initial internal-CMS policy:

- minimum 12 characters;
- allow passphrases and password-manager generated values;
- do not require arbitrary uppercase/symbol composition rules;
- cap accepted input length to prevent abuse;
- never trim the password itself;
- generic invalid-login response regardless of whether the user exists.

Password reset is outside Phase 1; a forgotten password initially requires an explicit administrative recovery procedure documented before deployment.

---

## 10. Rate limiting

Redis-backed login protection must exist before Phase 1 closes.

Baseline design:

- per network/client key;
- per normalized email/identifier key;
- short fixed/sliding window;
- generic client response;
- TTL-based Redis keys;
- fail behavior explicitly documented.

Suggested starting thresholds for implementation/testing:

```text
IP/network: 10 attempts / 15 minutes
Identifier: 5 failed attempts / 15 minutes
```

These are configuration defaults, not product constants baked into UI code.

---

## 11. CSRF and request integrity

For every cookie-authenticated state-changing endpoint:

- require POST/PATCH/PUT/DELETE as appropriate;
- validate `Origin` against configured site origin;
- reject cross-origin requests;
- retain `SameSite=Lax` cookie policy;
- keep authorization checks independent of CSRF checks.

GET requests must remain side-effect free.

---

## 12. Environment/configuration

Expected additions may include:

```env
AUTH_SESSION_COOKIE=living_journal_session
AUTH_SESSION_TTL_HOURS=24
```

Do **not** introduce a long-lived application signing secret unless the chosen implementation genuinely requires one. Random opaque sessions stored by hash do not need a JWT signing key.

Production cookie security derives from HTTPS + `Secure` cookies.

---

## 13. Implementation sequence

### 1A — Auth persistence foundation

- Prisma enums/models;
- migration;
- password module;
- session-token primitives;
- bootstrap-admin script.

**Gate:** migration, bootstrap and password/session unit tests pass.

### 1B — Session lifecycle

- login route/service;
- session cookie creation;
- session lookup;
- logout/revocation;
- safe return path.

**Gate:** valid/invalid/expired/logout tests pass.

### 1C — Protect admin shell

- `/login` UI;
- server guard in `/admin/layout.tsx`;
- anonymous redirect;
- authenticated rendering;
- no protected content flash.

**Gate:** anonymous `/admin` cannot render CMS; authenticated ADMIN/EDITOR can.

### 1D — RBAC

- capability matrix;
- guards;
- ADMIN-only settings enforcement;
- UI can hide unavailable actions, but server remains authoritative.

**Gate:** EDITOR receives forbidden behavior for ADMIN-only operations even when calling endpoints directly.

### 1E — Auth hardening

- Redis rate limiting;
- same-origin protection;
- auth audit events;
- session revocation/disabled-user behavior;
- cookie production configuration.

**Gate:** abuse/security test matrix passes.

### 1F — Final Phase 1 regression

- `npm run verify`;
- auth browser matrix;
- responsive login;
- public site regression;
- documentation synchronized.

**Gate:** Phase 1 acceptance criteria fully pass before Phase 2 begins.

---

## 14. Test matrix

Minimum automated coverage:

### Password

- hash differs from raw password;
- correct password verifies;
- wrong password fails;
- invalid input rejected.

### Session

- random raw token hashes deterministically for lookup;
- valid active session resolves user;
- expired session rejected;
- missing session rejected;
- revoked/deleted session rejected;
- disabled user rejected.

### Redirect safety

Allow:

```text
/admin
/admin/posts
/admin/posts/123/edit
```

Reject/fallback:

```text
https://evil.example
//evil.example
javascript:...
/../external
```

### Authentication

- correct login succeeds;
- unknown email and wrong password expose the same public error;
- disabled user cannot log in;
- rate limits activate;
- logout invalidates session.

### Authorization

- guest blocked from `/admin/**`;
- EDITOR enters ordinary CMS routes;
- ADMIN enters ordinary CMS routes;
- EDITOR blocked from ADMIN-only settings/user operations;
- direct endpoint access cannot bypass role checks.

### Request integrity

- same-origin mutation accepted when authorized;
- cross-origin mutation rejected;
- GET has no destructive side effect.

---

## 15. Phase 1 exit criteria

Phase 1 is **not complete** until all are true:

- no anonymous protected admin rendering;
- login/logout/session lifecycle works end-to-end;
- passwords use Argon2id;
- opaque session tokens are persisted only as hashes;
- session cookie uses production-safe attributes;
- expired/revoked/disabled-user sessions fail closed;
- ADMIN/EDITOR server authorization works;
- sensitive settings/users actions require ADMIN;
- login throttling is Redis-backed;
- same-origin mutation protection is active;
- no default/admin password exists in repository history/config;
- first admin can be safely bootstrapped;
- automated auth tests pass;
- `npm run verify` passes;
- public/V2.1 behavior remains intact;
- README/architecture/roadmap describe the implemented reality.

---

## Non-negotiable implementation rule

Do not begin Phase 2 CMS persistence while Phase 1 authentication is partially implemented. The existing localStorage demo content may remain temporary during Phase 1; the purpose of this phase is to secure the admin boundary first.
