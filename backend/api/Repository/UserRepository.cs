using api.Database;
using api.Database.Models;
using api.Utilities;
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

    public async Task<User> CreateUserAsync(string userId, CancellationToken cancellationToken)
    {
        var user = new User()
        {
            Id = userId,
            Username = UsernameGenerator.Generate(),
        };
        await _context.Users.AddAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return user;
    }

    public async Task<UserProfile> CreateUserProfileAsync(
        string userId,
        UserProfile userProfile,
        CancellationToken cancellationToken)
    {
        userProfile.User = null;
        userProfile.UserId = userId;
        await _context.AddAsync(userProfile, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return userProfile;
    }

    public async Task<IReadOnlyDictionary<string, UserProfile>> GetUserProfilesByIdsAsync(
        IReadOnlyList<string> ids,
        CancellationToken cancellationToken)
    {
        return await _context.UserProfiles
            .Where(userProfile => ids.Contains(userProfile.UserId))
            .ToDictionaryAsync(userProfile => userProfile.UserId, userProfile => userProfile, cancellationToken);
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