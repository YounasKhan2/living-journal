# ADR-002 — Authentication, Sessions & RBAC

**Status:** Accepted for Phase 1 design  
**Date:** 2026-09-13

## Context

The Living Journal now has a verified Next.js App Router, PostgreSQL/Prisma and Redis foundation. Phase 1 must protect the existing `/admin/**` CMS without introducing a separate API service or relying on client-side hiding.

The initial internal roles are:

- `ADMIN` — full editorial/configuration/user-management authority.
- `EDITOR` — editorial access without user, sensitive settings or monetization administration.

The publication does not currently need public reader accounts, OAuth/social login, organizations, multi-tenant auth or magic links.

## Decision

Use **first-party credential authentication with opaque server-side sessions** inside the existing Next.js application.

### Identity

Prisma-backed `User` records hold normalized email, display name, password hash, role and account state.

Passwords are hashed with **Argon2id** through a server-only password module. Raw passwords are never persisted or logged.

### Sessions

Successful login creates a cryptographically random session token. Only a SHA-256 hash of the token is stored in PostgreSQL. The raw token exists only in the browser cookie.

Cookie policy:

- `HttpOnly`
- `Secure` in production
- `SameSite=Lax`
- `Path=/`
- explicit expiration

A session stores user ownership, expiry and basic lifecycle timestamps. Logout revokes the active session server-side and clears the cookie.

### Authorization

Authorization is enforced in server code, not UI state.

The application exposes reusable guards such as:

```ts
requireUser()
requireRole('ADMIN')
requireAnyRole(['ADMIN', 'EDITOR'])
```

`/admin/**` is protected at the server layout boundary, with additional capability checks around sensitive mutations/routes.

### CSRF / request integrity

State-changing authenticated HTTP endpoints must reject cross-origin requests by validating request Origin against the configured application origin. SameSite cookies are an additional browser control, not the only authorization mechanism.

### Rate limiting

Redis is used for login throttling. Limits apply independently to client/network identity and normalized login identifier so one dimension cannot bypass the other. Authentication failures return generic responses.

### First administrator

The first admin is created through an explicit local/server bootstrap command, not a public signup route and not automatic seed credentials. Bootstrap must refuse to overwrite an existing account silently and must never commit a default password.

### Account state

Initial account states are deliberately small:

- active
- disabled

Disabled users cannot create new sessions. Existing sessions for a disabled user fail authorization and may be revoked during administrative disable operations.

## Why not Auth.js in Phase 1?

Auth.js is a valid option, especially when OAuth/provider federation becomes a requirement. The current requirement is narrower: two internal credential roles, explicit server sessions and a highly controlled admin surface. A small first-party session layer keeps the behavior auditable and avoids introducing provider/account abstractions the product does not yet need.

If OAuth, SSO, public reader accounts or multiple identity providers are later required, this decision must be revisited in a new ADR rather than incrementally bending the custom layer into an identity platform.

## Why not JWT access tokens?

The admin CMS is a same-origin web application. Opaque DB-backed sessions make immediate revocation, logout, user disable and server-side authorization straightforward. JWT access/refresh token infrastructure would add key rotation and revocation complexity without a current cross-service requirement.

## Security invariants

- no auth secret or raw credential enters client bundles;
- passwords are never stored reversibly;
- raw session tokens are never stored in the database;
- anonymous requests cannot render protected admin content;
- UI role checks never substitute for server authorization;
- authentication errors do not reveal whether an email exists;
- redirect targets must be local allowlisted paths;
- login/session/admin mutations receive server-side validation;
- auth-sensitive logging excludes passwords, cookies and raw session tokens.

## Consequences

### Positive

- aligns with the existing Next.js + Prisma architecture;
- revocable sessions are simple to reason about;
- no separate auth service or CORS boundary;
- ADMIN/EDITOR capability enforcement stays close to server mutations;
- Redis foundation from Phase 0 is reused for throttling.

### Trade-offs

- password reset/email verification are not automatically provided;
- application code owns session lifecycle and security tests;
- OAuth/SSO would require a later architectural extension.

## Phase 1 boundary

Included:

- credential login/logout;
- authenticated session lookup;
- `ADMIN` / `EDITOR` RBAC;
- protected admin routes and server guards;
- Redis login throttling;
- first-admin bootstrap;
- basic user/session auditability;
- auth-focused tests.

Deferred:

- public signup;
- password reset email flow;
- OAuth/social login;
- MFA;
- public reader accounts;
- full user-management UI beyond what is needed to prove RBAC safely.
