# Trophy Tracker — Rewrite Plan

> Created: 2026-04-13
> Status: Phase 4 complete, Phase 5 in progress

---

## Overview

Trophy Tracker ("troji") is a site where users create groups and register wins in specific games. A
game is a group-decided trophy (emoji) and a description of what a victory means. The project was
built with Next.js 15 + Relay on the frontend and .NET 10 + HotChocolate 16 + PostgreSQL on the
backend. The frontend is being rewritten; the backend is being modernized.

### What's changing

| Aspect              | Before                          | After                                        |
| ------------------- | ------------------------------- | -------------------------------------------- |
| Frontend framework  | Next.js 15 (App Router, RSC)    | React Router 7 (framework mode, Vite)        |
| Auth (frontend)     | @auth0/nextjs-auth0             | @clerk/react-router                          |
| Auth (backend)      | Auth0 JWT Bearer                | Clerk JWT Bearer (standard JWKS validation)  |
| GraphQL client      | Relay 20.1.1                    | Relay 20.1.1 (no change)                     |
| Data loading        | RSC → serialized → client hydration | `clientLoader` + `loadQuery()` (client-only) |
| GraphQL access      | Proxied through Next.js API route | Direct frontend → backend (CORS)            |
| SSR                 | Full (RSC server-side fetching) | None for data pages (all behind auth)        |
| UI library          | shadcn/ui + Tailwind v4         | shadcn/ui + Tailwind v4 (upgraded)           |
| Task runner         | None (manual commands)          | `just` (justfile)                            |
| HotChocolate        | 16.0.0-p.10.28 (preview)       | 16.0.0-rc.1.30 (RC)                         |
| .NET SDK            | 10.0.0 (preview)                | 10.0.5 (LTS stable)                         |

### What's staying the same

- GraphQL API (HotChocolate, Relay-compliant schema)
- Relay as the GraphQL client
- PostgreSQL database
- Domain model (Users, Groups, Games, Trophies, invite/approval system)
- Monorepo structure (`backend/` + `frontend/`)
- shadcn/ui + Tailwind for UI
- Dark mode, orange-tinted color scheme, gradient animations

### Key assumptions

- **Fresh database.** Clerk user IDs (`user_2NNkl...`) differ from Auth0 IDs (`auth0|abc123`).
  Existing data will not be migrated. If this changes, an ID migration strategy is needed.
- **No SSR for data pages.** All GraphQL-backed pages are behind auth — no SEO benefit from SSR.
  The landing page is static and can be server-rendered trivially.
- **No frontend tests.** No test framework is planned for the frontend. Can be added later (Vitest).

---

## Architecture Decisions

### Relay + React Router v7

Relay has no official React Router integration. The recommended pattern is:

**`clientLoader` + `loadQuery()`** — React Router's client-side loader calls Relay's `loadQuery`
before the component renders, achieving "render-as-you-fetch."

```tsx
// Example: routes/groups.tsx
import type { Route } from "./+types/groups";
import { graphql, usePreloadedQuery, loadQuery } from "react-relay";
import type { groupsQuery } from "~/__generated__/groupsQuery.graphql";
import { getRelayEnvironment } from "~/relay/environment";

const GroupsQuery = graphql`
    query groupsQuery {
        me {
            groups(first: 12, order: { createdDate: DESC }) @connection(key: "Groups_groups") {
                edges {
                    node {
                        id
                        ...GroupBoxFragment
                    }
                }
            }
        }
    }
`;

export async function clientLoader(_args: Route.ClientLoaderArgs) {
    const environment = getRelayEnvironment();
    const queryRef = loadQuery<groupsQuery>(environment, GroupsQuery, {});
    return { queryRef };
}

export function HydrateFallback() {
    return <GroupsSkeleton />;
}

export default function Groups({ loaderData }: Route.ComponentProps) {
    const data = usePreloadedQuery(GroupsQuery, loaderData.queryRef);
    return <GroupsList data={data} />;
}
```

### Clerk + .NET backend

Clerk issues standard JWTs. The backend validates them using the existing ASP.NET Core JWT Bearer
middleware — just change `Authority` and `Audience`:

```csharp
// Program.cs — replace Auth0 config with Clerk
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["Clerk:Authority"]; // e.g., https://your-app.clerk.accounts.dev
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false, // Clerk doesn't use audience by default; or set if configured
            NameClaimType = ClaimTypes.NameIdentifier,
        };
    });
```

The `TrophyHttpRequestInterceptor` extracts the `sub` claim — Clerk JWTs include this, so the
interceptor should work as-is. The claim value will be in Clerk's format (`user_2NNkl...`) rather
than Auth0's (`auth0|abc123`).

### Direct GraphQL access (no proxy)

The current Next.js app proxies client-side GraphQL requests through `/api/graphql/query` to inject
the Auth0 access token. With Clerk, the frontend SDK provides the session token directly:

```tsx
// relay/environment.ts
import { useAuth } from "@clerk/react-router";

function createFetchFn(getToken: () => Promise<string | null>) {
    return async (request: RequestParameters, variables: Variables) => {
        const token = await getToken();
        const response = await fetch(import.meta.env.VITE_GRAPHQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ query: request.text, variables }),
        });
        return response.json();
    };
}
```

The backend needs CORS configuration to allow the frontend origin.

### `just` for monorepo orchestration

`just` is a command runner (not a build system). It's language-agnostic, supports recipe arguments,
has built-in `.env` loading, and provides `just --list` for discoverability. Ideal for a mixed
.NET/JS monorepo.

Example `justfile`:

```just
set dotenv-load

# ── Backend ──────────────────────────────────────────────

# Build the backend solution
build-backend:
    dotnet build backend/trophy-tracker.sln

# Run backend tests
test-backend:
    dotnet test backend/trophy-tracker.sln

# Start the backend API server
run-backend:
    dotnet run --project backend/api

# ── Frontend ─────────────────────────────────────────────

# Start frontend dev server (Relay watch + Vite)
dev-frontend:
    npm run dev --prefix frontend

# Production build of frontend
build-frontend:
    npm run build --prefix frontend

# ── Cross-cutting ────────────────────────────────────────

# Export GraphQL schema from backend
schema-export:
    dotnet run --project backend/api schema export --output schema.graphql

# Run Relay compiler
relay:
    npm run relay --prefix frontend

# Full schema update pipeline: export → relay codegen → snapshot
update-schema: schema-export relay update-snapshot

# Update schema snapshot test
update-snapshot:
    SNAPPER_UPDATE_SNAPSHOTS=true dotnet test backend/trophy-tracker.sln --filter "FullyQualifiedName~SchemaShould"

# ── Infrastructure ───────────────────────────────────────

# Start PostgreSQL via Docker Compose
db-up:
    docker compose -f backend/api/docker-compose.yml up -d

# Stop PostgreSQL
db-down:
    docker compose -f backend/api/docker-compose.yml down

# Run EF Core migration (usage: just migrate AddNewTable)
migrate name:
    dotnet ef migrations add {{name}} --project backend/api

# Apply pending migrations
db-update:
    dotnet ef database update --project backend/api

# ── Full stack ───────────────────────────────────────────

# Start everything for local development
dev: db-up run-backend dev-frontend
```

---

## Risks & Notes

1. **HotChocolate 16 is still RC.** No stable release yet. The project is already on the HC16 track
   so staying on it is pragmatic, but watch for breaking changes before GA.
2. **`vite-plugin-relay`** is community-maintained (Relay officially supports Babel/SWC). If it
   causes issues, fall back to `babel-plugin-relay` with Vite's Babel integration.
3. **Clerk user IDs ≠ Auth0 user IDs.** Requires fresh database (see assumptions above).
4. **No frontend tests.** Not blocking for the rewrite, but should be added eventually.

---

## Phase Details

### Phase 1 — Infrastructure & Repository Setup

| #   | Task                     | Details                                                                                    |
| --- | ------------------------ | ------------------------------------------------------------------------------------------ |
| 1.1 | Archive old frontend     | Move `frontend/` to a `legacy/frontend` branch for reference, delete from `main`.          |
| 1.2 | Create root `justfile`   | All recipes listed in the architecture section above.                                      |
| 1.3 | Update `global.json`     | Pin .NET SDK to `10.0.5`.                                                                  |
| 1.4 | Update root `.gitignore` | Clean up stale entries, add frontend Vite artifacts.                                       |
| 1.5 | Simplify Docker Compose  | Keep PostgreSQL only for local dev. Remove any old frontend Docker references.             |

### Phase 2 — Backend Modernization

| #   | Task                          | Details                                                                                                                                                                                    |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2.1 | Upgrade HotChocolate          | All HC packages from `16.0.0-p.10.28` → `16.0.0-rc.1.30`. Check [HC16 changelog](https://github.com/ChilliCream/graphql-platform/releases) for breaking changes between preview and RC.  |
| 2.2 | Upgrade other NuGet packages  | EF Core, Npgsql, MediatR, FlexLabs Upsert, shortid — all to latest compatible versions.                                                                                                   |
| 2.3 | Replace Auth0 with Clerk JWT  | Change `AddJwtBearer()` config: set `Authority` to Clerk issuer URL. Remove Auth0-specific audience validation. Add `Clerk:Authority` to user-secrets / config.                            |
| 2.4 | Update `FakeAuthHandler`      | Adjust hardcoded user ID to Clerk-style format for dev mode.                                                                                                                               |
| 2.5 | Update `TrophyHttpRequestInterceptor` | Verify `sub` claim extraction still works with Clerk JWTs. The `NameIdentifier` claim mapping may differ.                                                                          |
| 2.6 | Add CORS configuration        | Allow the frontend origin (`http://localhost:5173` for Vite dev) in `Program.cs`.                                                                                                          |
| 2.7 | Clean up dead code            | Remove empty `Application/`, `API/Middleware/`, `API/Trophy/` directories. Remove HC16 migration docs if no longer needed.                                                                 |
| 2.8 | Build & test                  | `dotnet build`, `dotnet test`, update schema snapshot with `SNAPPER_UPDATE_SNAPSHOTS=true`.                                                                                                |
| 2.9 | Export fresh schema           | `dotnet run --project backend/api schema export --output schema.graphql`                                                                                                                   |

### Phase 3 — Frontend Scaffold

| #   | Task                         | Details                                                                                                     |
| --- | ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 3.1 | Init React Router v7 project | `npx create-react-router@latest frontend` — framework mode, TypeScript.                                    |
| 3.2 | Configure TypeScript          | `@/*` path alias via `tsconfig.json` and Vite `resolve.alias`.                                             |
| 3.3 | Install Tailwind v4           | `@tailwindcss/vite` plugin. Port CSS variables and theme from old `globals.css`.                           |
| 3.4 | Init shadcn/ui                | Fresh `components.json`. Install needed components: button, card, dialog, dropdown-menu, form, input, label, navigation-menu, popover, scroll-area, select, separator, skeleton, sonner, table, tabs, textarea, tooltip. |
| 3.5 | Install & configure Relay     | `react-relay`, `relay-compiler`, `vite-plugin-relay`. Create `relay.config.json` pointing to `../backend/api/schema.graphql`. |
| 3.6 | Install Clerk                 | `@clerk/react-router`. Set up env vars: `VITE_CLERK_PUBLISHABLE_KEY`.                                     |
| 3.7 | Port formatting config        | `.prettierrc` (printWidth: 100, tabWidth: 4, etc.), `.prettierignore`, `eslint.config.mjs`.                |

### Phase 4 — Frontend Core Architecture

| #   | Task                          | Details                                                                                                     |
| --- | ----------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 4.1 | Relay environment             | Single client-side `Environment`. `fetchFn` gets Clerk session token via `getToken()` and fetches directly to `VITE_GRAPHQL_URL`. |
| 4.2 | Clerk auth setup              | `rootAuthLoader` in root route. `ClerkProvider` wrapping the app. Sign-in/sign-up routes using Clerk's `<SignIn />` / `<SignUp />` components. |
| 4.3 | Root layout                   | `ClerkProvider` → `ThemeProvider` → `RelayEnvironmentProvider` → `<Outlet />`.                             |
| 4.4 | Auth-protected layout         | A layout route that checks `isSignedIn` and redirects to `/sign-in`. Wraps `/dashboard`, `/groups/*`.      |
| 4.5 | `clientLoader` + `loadQuery`  | Establish the reusable pattern. Create a helper utility if the boilerplate is repetitive.                   |
| 4.6 | Error boundaries              | `react-error-boundary` at root. Per-route error boundaries via React Router's `ErrorBoundary` export.      |

### Phase 5 — Frontend Routes & Features

| #   | Task                      | Route              | Details                                                                                   |
| --- | ------------------------- | ------------------- | ----------------------------------------------------------------------------------------- |
| 5.1 | Landing page              | `/`                 | Public, static. Logo, value prop, sign-in CTA.                                           |
| 5.2 | Sign-in / Sign-up         | `/sign-in`, `/sign-up` | Clerk `<SignIn />` and `<SignUp />` components.                                        |
| 5.3 | User registration         | —                   | After first Clerk sign-in, call `registerUser` mutation if `getMe` throws `UserNotRegisteredException`. |
| 5.4 | Dashboard                 | `/dashboard`        | `DashboardPageQuery` — greeting with user profile name.                                  |
| 5.5 | Groups list               | `/groups`           | `GroupsPageQuery` — grid of `GroupBox` cards with `@connection` pagination.              |
| 5.6 | Create group              | —                   | `NewGroupFormMutation` — DrawerDialog with form (name, description, decision model).     |
| 5.7 | Group detail              | `/groups/:id`       | `GroupPageQuery` — sidebar card, tabs (games, members), invite management.               |
| 5.8 | Create game               | —                   | `NewGameFormMutation` — form with emoji picker inside DrawerDialog.                      |
| 5.9 | Group invite              | —                   | `GroupInviteMutation` — generate/display invite code + QR code.                          |
| 5.10 | Trophy request/approval  | —                   | `createTrophyRequest` and `approveTrophy` mutations.                                     |

### Phase 6 — Port UI Components

| #   | Task                       | Details                                                                                    |
| --- | -------------------------- | ------------------------------------------------------------------------------------------ |
| 6.1 | Custom shadcn extensions   | `DrawerDialog` (responsive dialog/drawer), `EmojiPicker` (virtualized with emojilib + @tanstack/react-virtual + cmdk), extended `Button` (leadingIcon, trailingIcon, busy). |
| 6.2 | Header & navigation        | Adapt for Clerk's `<UserButton />` instead of custom user menu. Keep `Navigator` links (Home, Groups, Stats). Keep sticky nav bar. |
| 6.3 | Domain components          | `TrophyAvatar`, `TrophyStack`, `GroupBox`, `MemberRow`, `GroupSocialCard`, `GroupGamesTableRow`. |
| 6.4 | Zod schemas                | Port `feedbackSchema`, `gameSchema`, `groupSchemas`.                                       |
| 6.5 | Hooks                      | Port `useGradient` (scroll-responsive gradient), `useMediaQuery`. Drop `useSuspendablePromise` (not needed with clientLoader). |
| 6.6 | Theme & styling            | Port CSS variables (HSL-based light/dark), gradient animations (gold → pink → deep blue), dark mode default, Poppins font (via Fontsource or Google Fonts CDN). |

### Phase 7 — Polish & DevOps

| #   | Task                       | Details                                                                                    |
| --- | -------------------------- | ------------------------------------------------------------------------------------------ |
| 7.1 | Frontend Dockerfile        | Multi-stage build. React Router v7 with Vite produces a Node server — similar to `output: "standalone"` in Next.js. |
| 7.2 | Docker Compose             | Full stack: postgres + backend + frontend. Single `docker compose up` for everything.      |
| 7.3 | Finalize `justfile`        | Verify all recipes work. Add doc comments for `just --list`.                               |
| 7.4 | Update `AGENTS.md`         | Reflect new architecture, commands, conventions, and development workflow.                  |
| 7.5 | End-to-end verification    | Full flow: sign up → register user → create group → invite → join → create game → request trophy → approve. |

---

## Task List

Track progress by marking items as they are completed. Each phase should be done in order. Tasks
within a phase can be parallelized where dependencies allow.

- [x] **Phase 1 — Infrastructure & Repository Setup**
  - [x] 1.1 Archive old frontend to a branch and remove from main
  - [x] 1.2 Create root `justfile` with all recipes
  - [x] 1.3 Update `global.json` to .NET SDK 10.0.5
  - [x] 1.4 Update root `.gitignore`
  - [x] 1.5 Simplify Docker Compose (PostgreSQL only)
- [x] **Phase 2 — Backend Modernization**
  - [x] 2.1 Upgrade HotChocolate to 16.0.0-rc.1.30
  - [x] 2.2 Upgrade other NuGet packages to latest
  - [x] 2.3 Replace Auth0 JWT config with Clerk JWT config
  - [x] 2.4 Update `FakeAuthHandler` for Clerk-style user IDs
  - [x] 2.5 Update `TrophyHttpRequestInterceptor` for Clerk JWT claims
  - [x] 2.6 Add CORS configuration for frontend origin
  - [x] 2.7 Clean up dead code and empty directories
  - [x] 2.8 Build, run tests, update schema snapshot
  - [x] 2.9 Export fresh GraphQL schema
- [x] **Phase 3 — Frontend Scaffold**
  - [x] 3.1 Initialize React Router v7 project (framework mode, TypeScript)
  - [x] 3.2 Configure TypeScript with `@/*` path alias
  - [x] 3.3 Install and configure Tailwind v4
  - [x] 3.4 Initialize shadcn/ui and install components
  - [x] 3.5 Install and configure Relay (compiler, Vite plugin, config)
  - [x] 3.6 Install and configure Clerk (`@clerk/react-router`)
  - [x] 3.7 Port formatting config (Prettier, ESLint)
- [x] **Phase 4 — Frontend Core Architecture**
  - [x] 4.1 Set up Relay environment with Clerk token injection
  - [x] 4.2 Set up Clerk auth (ClerkProvider, rootAuthLoader, sign-in/sign-up routes)
  - [x] 4.3 Implement root layout (ClerkProvider → ThemeProvider → RelayEnvironmentProvider)
  - [x] 4.4 Implement auth-protected layout route
  - [x] 4.5 Establish `clientLoader` + `loadQuery` reusable pattern
  - [x] 4.6 Set up error boundaries
- [x] **Phase 5 — Frontend Routes & Features**
  - [x] 5.1 Landing page (`/`)
  - [x] 5.2 Sign-in / Sign-up pages
  - [x] 5.3 User registration flow (post-Clerk-signup `registerUser` mutation)
  - [x] 5.4 Dashboard page (`/dashboard`)
  - [x] 5.5 Groups list page (`/groups`)
  - [x] 5.6 Create group (mutation + DrawerDialog form)
  - [x] 5.7 Group detail page (`/groups/:id`)
  - [x] 5.8 Create game (mutation + emoji picker form)
  - [x] 5.9 Group invite (mutation + invite code display)
  - [x] 5.10 Trophy request and approval (mutations)
- [ ] **Phase 6 — Port UI Components**
  - [ ] 6.1 Custom shadcn extensions (DrawerDialog, EmojiPicker, extended Button)
  - [ ] 6.2 Header and navigation (adapt for Clerk `<UserButton />`)
  - [ ] 6.3 Domain components (TrophyAvatar, TrophyStack, GroupBox, MemberRow, etc.)
  - [ ] 6.4 Zod validation schemas
  - [ ] 6.5 Theme and styling (CSS variables, gradients, dark mode)
- [ ] **Phase 7 — Polish & DevOps**
  - [ ] 7.1 Frontend Dockerfile
  - [ ] 7.2 Full-stack Docker Compose (postgres + backend + frontend)
  - [ ] 7.3 Finalize and document `justfile`
  - [ ] 7.4 Update `AGENTS.md` for new architecture
  - [ ] 7.5 End-to-end verification of full user flow
