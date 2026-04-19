using api.API.Errors;
using api.Database.Models;
using api.Repository;
using api.Transport;

namespace api.API.Account;

[QueryType]
public static class UserQueries
{
    [Error(typeof(NoUserException))]
    public static async Task<User> GetMeAsync(
        [TokenUser] TokenUser? user,
        IUsersByIdsDataLoader dataLoader,
        IUserRepository userRepository,
        CancellationToken cancellationToken)
    {
        if (user is null)
        {
            throw new NoUserException();
        }
        var dbUser = await dataLoader.LoadAsync(user.Id, cancellationToken);
        if (dbUser is null)
        {
            throw new NoUserException();
        }
        return dbUser;
    }

    [NodeResolver]
    public static async Task<User?> GetUserByIdAsync(
        string id,
        IUsersByIdsDataLoader dataLoader,
        CancellationToken cancellationToken)
    {
        return await dataLoader.LoadAsync(id, cancellationToken);
    }
}