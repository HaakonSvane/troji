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
