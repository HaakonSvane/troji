using api.API.Errors;
using api.Database;
using api.Database.Models;
using api.Images;
using api.Repository;
using api.Transport;
using Microsoft.EntityFrameworkCore;

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
    public static async Task<User> ClearUserAvatarAsync(
        [TokenUser] TokenUser? user,
        [Service] TrophyDbContext db,
        [Service] IImageService images,
        CancellationToken cancellationToken)
    {
        if (user is null)
        {
            throw new NoUserException();
        }

        var dbUser = await db.Users.FirstOrDefaultAsync(u => u.Id == user.Id, cancellationToken);
        if (dbUser is null)
        {
            throw new NoUserException();
        }

        var oldImageId = dbUser.ImageId;
        if (oldImageId is null)
        {
            return dbUser;
        }

        dbUser.ImageId = null;
        await db.SaveChangesAsync(cancellationToken);
        await images.DeleteAsync("users", oldImageId, cancellationToken);
        return dbUser;
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
