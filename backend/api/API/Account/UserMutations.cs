using api.Database.Models;
using api.Repository;
using api.Transport;

namespace api.API.Account;

[MutationType]
public static class UserMutations
{
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

    public static async Task<UserProfile> CreateUserProfileAsync(
        [TokenUser] TokenUser? user,
        string firstName,
        string? middleName,
        string lastName,
        IUserRepository repository,
        CancellationToken cancellationToken)
    {
        if (user is null)
        {
            throw new InvalidOperationException("User must be authenticated to create profile");
        }
        var userProfile = new UserProfile()
        {
            FirstName = firstName,
            MiddleName = middleName,
            LastName = lastName
        };
        return await repository.CreateUserProfileAsync(user.Id, userProfile, cancellationToken);
    }
}