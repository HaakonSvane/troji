# AGENTS.md — frontend/app/routes/

Read this before adding or modifying a route. See `frontend/AGENTS.md` for stack-wide rules.

## Data Loading Triplet

GraphQL-backed routes pair a Relay query with three pieces in the same file:

1. `graphql\`...\`` query tagged at module scope.
2. `clientLoader` that calls `loadQuery(getRelayEnvironment(), Query, vars)` and returns `{ queryRef }`.
3. Component that calls `usePreloadedQuery(Query, loaderData.queryRef)`.

Reference exemplar: `groups.$id.tsx`. Do **not** create a Relay environment inside the loader — `getRelayEnvironment()` returns the module-level singleton initialized by `RelayProvider` in the React tree. See `app/relay/AGENTS.md` for why that singleton matters.

## HydrateFallback Per Route

Each protected route exports its own `HydrateFallback` (a small mono `loading` spinner). This renders during the initial client hydration of that specific route. The `Suspense` boundary inside `_protected.tsx` handles subsequent navigation suspensions — these are different layers, not duplicates.

## Suspense + ErrorBoundary Live In `_protected.tsx`

`_protected.tsx` provides the single `Suspense` + `react-error-boundary` `ErrorBoundary` for authenticated routes. Do **not** wrap individual routes in their own Suspense or ErrorBoundary — the boundary lives in the layout so loaders can suspend transparently.

`_protected.tsx` also runs a server `loader` that calls Clerk's `getAuth()` and redirects unauthenticated requests to `/sign-in`. The registration redirect (signed-in but no DB user) is handled separately at the Relay fetch layer — not here.

## Pagination

Paginated routes pair the root query with a sibling `*PaginationQuery` artifact (see `groupsGameDetailPaginationQuery`). After changing pagination fields, run `just relay` so both regenerate together; missing the pagination query produces confusing runtime errors.

Connection keys follow `ComponentOrRoute_fieldName` (e.g. `GroupDetail_games`). When a mutation needs to update a connection, pass `ConnectionHandler.getConnectionID(parentId, "Key")` as a `connections` prop.

## Route Naming

React Router 7 flat-route naming: `groups.$id.tsx`, `groups.$id.games.$gameId.tsx`. The dollar-prefixed segments become `params.id`, `params.gameId` — keep param names consistent across nested routes.

## Server-Only Routes

`feedback.ts` is a server action; it imports from `app/lib/server/*` (GitHub PAT, rate limit). Never import server-only modules from a default-exported route component or any other client-rendered code.
