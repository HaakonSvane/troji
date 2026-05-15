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

## Animations

- `motion` (imported from `motion/react`) is the project's animation library — the modern successor to `framer-motion`. Do not reach for `framer-motion`, `react-spring`, or other libraries. CSS transitions (`tw-animate-css`) are still preferred for simple hover/state changes; reserve `motion` for layout/shared-element animations (`layoutId`, `LayoutGroup`) and multi-step UI choreography. First use: `app/components/TrophyAwardJourney.tsx`.

## Design

- The full design language — palette, typography, recipes, voice, mobile rules, anti-patterns — lives in [`app/DESIGN.md`](app/DESIGN.md). Read it before styling any new surface.
- Short version: dark-only, gold-as-reward (`--medal-gold`) is the only chromatic accent, IBM Plex Serif for display, Inter for body, Geist Mono for terminal-flavored chrome only. No gradients. No backdrop blur. No `rounded-xl`+. User-facing copy says "circle" instead of "group".
- Auth/register pages use `app/components/AuthShell.tsx` for the brand chrome (status bar + dot grid + footer). Clerk widgets share a single `appearance` object exported from `app/lib/clerk-appearance.ts` — extend it there, don't redefine per route.

## Typography

- Three font families are available via Tailwind utility classes, all defined in `app/app.css` under `@theme inline`:
    - `font-heading` → `--font-heading` (IBM Plex Serif) — display only (h1–h2, marquee italic). `font-medium` 500, `tracking-[0.025em]` (or `[0.015em]` at body sizes).
    - `font-sans` → `--font-sans` (Inter) — body, labels, table cells, form fields. Default for everything not explicitly chrome.
    - `font-mono` → `--font-mono` (Geist Mono) — system chrome ONLY: status bars, version pills, prompt prefixes (`$`, `▸`, `›`), command-style CTA labels, breadcrumbs, mono pills. Always uppercase + tracked. Never on body paragraphs.
- All three are loaded via Google Fonts in `app/root.tsx`. Do not use system fonts or override these with arbitrary `font-family` styles.

## References

- Read `backend/AGENTS.md` before changing backend-facing GraphQL assumptions.

## Server-Only Secrets

- `GITHUB_FEEDBACK_TOKEN` — fine-grained PAT with `Contents: write` on `HaakonSvane/troji`. Never prefix with `VITE_`; must stay server-side only. Expires yearly — rotate before it lapses.
- `GITHUB_FEEDBACK_REPO` — target repo in `owner/repo` form (e.g. `HaakonSvane/troji`).
- These are consumed by `app/routes/feedback.ts` (server action) and `app/lib/server/github-dispatch.ts`. Neither file should be imported from any client-side module.
