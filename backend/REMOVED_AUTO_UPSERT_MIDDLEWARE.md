# Removed Auto-Upsert User Middleware Pattern

**Date**: January 11, 2026

## Summary

Removed the problematic auto-upsert middleware pattern that automatically created users in the database on every authenticated GraphQL request. This pattern was bad because:

1. **Performance overhead**: Database operations on every authenticated request
2. **Silent error handling**: Empty catch blocks swallowed database errors
3. **Poor separation of concerns**: Coupled authentication with data persistence
4. **No explicit user consent**: Created users without explicit user action
5. **Foreign key violations**: Could cause issues when user wasn't in DB but mutations expected them

## Changes Made

### 1. Removed UserMiddleware (Deleted File)
**File**: `api/API/Middleware/UserMiddleware.cs` ❌ DELETED

This middleware intercepted every request and called `CreateUserAsync` with upsert logic.

### 2. Updated Program.cs
**File**: `api/Program.cs`

**Changes**:
- Removed `using api.API.Middleware;`
- Removed `.UseRequest<UserMiddleware>()` from GraphQL server configuration

### 3. Refactored UserRepository.CreateUserAsync
**File**: `api/Repository/UserRepository.cs`

**Before**:
```csharp
public async Task<User> CreateUserAsync(string userId, CancellationToken cancellationToken)
{
    var user = new User() { Id = userId, Username = UsernameGenerator.Generate() };
    await _context.Users.Upsert(user)
        .On(u => u.Id)
        .NoUpdate()
        .RunAsync(cancellationToken);
    await _context.SaveChangesAsync(cancellationToken);
    return user;
}
```

**After**:
```csharp
public async Task<User> CreateUserAsync(string userId, CancellationToken cancellationToken)
{
    var user = new User() { Id = userId, Username = UsernameGenerator.Generate() };
    await _context.Users.AddAsync(user, cancellationToken);
    await _context.SaveChangesAsync(cancellationToken);
    return user;
}
```

Changed from upsert with NoUpdate to standard insert operation.

### 4. Added Explicit User Registration
**File**: `api/API/Account/UserMutations.cs`

**Added**:
```csharp
public static async Task<User> RegisterUserAsync(
    [TokenUser] TokenUser? tokenUser,
    IUserRepository repository,
    CancellationToken cancellationToken)
{
    if (tokenUser is null)
    {
        throw new InvalidOperationException("User must be authenticated to register");
    }

    // Check if user already exists
    var existingUser = await repository.GetUserByIdAsync(tokenUser.Id, cancellationToken);
    if (existingUser is not null)
    {
        return existingUser; // User already registered
    }

    return await repository.CreateUserAsync(tokenUser.Id, cancellationToken);
}
```

Users must now explicitly call `registerUser` mutation after authentication.

### 5. Added UserNotRegisteredException
**File**: `api/API/Errors/UserNotRegisteredException.cs` ✅ NEW

```csharp
public sealed class UserNotRegisteredException : Exception
{
    public UserNotRegisteredException()
        : base("User is authenticated but not registered. Please call registerUser mutation first.")
    {
    }
}
```

### 6. Updated GetMeAsync Query
**File**: `api/API/Account/UserQueries.cs`

**Changes**:
- Added `[Error(typeof(UserNotRegisteredException))]` attribute
- Now throws `UserNotRegisteredException` when authenticated user doesn't exist in database

### 7. Updated Group Mutations
**File**: `api/API/Group/GroupMutations.cs`

**Changes**:
- `CreateGroupAsync`: Added user existence check, throws `UserNotRegisteredException` if user not registered
- `JoinGroupAsync`: Added user existence check, throws `UserNotRegisteredException` if user not registered
- Removed `IIdSerializer` usage (doesn't exist in HC16), replaced with simple `.ToString()`
- Fixed null reference check for `myGroups` in `JoinGroupAsync`
- Removed `groupsByUserIdsDataLoader.Clear()` call (doesn't exist in HC16)

### 8. Fixed IIdSerializer Issues Across Codebase

**Problem**: `IIdSerializer` interface doesn't exist in HotChocolate 16 preview 10.28

**Solution**: Removed all usages and replaced with simple `.ToString()` for ID serialization in error messages

**Files Updated**:
- `api/API/Group/GroupMutations.cs` - Removed IIdSerializer import and usage
- `api/API/Games/GameMutations.cs` - Removed IIdSerializer import and usage
- `api/API/Games/TrophyMutations.cs` - Removed IIdSerializer import and usage
- `api/API/Games/GameNode.cs` - Removed IIdSerializer, simplified GetGroupId
- `api/Services/GroupService.cs` - Removed IIdSerializer dependency and usage

### 9. Fixed GroupService Constructor
**File**: `api/Services/GroupService.cs`

**Changes**:
- Added `IGroupsByIdsDataLoader` parameter to constructor (was missing)

## Migration Path for Clients

### Frontend Changes Required

1. **After user authenticates**, call the `registerUser` mutation:
```graphql
mutation RegisterUser {
  registerUser {
    id
    username
  }
}
```

2. **Handle UserNotRegisteredException**: When calling queries/mutations, handle the error gracefully:
```graphql
query GetMe {
  me {
    id
    username
    ... on UserNotRegisteredError {
      message
    }
  }
}
```

3. **Existing users**: Already in the database, no action needed
4. **New users**: Must call `registerUser` before using other mutations

## Benefits

✅ **Explicit user registration**: Users are created only when they explicitly register
✅ **Better error handling**: No silent failures, proper exception types
✅ **Performance**: No unnecessary database calls on every request
✅ **Data integrity**: Foreign key constraints properly enforced
✅ **Clearer flow**: Registration is a distinct, trackable event

## Testing Checklist

- [ ] Test new user registration flow
- [ ] Test existing user can still perform operations
- [ ] Test unauthenticated users get proper errors
- [ ] Test authenticated but unregistered users get `UserNotRegisteredException`
- [ ] Test `CreateGroupAsync` requires registered user
- [ ] Test `JoinGroupAsync` requires registered user
- [ ] Test `GetMeAsync` properly handles unregistered users

## Related Files

**Kept but Modified**:
- `api/Transport/TrophyHttpRequestInterceptor.cs` - Still extracts user from JWT
- `api/Transport/TokenUser.cs` - Still represents authenticated user
- `api/Transport/TokenUserAttribute.cs` - Still used for parameter injection

**Authentication Flow**:
1. User authenticates with Auth0/JWT provider
2. `TrophyHttpRequestInterceptor` extracts user ID from JWT
3. Sets `TokenUser` in global state
4. Mutations/queries receive `[TokenUser]` parameter
5. User must call `registerUser` mutation before other operations

## Notes

- The `TrophyHttpRequestInterceptor` still runs and extracts the user from the JWT token
- The `[TokenUser]` attribute still works for injecting authenticated user into resolvers
- Only the automatic database upsert behavior has been removed
- Users are now explicitly registered via the `registerUser` mutation

