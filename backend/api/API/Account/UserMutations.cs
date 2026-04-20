using api.API.Errors;
using api.Database.Models;
using api.Repository;
using api.Transport;

namespace api.API.Account;

[MutationType]
public static class UserMutations
{
    [Error(typeof(UserAlreadyRegisteredException))]
    public static async Task<User> RegisterUserAsync(
        [TokenUser] TokenUser? user,
        string firstName,
        string? middleName,
        string lastName,
        IUserRepository repository,
        CancellationToken cancellationToken)
    {
        if (user is null)
        {
            throw new UnauthorizedAccessException("Not authenticated.");
        }

        return await repository.RegisterUserAsync(user.Id, firstName, middleName, lastName, cancellationToken);
    }
}
