# AGENTS.md — backend/

Read this when working anywhere under `backend/`.

## Scope

- `api/` is the ASP.NET Core + HotChocolate GraphQL service.
- `tests/` is the NUnit test project for backend behavior and schema snapshots.

## Commands

- Prefer root `just` recipes over guessing commands:
  - `just build-backend`
  - `just test-backend`
  - `just run-backend`
  - `just db-up`
  - `just db-down`
  - `just db-update`
- `just` auto-loads `backend/api/.env`; plain `dotnet` commands do not.
- `dotnet ef` must target `--project backend/api`. Running it from the solution root without that flag fails because the `DbContext` is not defined at solution level.

## Environment

- .NET SDK is pinned in `backend/global.json` to `10.0.5`.
- Local DB is PostgreSQL via `backend/api/docker-compose.yml`.
- `backend/api/.env` is gitignored and must provide `Database__User` and `Database__Password` for local DB work.

## GraphQL And Auth

- Runtime auth is Clerk JWT bearer only. `FakeAuthHandler` exists but is not wired in `Program.cs`.
- `TrophyHttpRequestInterceptor` maps `ClaimTypes.NameIdentifier` to `TokenUser`; Clerk's `sub` claim is the identity source used by GraphQL.
- GraphQL HTTP requests require auth. In Development only, Nitro at `/dev` and SDL export at `/graphql/schema.graphql` are anonymous.
- Registration is explicit. Missing DB user after successful auth means the frontend should call `registerUser`; the backend does not auto-create users on request anymore.
- `NoUserError` currently means "no registered DB user for the authenticated identity" in the normal flow, not necessarily "not signed in".

## Generated Artifacts

- Do not hand-edit `backend/api/schema.graphql`; regenerate it.
- `just schema-export` works without a running DB because schema-export mode registers a dummy `TrophyDbContext` for DI validation.
- If the schema changes, also update the snapshot in `backend/tests`.

## References

- Read `backend/tests/AGENTS.md` before changing schema tests or snapshots.


