using api.API.Errors;
using api.API.Group;
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

    public async Task<Group> UpdateGroupAsync(
        Group group,
        string name,
        string? description,
        CancellationToken cancellationToken)
    {
        var tracked = await _context.Groups
            .Include(g => g.Admin)
            .SingleAsync(g => g.Id == group.Id, cancellationToken);

        tracked.Name = name.Trim();
        var trimmedDescription = description?.Trim();
        tracked.Description = string.IsNullOrEmpty(trimmedDescription) ? null : trimmedDescription;
        await _context.SaveChangesAsync(cancellationToken);
        return tracked;
    }

    public async Task<bool> IsMemberAsync(int groupId, string userId, CancellationToken cancellationToken)
    {
        return await _context.UserGroups
            .AnyAsync(ug => ug.GroupId == groupId && ug.UserId == userId, cancellationToken);
    }

    public async Task<Group> TransferAdminAsync(
        Group group,
        string newAdminId,
        CancellationToken cancellationToken)
    {
        var tracked = await _context.Groups
            .SingleAsync(g => g.Id == group.Id, cancellationToken);
        tracked.AdminId = newAdminId;
        await _context.SaveChangesAsync(cancellationToken);

        var adminReference = _context.Entry(tracked).Reference(g => g.Admin);
        adminReference.IsLoaded = false;
        await adminReference.LoadAsync(cancellationToken);
        return tracked;
    }

    public async Task<IReadOnlyList<string>> DeleteGroupAsync(
        Group group,
        CancellationToken cancellationToken)
    {
        var memberIds = await _context.UserGroups
            .Where(ug => ug.GroupId == group.Id)
            .Select(ug => ug.UserId)
            .ToListAsync(cancellationToken);

        var tracked = await _context.Groups
            .SingleAsync(g => g.Id == group.Id, cancellationToken);
        _context.Groups.Remove(tracked);
        await _context.SaveChangesAsync(cancellationToken);
        return memberIds;
    }

    public async Task<int> GetRecentActivityCountAsync(int groupId, CancellationToken cancellationToken)
    {
        var awards = await _context.Trophies
            .CountAsync(t => t.Game.ParentGroupId == groupId && t.AwardedDate != null, cancellationToken);
        var joins = await _context.UserGroups
            .CountAsync(ug => ug.GroupId == groupId, cancellationToken);
        return awards + joins;
    }

    public async Task<IReadOnlyList<IGroupActivity>> GetRecentActivityAsync(
        int groupId,
        int take,
        CancellationToken cancellationToken)
    {
        var awards = await _context.Trophies
            .Include(t => t.Game)
            .Include(t => t.Receiver)
            .Where(t => t.Game.ParentGroupId == groupId && t.AwardedDate != null)
            .OrderByDescending(t => t.AwardedDate)
            .Take(take)
            .ToListAsync(cancellationToken);

        var joins = await _context.UserGroups
            .Include(ug => ug.User)
            .Where(ug => ug.GroupId == groupId)
            .OrderByDescending(ug => ug.JoinedAt)
            .Take(take)
            .ToListAsync(cancellationToken);

        var activities = new List<IGroupActivity>(awards.Count + joins.Count);
        foreach (var award in awards) activities.Add(new TrophyAwardedActivity(award));
        foreach (var join in joins) activities.Add(new MemberJoinedActivity(join.User, groupId, join.JoinedAt));

        return activities
            .OrderByDescending(a => a.OccurredAt)
            .Take(take)
            .ToList();
    }
}