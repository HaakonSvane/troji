# AGENTS.md — frontend/app/relay/

Three files, but every one of them carries non-obvious behavior. Touch carefully.

## Module-Level Environment Singleton

`environment.ts` holds the Relay `Environment` at module scope (`_currentEnvironment`), keyed by Clerk user id. This is intentional and load-bearing:

- Route `clientLoader`s run **outside** the React tree and need a synchronous handle to the environment via `getRelayEnvironment()`. A React-context-only environment would not work for loaders.
- `RelayProvider` initializes/updates the singleton from `useAuth()`; loaders read it. The provider must mount before any route loader runs — which it does, because the provider wraps the React Router tree in `root.tsx`.

Do not refactor toward per-render environments or per-route environments. It will break preloaded queries.

## Boot Phase: The `__boot__` Key

On first render Clerk's `userId` transitions `undefined → null` (signed out) or `undefined → "user_..."` (signed in). The environment is keyed `"__boot__"` while `userId === undefined`, and **preserved across the first transition to a real id**, so preloaded queries issued during boot don't error with an environment mismatch. After boot, the key swaps and the environment recreates only on real user changes (sign-in / sign-out / account switch).

## NoUserError → /register

The Relay fetch function inspects every response for `errors[].extensions.code === "NoUserError"` and triggers `window.location.href = "/register"`. This is the **"authenticated but no DB user row"** path. Implications:

- Do not catch / swallow `NoUserError` in components or resolvers — it must reach the fetch layer.
- The redirect is a hard navigation, not a router redirect — intentional, because Relay state has to reset.

## Tokens

Every request fetches `getToken()` fresh and attaches it as `Authorization: Bearer ...`. Rotation is automatic. If a request 401s, the user's session has likely expired — let Clerk handle it; don't add retry logic in the network layer.

## Vite Plugin

`vite-plugin-relay-ssr.ts` is wired into `vite.config.ts` and is required for Relay compiler SSR compatibility. Don't remove or replace it without testing route hydration end to end.
