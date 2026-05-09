using api.API.Errors;
using api.Database;
using api.Database.Models;
using api.Properties;
using Microsoft.EntityFrameworkCore;
using shortid;

namespace api.Repository;

public sealed class GroupRepository : IGroupRepository
{
    private readonly TrophyDbContext _context;

    public GroupRepository(TrophyDbContext context)
    {
        _context = context;
    }

    public async Task<ILookup<string, Group>> GetGroupsForUsersIdsAsync(
        IReadOnlyList<string> ids,
        CancellationToken cancellationToken)
    {
        var usersWithGroups = await _context.Users
            .Where(user => ids.Contains(user.Id))
            .Include(user => user.UserGroups)
            .ThenInclude(userGroup => userGroup.Group)
            .ToListAsync(cancellationToken);

        var lookup = usersWithGroups
            .SelectMany(
                user => user.UserGroups,
                (user, userGroup) => new { user.Id, Group = userGroup.Group }
            )
            .ToLookup(x => x.Id, x => x.Group);

        return lookup;
    }

    public async Task<IReadOnlyDictionary<int, Group>> GetGroupsByIdsAsync(
        IReadOnlyList<int> ids,
        CancellationToken cancellationToken)
    {
        return await _context.Groups
            .Where(group => ids.Contains(group.Id))
            .Include(group => group.Admin)
            .ToDictionaryAsync(group => group.Id, cancellationToken);
    }

    public Task<int> GetAdminGroupCountAsync(string adminUserId, CancellationToken cancellationToken)
    {
        return _context.Groups.CountAsync(g => g.AdminId == adminUserId, cancellationToken);
    }

    public async Task<Group> CreateGroupAsync(
        string adminUserId,
        Group group,
        CancellationToken cancellationToken)
    {
        group.Admin = null;
        group.AdminId = adminUserId;

        var userGroup = new UserGroup()
        {
            Group = group,
            UserId = adminUserId,
            JoinedAt = DateTimeOffset.UtcNow
        };

        await _context.Groups.AddAsync(group, cancellationToken);
        await _context.UserGroups.AddAsync(userGroup, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return group;
    }

    public async Task<GroupInvite> UpsertGroupInviteAsync(
        Group group,
        CancellationToken cancellationToken)
    {
        var oldInvite = await _context.GroupInvites
            .Where(invite => invite.GroupId == group.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (oldInvite is null)
        {
            var newInvite = new GroupInvite()
            {
                ExpirationDate = DateTimeOffset.UtcNow.AddDays(1),
                InviteCode = ShortId.Generate(ShortIdOptions.Config),
                GroupId = group.Id,
                NextAllowedResetDate = DateTimeOffset.UtcNow.AddMinutes(1)

            };
            await _context.GroupInvites.AddAsync(newInvite, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
            return newInvite;
        }

        if (oldInvite.NextAllowedResetDate > DateTimeOffset.UtcNow)
        {
            throw new InviteResetTooSoonException(oldInvite.NextAllowedResetDate - DateTimeOffset.UtcNow);
        }
        oldInvite.ExpirationDate = DateTimeOffset.UtcNow.AddDays(1);
        oldInvite.InviteCode = ShortId.Generate(ShortIdOptions.Config);
        oldInvite.NextAllowedResetDate = DateTimeOffset.UtcNow.AddMinutes(1);
        await _context.SaveChangesAsync(cancellationToken);
        return oldInvite;
    }

    public async Task<IReadOnlyDictionary<int, GroupInvite>> GetInvitesForGroupIdsAsync(
        IReadOnlyList<int> ids,
        CancellationToken cancellationToken)
    {
        return await _context.GroupInvites
            .Where(invite => ids.Contains(invite.GroupId))
            .ToDictionaryAsync(invite => invite.GroupId, cancellationToken);
    }

    public async Task<IReadOnlyDictionary<string, GroupInvite>> GetInvitesForInviteCodesAsync(
        IReadOnlyList<string> codes,
        CancellationToken cancellationToken)
    {
        return await _context.GroupInvites
            .Where(invite => codes.Contains(invite.InviteCode))
            .ToDictionaryAsync(invite => invite.InviteCode, cancellationToken);
    }

    public async Task<Group> AddUserToGroup(string userId, Group group, CancellationToken cancellationToken)
    {
        var userGroup = new UserGroup()
        {
            UserId = userId,
            GroupId = group.Id,
            JoinedAt = DateTimeOffset.UtcNow,
        };
        await _context.UserGroups.AddAsync(userGroup, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return group;
    }
}