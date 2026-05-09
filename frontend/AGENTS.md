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

## Typography

- Two font families are available via Tailwind utility classes, both defined in `app/app.css` under `@theme inline`:
    - `font-heading` → `--font-heading` (Iowan Old Style, serif) — use on headings (`h1`–`h4`) and any emphasized display text.
    - `font-sans` → `--font-sans` (Geist Variable, sans-serif) — use on body copy, labels, and UI text.
- Serif for headings, sans-serif for readable text. Do not use system fonts or override these with arbitrary `font-family` styles.

## References

- Read `backend/AGENTS.md` before changing backend-facing GraphQL assumptions.

## Server-Only Secrets

- `GITHUB_FEEDBACK_TOKEN` — fine-grained PAT with `Contents: write` on `HaakonSvane/troji`. Never prefix with `VITE_`; must stay server-side only. Expires yearly — rotate before it lapses.
- `GITHUB_FEEDBACK_REPO` — target repo in `owner/repo` form (e.g. `HaakonSvane/troji`).
- These are consumed by `app/routes/feedback.ts` (server action) and `app/lib/server/github-dispatch.ts`. Neither file should be imported from any client-side module.
