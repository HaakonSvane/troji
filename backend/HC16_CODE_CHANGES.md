# Hot Chocolate 16 Migration - Code Changes Reference

## Overview
This document shows before/after code snippets for all changes made during the Hot Chocolate 13 → 16 migration.

---

## 1. Program.cs - Remove RegisterService

### ❌ Before (Hot Chocolate 13)
```csharp
builder.Services
    .AddGraphQLServer()
    .AddAuthorization()
    .RegisterService<IUserRepository>(ServiceKind.Resolver)
    .RegisterService<IGroupRepository>(ServiceKind.Resolver)
    .RegisterService<IGameRepository>(ServiceKind.Resolver)
    .AddTypes()
    .AddGlobalObjectIdentification()
    .AddMutationConventions(applyToAllMutations: true)
    .AddQueryFieldToMutationPayloads()
    .AddHttpRequestInterceptor<TrophyHttpRequestInterceptor>()
    .UseRequest<UserMiddleware>()
    .UseDefaultPipeline()
    .AddSorting();
```

### ✅ After (Hot Chocolate 16)
```csharp
builder.Services
    .AddGraphQLServer()
    .AddAuthorization()
    .AddTypes()
    .AddGlobalObjectIdentification()
    .AddMutationConventions(applyToAllMutations: true)
    .AddQueryFieldToMutationPayloads()
    .AddHttpRequestInterceptor<TrophyHttpRequestInterceptor>()
    .UseRequest<UserMiddleware>()
    .UseDefaultPipeline()
    .AddSorting();
```

**Reason**: Services registered via `.AddScoped<>()` are automatically available in HC16. The `RegisterService` method no longer exists.

---

## 2. api.csproj - Enable Interceptors

### ❌ Before
```xml
<PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <UserSecretsId>68de58ca-cab4-4ffb-adf5-dc8aee18503d</UserSecretsId>
</PropertyGroup>
```

### ✅ After
```xml
<PropertyGroup>
    <TargetFramework>net10.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <UserSecretsId>68de58ca-cab4-4ffb-adf5-dc8aee18503d</UserSecretsId>
    <InterceptorsNamespaces>$(InterceptorsNamespaces);HotChocolate.Execution.Generated</InterceptorsNamespaces>
</PropertyGroup>
```

**Reason**: HC16 uses C# interceptors for code generation. This must be explicitly enabled in the project file.

---

## 3. TrophyHttpRequestInterceptor.cs - API Change

### ❌ Before
```csharp
using System.Security.Claims;
using HotChocolate.AspNetCore;
using HotChocolate.Execution;

namespace api.Transport;

public class TrophyHttpRequestInterceptor : DefaultHttpRequestInterceptor
{
    public override async ValueTask OnCreateAsync(HttpContext context, IRequestExecutor requestExecutor,
        IQueryRequestBuilder requestBuilder,  // ← Old type
        CancellationToken cancellationToken)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userId is not null)
        {
            requestBuilder.SetGlobalState("User", new TokenUser(userId));
        }
        await base.OnCreateAsync(context, requestExecutor, requestBuilder, cancellationToken);
    }
}
```

### ✅ After
```csharp
using System.Security.Claims;
using HotChocolate.AspNetCore;
using HotChocolate.Execution;

namespace api.Transport;

public class TrophyHttpRequestInterceptor : DefaultHttpRequestInterceptor
{
    public override async ValueTask OnCreateAsync(HttpContext context, IRequestExecutor requestExecutor,
        OperationRequestBuilder requestBuilder,  // ← New type
        CancellationToken cancellationToken)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (userId is not null)
        {
            requestBuilder.SetGlobalState("User", new TokenUser(userId));
        }
        await base.OnCreateAsync(context, requestExecutor, requestBuilder, cancellationToken);
    }
}
```

**Reason**: `IQueryRequestBuilder` was renamed to `OperationRequestBuilder` in HC16.

---

## 4. UserMiddleware.cs - Context & DI Changes

### ❌ Before
```csharp
using api.Repository;
using api.Transport;
using HotChocolate.Execution;
using Microsoft.EntityFrameworkCore;

namespace api.API.Middleware;

internal sealed class UserMiddleware
{
    private readonly HotChocolate.Execution.RequestDelegate _next;

    public UserMiddleware(HotChocolate.Execution.RequestDelegate next)
    {
        _next = next;
    }

    public async ValueTask InvokeAsync(IRequestContext context)  // ← Old context type
    {
        if (context.ContextData.TryGetValue("User", out var tokenUserObject) && tokenUserObject is TokenUser tokenUser)
        {
            var repository = context.Services.GetService<IUserRepository>();  // ← Old DI approach
            if (repository is null)
            {
                await _next(context);
                return;
            }
            
            var cancellationToken = context.RequestAborted;
            try
            {
                await repository.CreateUserAsync(tokenUser.Id, cancellationToken);
            }
            catch (DbUpdateException ex){}
        }
        await _next(context);
    }
}
```

### ✅ After
```csharp
using api.Repository;
using api.Transport;
using HotChocolate.Execution;
using Microsoft.EntityFrameworkCore;

namespace api.API.Middleware;

internal sealed class UserMiddleware
{
    private readonly HotChocolate.Execution.RequestDelegate _next;

    public UserMiddleware(HotChocolate.Execution.RequestDelegate next)
    {
        _next = next;
    }

    public async ValueTask InvokeAsync(RequestContext context, IUserRepository repository)  // ← New: context type + parameter injection
    {
        if (context.ContextData.TryGetValue("User", out var tokenUserObject) && tokenUserObject is TokenUser tokenUser)
        {
            var cancellationToken = context.RequestAborted;
            try
            {
                await repository.CreateUserAsync(tokenUser.Id, cancellationToken);
            }
            catch (DbUpdateException){}
        }
        await _next(context);
    }
}
```

**Reason**: 
- `IRequestContext` → `RequestContext` (concrete type)
- Service resolution via method parameter injection instead of `context.Services`

---

## 5. IIdSerializer Namespace Changes

### ❌ Before
```csharp
using api.API.Errors;
using api.Database.Models;
using api.Repository;
using api.Transport;
using IIdSerializer = HotChocolate.Types.Relay.IIdSerializer;  // ← Old namespace

namespace api.API.Group;

[MutationType]
public static class GroupMutations
{
    public static async Task<GroupInvite> CreateGroupInviteAsync(
        [TokenUser] TokenUser? tokenUser,
        [ID] int groupId,
        IGroupRepository groupRepository,
        IGroupsByIdsDataLoader dataLoader,
        CancellationToken cancellationToken,
        [Service] IIdSerializer serializer)  // ← Using IIdSerializer
    {
        // ...
    }
}
```

### ✅ After
```csharp
using api.API.Errors;
using api.Database.Models;
using api.Repository;
using api.Transport;
using HotChocolate.Types;  // ← New namespace

namespace api.API.Group;

[MutationType]
public static class GroupMutations
{
    public static async Task<GroupInvite> CreateGroupInviteAsync(
        [TokenUser] TokenUser? tokenUser,
        [ID] int groupId,
        IGroupRepository groupRepository,
        IGroupsByIdsDataLoader dataLoader,
        CancellationToken cancellationToken,
        [Service] IIdSerializer serializer)  // ← IIdSerializer now from HotChocolate.Types
    {
        // ...
    }
}
```

**Reason**: `IIdSerializer` moved from `HotChocolate.Types.Relay` to `HotChocolate.Types` namespace.

**Files Updated**:
- API/Group/GroupMutations.cs
- API/Games/GameMutations.cs
- API/Games/TrophyMutations.cs
- API/Games/GameNode.cs
- Services/GroupService.cs

---

## What Stayed the Same ✅

### DataLoaders
```csharp
[DataLoader]
internal static async Task<IReadOnlyDictionary<int, Game>> GetGamesByIdsAsync(
    IReadOnlyList<int> ids,
    IGameRepository repository,
    CancellationToken cancellationToken)
{
    return await repository.GetGamesByIdsAsync(ids, cancellationToken);
}
```
**No changes needed** - DataLoader API is backward compatible.

### Type Extensions
```csharp
[ExtendObjectType<Game>]
public static class GameNode
{
    // ...
}
```
**No changes needed** - Type extension attributes work the same.

### Query/Mutation Types
```csharp
[QueryType]
public static class GameQueries { }

[MutationType]
public static class GameMutations { }
```
**No changes needed** - Type annotations unchanged.

### Node Resolvers
```csharp
[NodeResolver]
public static async Task<Game?> GetGameByIdAsync(
    int id,
    IGamesByIdsDataLoader dataLoader,
    CancellationToken cancellationToken)
{
    return await dataLoader.LoadAsync(id, cancellationToken);
}
```
**No changes needed** - Node resolver pattern unchanged.

### Authorization
```csharp
[Authorize(Policy = "IsGroupMember", Apply = ApplyPolicy.AfterResolver)]
[ExtendObjectType(typeof(Database.Models.Group))]
public static class GroupNode
{
    // ...
}
```
**No changes needed** - Authorization attributes work the same.

---

## Summary

### Breaking Changes Fixed: 5
1. ✅ Removed `RegisterService` calls
2. ✅ Added `InterceptorsNamespaces` to csproj
3. ✅ Changed `IQueryRequestBuilder` → `OperationRequestBuilder`
4. ✅ Changed `IRequestContext` → `RequestContext` + parameter injection
5. ✅ Updated `IIdSerializer` namespace imports

### Features Still Working: 6+
1. ✅ DataLoaders with `[DataLoader]` attribute
2. ✅ Type extensions with `[ExtendObjectType<T>]`
3. ✅ Query/Mutation types with `[QueryType]`/`[MutationType]`
4. ✅ Node resolvers with `[NodeResolver]`
5. ✅ Authorization with `[Authorize]`
6. ✅ Global Object Identification
7. ✅ Mutation conventions
8. ✅ Sorting and filtering

---

**Migration Status**: ✅ Complete - All Hot Chocolate 13 → 16 breaking changes addressed!

