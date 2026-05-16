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
        var normalizedFirstName = firstName.Trim();
        var normalizedLastName = lastName.Trim();
        var normalizedMiddleName = string.IsNullOrWhiteSpace(middleName) ? null : middleName.Trim();

        if (string.IsNullOrWhiteSpace(normalizedFirstName) ||
            string.IsNullOrWhiteSpace(normalizedLastName))
        {
            throw new InvalidUserNameException();
        }

        var existing = await _context.Users
            .AnyAsync(u => u.Id == userId, cancellationToken);

        if (existing)
        {
            throw new UserAlreadyRegisteredException();
        }

        var user = new User
        {
            Id = userId,
            FirstName = normalizedFirstName,
            MiddleName = normalizedMiddleName,
            LastName = normalizedLastName,
        };

        await _context.Users.AddAsync(user, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return user;
    }

    public async Task<ILookup<int, User>> GetUsersByGroupIdsAsync(IReadOnlyList<int> ids, CancellationToken cancellationToken)
    {
        var userGroups = await _context.UserGroups
            .Where(ug => ids.Contains(ug.GroupId))
            .Include(ug => ug.User)
            .Select(ug => new {
                UserGroup = ug,
                LastActivity = _context.Trophies
                    .Where(t => t.ReceiverId == ug.UserId
                             && t.Game.ParentGroupId == ug.GroupId
                             && t.AwardedDate != null)
                    .Max(t => (DateTimeOffset?)t.AwardedDate)
            })
            .OrderByDescending(x => x.LastActivity)
            .ThenByDescending(x => x.UserGroup.JoinedAt)
            .ToListAsync(cancellationToken);
        return userGroups.ToLookup(x => x.UserGroup.GroupId, x => x.UserGroup.User);
    }

    public ILookup<int, User> GetUsersByGameIds(IReadOnlyList<int> ids)
    {
        return _context.Trophies
            .Where(trophy => ids.Contains(trophy.GameId))
            .Include(trophy => trophy.Receiver)
            .ToLookup(trophy => trophy.GameId, trophy => trophy.Receiver);
    }

    public async Task<User> UpdateUserAsync(
        string userId,
        string firstName,
        string? middleName,
        string lastName,
        CancellationToken cancellationToken)
    {
        var normalizedFirstName = firstName.Trim();
        var normalizedLastName = lastName.Trim();
        var normalizedMiddleName = string.IsNullOrWhiteSpace(middleName) ? null : middleName.Trim();

        if (string.IsNullOrWhiteSpace(normalizedFirstName) || string.IsNullOrWhiteSpace(normalizedLastName))
        {
            throw new InvalidUserNameException();
        }

        var user = await _context.Users.SingleOrDefaultAsync(u => u.Id == userId, cancellationToken)
            ?? throw new NoUserException();

        user.FirstName = normalizedFirstName;
        user.MiddleName = normalizedMiddleName;
        user.LastName = normalizedLastName;

        await _context.SaveChangesAsync(cancellationToken);
        return user;
    }

    public async Task<ILookup<int, User>> GetTopPlayersByGroupIdsAsync(IReadOnlyList<int> ids, CancellationToken cancellationToken)
    {
        var trophies = await _context.Trophies
            .Include(t => t.Receiver)
            .Include(t => t.Game)
            .Where(t => ids.Contains(t.Game.ParentGroupId) && t.AwardedDate != null)
            .ToListAsync(cancellationToken);
        return trophies.ToLookup(t => t.Game.ParentGroupId, t => t.Receiver);
    }
}
