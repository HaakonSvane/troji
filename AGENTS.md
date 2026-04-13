# AGENTS.md

Developer reference for AI agents working in this repo.

---

## Repo structure

Two-package monorepo: a .NET 10 GraphQL backend and a Next.js 15 frontend.

```
trophy-tracker/
├── backend/
│   ├── api/           # .NET 10 ASP.NET Core app — HotChocolate 16 GraphQL API
│   ├── tests/         # NUnit test project
│   └── trophy-tracker.sln
└── frontend/          # Next.js 15, React 19, Relay, Tailwind v4
```

---

## Backend (.NET 10 / HotChocolate 16)

### Commands

```bash
# Build
dotnet build backend/trophy-tracker.sln

# Clean + build (use after HC16 schema/attribute changes)
dotnet clean && dotnet build

# Run API (Development profile — sets ASPNETCORE_ENVIRONMENT=Development)
dotnet run --project backend/api

# Run all tests
dotnet test backend/trophy-tracker.sln

# Run a single test class
dotnet test backend/trophy-tracker.sln --filter "FullyQualifiedName~SchemaShould"

# Export GraphQL schema (required before regenerating Relay artifacts)
dotnet run --project backend/api schema export --output schema.graphql
# Output: backend/api/schema.graphql

# EF migrations (run from backend/api/)
dotnet ef migrations add <NAME>
dotnet ef database update
```

### HotChocolate 16 quirks

- Version is **preview** (`16.0.0-p.10.28`). Migration notes in `backend/HOTCHOCOLATE_16_MIGRATION.md` and `backend/HC16_CODE_CHANGES.md`.
- C# interceptors are required. `api.csproj` sets `<InterceptorsNamespaces>...; HotChocolate.Execution.Generated</InterceptorsNamespaces>`. Do not remove this.
- **`IIdSerializer` does not exist in HC16.** Do not inject it. Use `.ToString()` directly.
- `[DataLoader]` on a static method generates the `I*DataLoader` interface at build time — do not write these by hand.
- DataLoaders are co-located inside Node static classes using the `[DataLoader]` attribute.

### Snapshot test

`SchemaShould.HaveNoUnconfirmedChanges` snapshot-tests the full GraphQL schema SDL. It will **fail after any schema change**. Update the Snapper snapshot by running:

```bash
SNAPPER_UPDATE_SNAPSHOTS=true dotnet test backend/trophy-tracker.sln --filter "FullyQualifiedName~SchemaShould"
```

### Local setup

1. Start Postgres: `docker compose up` from `backend/api/` (requires `backend/api/.env` with `DB_USER`, `DB_PASSWORD`, `COMPOSE_PROJECT_NAME`).
2. Set backend secrets via `dotnet user-secrets` (UserSecretsId: `68de58ca-cab4-4ffb-adf5-dc8aee18503d`): `Database:User`, `Database:Password`, `Auth:Authority`, `Auth:Audience`.
3. Apply migrations: `dotnet ef database update` from `backend/api/`.

Dev server: `http://localhost:5063` (GraphQL endpoint: `/graphql`). Nitro IDE at `/dev` in Development only.

### User registration

After a new user authenticates with Auth0, they must call the `registerUser` GraphQL mutation before other mutations work. `getMe` returns `UserNotRegisteredException` for authenticated-but-unregistered users.

---

## Frontend (Next.js 15 / Relay)

Package manager: **npm**. All commands run from `frontend/`.

### Commands

```bash
# Development — starts relay-compiler in watch mode + Next.js with Turbopack
npm run dev

# Production build — validates Relay artifacts first; fails if any are stale
npm run build

# Lint
npm run lint

# Format (Prettier)
npm run format

# Relay codegen (one-shot)
npm run relay

# Export GraphQL schema from backend (calls dotnet under the hood)
npm run generate-schema
```

### Relay / codegen

- Generated artifacts live in `frontend/src/__generated__/`. **Never edit these by hand.**
- Prettier and ESLint both ignore `__generated__/`.
- `relay.config.json` reads the schema from `../backend/api/schema.graphql`. If that file is missing or stale, `relay-compiler` fails.
- `npm run build` runs `relay-compiler --validate` — exits non-zero if artifacts are out of date, blocking the build.

**Schema change workflow:**

```bash
# 1. Export updated schema
dotnet run --project backend/api schema export --output schema.graphql
# OR from frontend/:
npm run generate-schema

# 2. Regenerate Relay artifacts
cd frontend && npm run relay

# 3. Update snapshot test
SNAPPER_UPDATE_SNAPSHOTS=true dotnet test backend/trophy-tracker.sln --filter "FullyQualifiedName~SchemaShould"
```

### Prettier config (non-default values)

- `printWidth: 100`, `tabWidth: 4`, `useTabs: false`
- `singleQuote: false`, `trailingComma: "all"`, `arrowParens: "avoid"`

### Frontend environment variables (`frontend/.env.local`)

| Variable | Purpose |
|---|---|
| `BASE_URL` | Backend GraphQL URL — default `http://localhost:5063/graphql` |
| `AUTH0_SECRET` | Session encryption secret |
| `AUTH0_BASE_URL` | Frontend URL — default `http://localhost:3000` |
| `AUTH0_ISSUER_BASE_URL` | Auth0 tenant URL |
| `AUTH0_CLIENT_ID` / `AUTH0_CLIENT_SECRET` | Auth0 app credentials |
| `AUTH0_AUDIENCE` | `com.haakonsvane.troji` |
| `AUTH0_SCOPE` | `openid profile email offline_access` |
| `GITHUB_FEEDBACK_PAT` | PAT for feedback issue creation |

### Other notes

- `next.config.js` has `output: "standalone"` — Docker copies from `.next/standalone`.
- CORS in `next.config.js` explicitly allows `http://localhost:5063`. Update if the backend URL changes.
- Auth-protected routes (middleware): `/dashboard/:path*`, `/groups/:path*`, `/stats/:path*`.
- GraphQL data flow: RSC/server fetches directly from backend with an Auth0 access token; client-side fetches go through the `/api/graphql/query` route handler proxy.

---

## No frontend tests

No test framework is installed on the frontend. There is no `test` script in `frontend/package.json`.
