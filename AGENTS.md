# AGENTS.md — Trophy Tracker (troji)

> Read `REWRITE_PLAN.md` for architecture decisions, phase status, and the full migration plan.
> This file only contains what you would likely get wrong without it.

---

## Repo layout

```
backend/          .NET 10 solution (API + tests) — active codebase
  api/            ASP.NET Core + HotChocolate 16 GraphQL
  tests/          NUnit 4 test project
frontend/         NOT YET SCAFFOLDED — Phase 3 of the rewrite
apis/             API registry metadata only
justfile          All developer commands live here
REWRITE_PLAN.md   Active rewrite plan with phase tracking
```

**`frontend/` does not exist yet.** All frontend `just` recipes (`dev-frontend`, `build-frontend`, `relay`, `update-schema`, `dev`) will fail until Phase 3 is scaffolded.

---

## Toolchain requirements

- **.NET SDK 10.0.5** — pinned in `backend/global.json`. Install exactly this version.
- **`just`** — task runner; all commands go through `just`. Run `just --list` to see all recipes.
- **Docker** — required for PostgreSQL (`just db-up`).
- **`dotnet-ef` CLI** — must be installed separately: `dotnet tool install -g dotnet-ef`
- Node.js/npm — needed only when frontend is scaffolded.

---

## Git
Always commit sections of work. We follow semantic commit messages, so use that whenever you commit.

## Developer commands

```bash
just db-up              # Start PostgreSQL container (do this before run-backend)
just db-down            # Stop PostgreSQL container
just db-update          # Apply EF Core migrations to the running DB
just run-backend        # dotnet run --project backend/api
just build-backend      # dotnet build backend/trophy-tracker.sln
just test-backend       # dotnet test backend/trophy-tracker.sln
```

### Schema pipeline (backend changes only)

```bash
just schema-export      # Export GraphQL SDL → backend/api/schema.graphql
just update-snapshot    # Update Snapper snapshot to match current schema
just update-schema      # Full pipeline: schema-export → relay → update-snapshot
                        # (relay step will fail until frontend exists)
```

The schema export (`just schema-export`) runs `dotnet run --project backend/api schema export`.
This skips DB setup internally — no running database is required for schema export.

### EF Core migrations

```bash
just migrate <Name>     # dotnet ef migrations add <Name> --project backend/api
```

Always target `--project backend/api`. Running `dotnet ef` from the solution root without this flag fails — no DbContext at solution level.

---

## Running a single test

```bash
dotnet test backend/trophy-tracker.sln --filter "FullyQualifiedName~SchemaShould"
dotnet test backend/trophy-tracker.sln --filter "FullyQualifiedName~HaveNoUnconfirmedChanges"
```

### Snapper schema snapshot

The `SchemaShould.HaveNoUnconfirmedChanges` test snapshots the GraphQL SDL. After any schema change:

```bash
just update-snapshot
# or manually:
SNAPPER_UPDATE_SNAPSHOTS=true dotnet test backend/trophy-tracker.sln --filter "FullyQualifiedName~SchemaShould"
```

The snapshot test builds the schema in-process (no DB required). It uses `NSubstitute` mocks for
the repository interfaces. If you add a new repository interface, add a matching mock in
`backend/tests/GraphQL/SchemaShould.cs`.

---

## Local environment setup

`just` automatically loads `backend/api/.env` (via `set dotenv-load` + `set dotenv-path := "backend/api/.env"`). This file is **gitignored** — create it with:

```
Database__User="root"
Database__Password="<your-password>"
COMPOSE_PROJECT_NAME="trophy-tracker-backend"
```

The `__` separator is mapped by `AddEnvironmentVariables()` to `:`, so `Database__User` satisfies `Database:User` in .NET config. Only true secrets live in `.env` — no user secrets needed.

All non-secret config is in `appsettings.Development.json`:
- `Database:Host` and `Database:Port` → `localhost:5432`
- `Auth:Authority` → Clerk issuer URL

`Auth:Audience` is no longer used — Clerk JWT validation has `ValidateAudience = false`.

---

## Dev server endpoints

- HTTP: `http://localhost:5063`
- GraphQL endpoint: `/graphql`
- Nitro IDE (was BananaCakePop): `http://localhost:5063/dev`

---

## Generated files — never edit by hand

- `backend/api/schema.graphql` — always regenerate via `just schema-export`
- `frontend/src/__generated__/` — (when scaffolded) always regenerate via `just relay`

`schema.graphql` is listed in `backend/.gitignore`. Always regenerate rather than trust the committed copy.

---

## Authentication

- **Current:** Clerk JWT Bearer — `Auth:Authority` set to Clerk issuer URL, `ValidateAudience = false`
- **`FakeAuthHandler`** exists in `backend/api/Transport/` but is **not wired** in `Program.cs`. Real JWT auth is always active. Local dev without a valid Clerk token will be rejected.
- `TrophyHttpRequestInterceptor` reads `ClaimTypes.NameIdentifier` (`sub` claim) → injects `TokenUser` into HotChocolate global state. Clerk JWTs include `sub` natively.
- User registration is **explicit**: the frontend calls `registerUser` mutation after first Clerk sign-in (if `getMe` returns null). There is no longer any middleware auto-creating users on every request.

---

## User registration flow

The old `UserMiddleware` (upsert on every request) has been removed. The new flow:

1. Frontend calls `getMe` query after Clerk sign-in.
2. If `getMe` returns `NoUserError`, the user is not registered yet.
3. Frontend calls `registerUser(firstName, middleName?, lastName)` mutation.
4. `registerUser` creates the `User` row + `UserProfile` in a single transaction.
5. Throws `UserAlreadyRegisteredError` if called again (idempotency guard).

---

## Database

- PostgreSQL via Docker (`postgres:alpine3.18`), dev: `localhost:5432`
- **Fresh DB required** — Clerk user IDs (`user_xxx`) differ from Auth0 IDs (`auth0|xxx`). No migration planned.
- 18 EF Core migrations in `backend/api/Migrations/`; last: `20240129181317_EmojiMaxLength`

---

## HotChocolate 16 migration notes

Upgraded from HC13 → HC16.1.0-p.1.2. Breaking changes encountered and fixed:

- `IIdSerializer` → `INodeIdSerializer` (namespace: `HotChocolate.Types.Relay`); `.Serialize(null, type, id)` → `.Format(type, id)`
- `IQueryRequestBuilder` → `OperationRequestBuilder` in interceptor `OnCreateAsync` signature
- `.RegisterService<T>(ServiceKind.Resolver)` removed — services resolve from DI directly, no registration needed in HC builder
- `MapBananaCakePop(path)` → `MapNitroApp(path)`
- `schema.ToDocument()` → `schema.ToString()` in tests
- `ISystemClock` removed from `AuthenticationHandler` constructor — drop that parameter
- `dataLoader.Clear()` removed from `IDataLoader` — DataLoader cache is request-scoped, no manual clearing needed
- Schema export (`dotnet run ... schema export`) requires all DI services registered even in export mode, but must skip DB setup (no connection string available without env)

---


## Current rewrite phase status

Check `REWRITE_PLAN.md` for the latest. As of 2026-04-14: **Phase 2 complete**. Phase 3 (frontend scaffold) is next.
