# AGENTS.md — Trophy Tracker (troji)

## Repo Overview

- `backend/` contains the .NET 10 GraphQL API and backend tests.
- `frontend/` contains the React Router 7 + React 19 client.
- `apis/` is metadata only, not an app runtime.
- `REWRITE_PLAN.md` is the architecture and migration document; use it for intent, not for day-to-day command truth.

## Navigate Quickly

- Read `backend/AGENTS.md` for backend runtime, auth, schema, and DB guidance.
- Read `backend/tests/AGENTS.md` for schema snapshot and test setup rules.
- Read `frontend/AGENTS.md` for Clerk, Relay, route-loading, and registration-flow guidance.
- `justfile` is the command entry point for normal local workflows.

## Run The Systems

- `just db-up` starts PostgreSQL for local backend work.
- `just run-backend` runs the API.
- `just dev-frontend` runs the frontend dev server.
- `just dev` starts the local stack through `just` recipes.
- `just build-backend`, `just test-backend`, and `just build-frontend` are the main verification commands.

## General Guidelines

- Prefer root `just` recipes before inventing ad hoc commands.
- .NET SDK is pinned in `backend/global.json` to `10.0.5`.
- `just` auto-loads `backend/api/.env`; plain shell commands usually do not.
- Never hand-edit generated GraphQL or Relay artifacts; the nested agent files call out the regeneration commands.
- Keep instructions compact and current. If a repo fact stops being true, update the nearest nested `AGENTS.md` instead of adding more prose here.

## Committing Work

After completing every chunk of work. Commit!