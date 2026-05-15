# AGENTS.md — backend/tests/Integration/

Integration tests run the real API against a real PostgreSQL instance. This file covers the harness; see `backend/tests/AGENTS.md` for the separate schema snapshot test.

## Harness: TrophyWebAppFactory

- Spins up a **Testcontainers PostgreSQL** container per fixture (`Testcontainers.PostgreSql`). Docker must be running locally; CI must allow Docker-in-Docker.
- Sets the host environment to `"Testing"`, then replaces the JWT auth scheme with `FakeAuthHandler` via `services.PostConfigure<AuthenticationOptions>`. `PostConfigure` runs last, so this override always wins.
- Replaces the pooled `TrophyDbContext` registration with a scoped one pointed at the test container's connection string.
- `ApplyMigrationsAsync()` runs the real migration chain against the test DB — do not assume an empty schema.

Container startup is slow; tests batch into one fixture per test class and use `[OneTimeSetUp]`.

## Sending Authenticated GraphQL Requests

Use `GraphQLHelpers.ExecuteAsync(client, userId, query, variables)`. It POSTs to `/graphql` with header `X-Test-User-Id: <userId>`, which `FakeAuthHandler` reads to synthesize a `NameIdentifier` claim. New test utilities that issue HTTP calls must set the same header or the request will 401.

## Test Data Lifecycle

`TestDataBuilder` is a fluent static helper for creating `User`/`Group`/`GroupInvite`/`Game` rows. Prefer extending the builder over hand-rolling entity creation in test methods — the builder handles join tables (e.g. `CreateGroupAsync` also inserts a `UserGroup` for the admin).

`TestDataBuilder.ClearAllDataAsync` deletes in a specific FK-respecting order:

```
TrophyRequestApprovals → TrophyRequests → Trophies → Games
→ GroupInvites → UserGroups → Groups → Users
```

If you add a new entity, **update both** the builder helper and `ClearAllDataAsync` order — otherwise teardown fails with FK violations.

## Why Integration Tests Exist

Real GraphQL execution + real EF + real PostgreSQL. These catch resolver/EF integration bugs (composite keys, DataLoader plumbing, migration regressions) that the schema snapshot in `backend/tests/GraphQL/` cannot see.
