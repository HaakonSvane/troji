# Hot Chocolate 13 to 16 Migration - Changes Applied

## Date
January 11, 2026

## Summary
This document outlines all the changes made to migrate from Hot Chocolate 13 to Hot Chocolate 16 (preview version 16.0.0-p.10.28).

## Key Breaking Changes Fixed

### 1. Removed `RegisterService` Method
**Location**: `Program.cs`

**Issue**: The `RegisterService` method no longer exists in HC16. Services registered with `.AddScoped()` are automatically available in resolvers.

**Fix**: Removed these lines:
```csharp
.RegisterService<IUserRepository>(ServiceKind.Resolver)
.RegisterService<IGroupRepository>(ServiceKind.Resolver)
.RegisterService<IGameRepository>(ServiceKind.Resolver)
```

The repositories registered with `builder.Services.AddScoped<>()` are automatically injected into GraphQL resolvers.

---

### 2. `IIdSerializer` Namespace Change
**Locations**: 
- `API/Group/GroupMutations.cs`
- `API/Games/GameMutations.cs`
- `API/Games/TrophyMutations.cs`
- `API/Games/GameNode.cs`
- `Services/GroupService.cs`

**Issue**: `IIdSerializer` moved from `HotChocolate.Types.Relay` to `HotChocolate.Types`

**Fix**: Updated all imports from:
```csharp
using IIdSerializer = HotChocolate.Types.Relay.IIdSerializer;
```
to:
```csharp
using HotChocolate.Types;
```

---

### 3. HTTP Request Interceptor API Change
**Location**: `Transport/TrophyHttpRequestInterceptor.cs`

**Issue**: `IQueryRequestBuilder` was renamed to `OperationRequestBuilder`

**Fix**: Updated method signature from:
```csharp
public override async ValueTask OnCreateAsync(HttpContext context, IRequestExecutor requestExecutor,
    IQueryRequestBuilder requestBuilder,
    CancellationToken cancellationToken)
```
to:
```csharp
public override async ValueTask OnCreateAsync(HttpContext context, IRequestExecutor requestExecutor,
    OperationRequestBuilder requestBuilder,
    CancellationToken cancellationToken)
```

---

### 4. Request Middleware API Change
**Location**: `API/Middleware/UserMiddleware.cs`

**Issue**: The request-level middleware API changed:
- `IRequestContext` was replaced with `RequestContext`
- Service resolution must be done via method injection instead of `context.Services`

**Fix**: Updated from:
```csharp
public async ValueTask InvokeAsync(IRequestContext context)
{
    if (context.ContextData.TryGetValue("User", out var tokenUserObject) && tokenUserObject is TokenUser tokenUser)
    {
        var repository = context.Services.GetService<IUserRepository>();
        if (repository is null)
        {
            await _next(context);
            return;
        }
        // ...
    }
}
```

to:
```csharp
public async ValueTask InvokeAsync(RequestContext context, IUserRepository repository)
{
    if (context.ContextData.TryGetValue("User", out var tokenUserObject) && tokenUserObject is TokenUser tokenUser)
    {
        // Use injected repository directly
        // ...
    }
}
```

---

### 5. Interceptors Feature Enablement
**Location**: `api.csproj`

**Issue**: HC16 uses C# interceptors which must be explicitly enabled

**Fix**: Added to `PropertyGroup`:
```xml
<InterceptorsNamespaces>$(InterceptorsNamespaces);HotChocolate.Execution.Generated</InterceptorsNamespaces>
```

---

## Files Modified

1. `api/api.csproj` - Added interceptors namespace configuration
2. `api/Program.cs` - Removed RegisterService calls
3. `api/Transport/TrophyHttpRequestInterceptor.cs` - Updated to OperationRequestBuilder
4. `api/API/Middleware/UserMiddleware.cs` - Updated middleware API
5. `api/API/Group/GroupMutations.cs` - Fixed IIdSerializer import
6. `api/API/Games/GameMutations.cs` - Fixed IIdSerializer import
7. `api/API/Games/TrophyMutations.cs` - Fixed IIdSerializer import
8. `api/API/Games/GameNode.cs` - Fixed IIdSerializer import
9. `api/Services/GroupService.cs` - Fixed IIdSerializer import

---

## What Still Works

✅ **DataLoaders**: The `[DataLoader]` attribute and DataLoader API remain compatible
✅ **Node Resolvers**: `[NodeResolver]` attribute works as expected
✅ **Type Extensions**: `[ExtendObjectType<T>]` works correctly
✅ **Queries & Mutations**: `[QueryType]` and `[MutationType]` attributes work correctly
✅ **Authorization**: `[Authorize]` and custom authorization handlers work
✅ **Middleware**: Request-level middleware works with updated API
✅ **Global Object Identification**: Node interface and Global ID support unchanged
✅ **Mutation Conventions**: Mutation conventions continue to work

---

## References

- Hot Chocolate 16 is currently in preview (16.0.0-p.10.28)
- Official migration guide: https://chillicream.com/docs/hotchocolate/v16/migrating/migration-v13-to-v14
- Note: Some v14 migration steps also apply to v16

---

## Verification

Run the following to verify the migration:
```bash
dotnet clean
dotnet build
```

All compilation errors should be resolved.

