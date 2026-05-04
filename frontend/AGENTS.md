# AGENTS.md — frontend/

## Scope

- Frontend is React Router 7 framework mode on React 19.
- Auth is Clerk via `@clerk/react-router`.
- GraphQL is Relay 20 against the backend's HotChocolate API.

## Commands

- Prefer repo-root `just` recipes for normal app workflows:
    - `just dev-frontend`
    - `just build-frontend`
    - `just relay`
- Use frontend-local scripts for frontend-only checks:
    - `npm run typecheck --prefix frontend`
    - `npm run dev --prefix frontend`

## Routing And Data Loading

- Protected routes live under `app/routes/_protected.tsx`; that layout only checks Clerk authentication and redirects unauthenticated users to `/sign-in`.
- GraphQL-backed pages use the React Router + Relay pattern: `clientLoader` calls `loadQuery()`, components read with `usePreloadedQuery()`, and `_protected.tsx` provides the Suspense boundary.
- Relay environment access is module-level. `clientLoader`s call `getRelayEnvironment()`, which assumes `RelayProvider` has already initialized the shared environment.
- The Relay environment is keyed by Clerk user id to avoid cross-user cache leakage, but preserves the boot environment during initial auth hydration to avoid preloaded-query mismatches.

## GraphQL And Registration Flow

- The frontend talks directly to `VITE_GRAPHQL_URL`; there is no Next.js-style proxy layer.
- Relay fetch adds the Clerk bearer token from `getToken()`.
- Registration is explicit. A signed-in Clerk user may still have no DB user row.
- When `me` fails with GraphQL error code `NoUserError`, the frontend should treat that as "authenticated but not registered yet" and send the user to `/register`.
- `app/routes/register.tsx` is responsible for collecting names and calling `registerUser`.

## Generated Artifacts

- Do not hand-edit `app/__generated__/`.
- Regenerate Relay artifacts after schema changes or query/mutation text changes.

## References

- Read `backend/AGENTS.md` before changing backend-facing GraphQL assumptions.
- Read `REWRITE_PLAN.md` for the intended React Router + Relay architecture and rewrite context.
