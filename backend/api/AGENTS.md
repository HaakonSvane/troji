# AGENTS.md — backend/api/

Internal layout and patterns for the API project. See `backend/AGENTS.md` for commands, auth flow, and schema-export.

## Folder Layout

- `API/` — GraphQL surface, split by domain: `Account/`, `Games/`, `Group/`, `Errors/`. New GraphQL types/queries/mutations slot into one of these folders; don't add them at `API/` root.
- `Database/` — `TrophyDbContext`, `Seeder`, and `Models/` (EF entity classes).
- `Repository/` — Data access. One interface + impl per aggregate (`IGameRepository`, `IGroupRepository`, `IUserRepository`).
- `Transport/` — Auth pipeline + GraphQL error filter.
- `Migrations/` — EF Core migration chain. Never hand-edit; never hand-edit `TrophyDbContextModelSnapshot.cs`. Generate with `dotnet ef migrations add <Name> --project backend/api` (the `--project` flag is mandatory — see `backend/AGENTS.md`).

## GraphQL Patterns

- **Domain types** use `[ExtendObjectType<T>]` static classes (see `GameNode.cs`) — that's how field resolvers attach to EF entities without polluting the model classes.
- **DataLoaders** are static methods marked `[DataLoader]` and return `ILookup<int, T>` (1→many) or `IReadOnlyDictionary<int, T>` (1→1). Always resolve relations through a DataLoader, not direct `DbContext` access from a resolver — anything else reintroduces N+1.
- **Mutation errors** use HotChocolate's `[Error<XxxException>]` attributes on the mutation method. Throw the exception in C#; HotChocolate generates the schema's error union (`CreateGamePayload.errors: [CreateGameError!]`). Don't return error objects manually, and don't catch domain exceptions in mutations.
- **Pagination** via `[UsePaging(...)]` (e.g. `IncludeTotalCount`, `MaxPageSize`, `DefaultPageSize`). Connection-style cursor pagination is the default.
- **Identity injection**: `[TokenUser] TokenUser? tokenUser` on resolver/mutation parameters. If null, the canonical response is `throw new NoUserException()`.

## Database Conventions

- `User.Id` is a `string` — Clerk's `sub` claim, set explicitly. Not identity-generated. The Seeder and tests rely on this.
- Composite primary keys exist on `UserGroup` (`UserId + GroupId`) and `TrophyRequestApproval` (`UserId + RequestId`). Adding indexes/migrations around these tables needs both columns.
- `Group.DecisionModel` (`Open` | `Approval`) gates whether a trophy request needs co-signs before becoming a `Trophy`.
- A unique constraint enforces `(ParentGroupId, Emoji)` on `Game` — `DuplicateGameEmojiException` is the user-facing error.
- Timestamps are `DateTimeOffset` (UTC). Don't use `DateTime`.

## Transport (Auth + Errors)

- `TrophyHttpRequestInterceptor` maps `ClaimTypes.NameIdentifier` → `TokenUser` and stuffs it into the GraphQL request's global state under key `"User"`. `[TokenUser]` attribute pulls it back out in resolvers.
- `FakeAuthHandler` is wired **only** by `TrophyWebAppFactory` in integration tests, never by production `Program.cs`. It reads `X-Test-User-Id` from the request.
- `TrophyErrorFilter` is the centralized exception → GraphQL error converter. Domain exceptions get caught here.

## Error Handling

- **Throw domain exceptions only.** Domain failures use the typed exceptions in `API/Errors/` (e.g. `NoUserException`, `InvalidUserNameException`, `GroupNotFoundException`). Never throw raw `Exception`, `ArgumentException`, or `UnauthorizedAccessException` from mutations or repositories — those bypass the typed error union and either leak raw .NET messages or get scrubbed to `"Internal server error."` by the filter's catch-all.
- **Declare every thrown exception with `[Error<T>]`.** Each mutation method must annotate every domain exception it (transitively) throws. HotChocolate uses these attributes to build the schema's per-mutation error union (e.g. `RegisterUserError = NoUserError | UserAlreadyRegisteredError | InvalidUserNameError`). If you add a new thrown exception, add the attribute or it won't appear in the union — the frontend then can't enumerate it statically.
- **`TrophyErrorFilter` is a closed allowlist.** A new domain exception type must be added to the `is ... or ...` allowlist in `Transport/TrophyErrorFilter.cs`, otherwise the catch-all rewrites it to `"Internal server error."` with code `UnexpectedError` and logs the original. That catch-all is intentional for genuinely unexpected exceptions but wrong for new domain errors — keep the allowlist current.
- **Stick to `message: String!`.** Adding structured fields to an error type (like `InviteResetTooSoonError.secondsToWait`) is fine when a concrete frontend consumer needs them, but don't add fields speculatively — the frontend already discriminates on `__typename`.
- The filter's static `Logger` exists because HC's schema service container does not expose `ILogger<T>`; the comment in `TrophyErrorFilter.cs` is the canonical explanation. Don't replace it with constructor injection without first verifying schema-export still works.

## References

- `backend/AGENTS.md` — commands, env, auth flow, schema-export.
- `backend/tests/Integration/AGENTS.md` — integration test harness.
- `backend/tests/AGENTS.md` — schema snapshot guardrail.
