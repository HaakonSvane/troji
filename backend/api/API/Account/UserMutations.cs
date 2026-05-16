using api.API.Errors;
using api.Database.Models;
using api.Repository;
using api.Transport;

namespace api.API.Account;

[MutationType]
public static class UserMutations
{
    [Error<NoUserException>]
    [Error<InvalidDisplayNameException>]
    public static async Task<User> UpdateUserDisplayNameAsync(
        [TokenUser] TokenUser? user,
        string displayName,
        IUserRepository repository,
        CancellationToken cancellationToken)
    {
        if (user is null)
        {
            throw new NoUserException();
        }

        return await repository.UpdateUserDisplayNameAsync(user.Id, displayName, cancellationToken);
    }

    [Error<NoUserException>]
    [Error<InvalidUserNameException>]
    public static async Task<User> UpdateUserProfileAsync(
        [TokenUser] TokenUser? user,
        string firstName,
        string? middleName,
        string lastName,
        IUserRepository repository,
        CancellationToken cancellationToken)
    {
        if (user is null)
        {
            throw new NoUserException();
        }

        return await repository.UpdateUserProfileAsync(user.Id, firstName, middleName, lastName, cancellationToken);
    }

    [Error<NoUserException>]
    [Error<UserAlreadyRegisteredException>]
    [Error<InvalidUserNameException>]
    [Error<InvalidDisplayNameException>]
    public static async Task<User> RegisterUserAsync(
        [TokenUser] TokenUser? user,
        string displayName,
        string firstName,
        string? middleName,
        string lastName,
        IUserRepository repository,
        CancellationToken cancellationToken)
    {
        if (user is null)
        {
            throw new NoUserException();
        }

        return await repository.RegisterUserAsync(user.Id, displayName, firstName, middleName, lastName, cancellationToken);
    }
}
