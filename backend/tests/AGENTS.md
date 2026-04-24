# AGENTS.md — backend/tests/

## Schema Snapshot Test

- `GraphQL/SchemaShould.cs` builds the schema in-process; it does not need a running database.
- If you add a new repository dependency to the schema, add a matching `NSubstitute` mock in `GraphQL/SchemaShould.cs` or the snapshot test setup will fail before execution.
- Schema snapshot updates are intentional. Use:
  - `just update-snapshot`
  - or `SNAPPER_UPDATE_SNAPSHOTS=true dotnet test backend/trophy-tracker.sln --filter "FullyQualifiedName~SchemaShould"`

## Running Tests

- Prefer root commands from the repo root:
  - `just test-backend`
  - `dotnet test backend/trophy-tracker.sln --filter "FullyQualifiedName~SchemaShould"`
- The schema snapshot is the main guardrail after backend GraphQL shape changes.
