using api.API.Errors;
using api.Database;
using api.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository;

public sealed class UserRepository : IUserRepository
{
    private readonly TrophyDbContext _context;

    public UserRepository(TrophyDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetUserByIdAsync(string id, CancellationToken cancellationToken)
    {
        return await _context.Users
            .SingleOrDefaultAsync(user => user.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyDictionary<string, User>> GetUsersByIdsAsync(IReadOnlyList<string> ids,
        CancellationToken cancellationToken)
    {
        return await _context.Users
            .Where(user => ids.Contains(user.Id))
            .ToDictionaryAsync(user => user.Id, user => user, cancellationToken);
    }

    public async Task<User> RegisterUserAsync(
        string userId,
        string firstName,
        string? middleName,
        string lastName,
        CancellationToken cancellationToken)
    {
        var existing = await _context.Users
            .AnyAsync(u => u.Id == userId, cancellationToken);

        if (existing)
        {
            throw new UserAlreadyRegisteredException();
        }

        var user = new User
        {
            Id = userId,
            FirstName = firstName,
            MiddleName = middleName,
            LastName = lastName,
        };

        await _context.Users.AddAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return user;
    }

    public async Task<ILookup<int, User>> GetUsersByGroupIdsAsync(IReadOnlyList<int> ids, CancellationToken cancellationToken)
    {
        var userGroups = await _context.UserGroups
            .Where(userGroup => ids.Contains(userGroup.GroupId))
            .Include(userGroup => userGroup.User)
            .ToListAsync(cancellationToken);
        return userGroups.ToLookup(userGroup => userGroup.GroupId, userGroup => userGroup.User);
    }

    public ILookup<int, User> GetUsersByGameIdsAsync(IReadOnlyList<int> ids)
    {
        return _context.Trophies
            .Where(trophy => ids.Contains(trophy.GameId))
            .Include(trophy => trophy.Receiver)
            .ToLookup(trophy => trophy.GameId, trophy => trophy.Receiver);
    }
}
