using api.Database;
using api.Database.Models;

namespace tests.Integration;

public static class TestDataBuilder
{
    public static async Task<User> CreateUserAsync(
        TrophyDbContext db,
        string userId,
        string firstName = "Test",
        string lastName = "User")
    {
        var user = new User { Id = userId, FirstName = firstName, LastName = lastName };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    /// <summary>
    /// Creates a group and adds the admin as its first member.
    /// </summary>
    public static async Task<Group> CreateGroupAsync(
        TrophyDbContext db,
        string adminId,
        string name = "Test Group")
    {
        var group = new Group
        {
            Name = name,
            AdminId = adminId,
            DecisionModel = Group.RuleType.Open,
            CreatedDate = DateTimeOffset.UtcNow,
        };
        db.Groups.Add(group);
        await db.SaveChangesAsync();

        db.UserGroups.Add(new UserGroup { UserId = adminId, GroupId = group.Id, JoinedAt = DateTimeOffset.UtcNow });
        await db.SaveChangesAsync();

        return group;
    }

    public static async Task<GroupInvite> CreateGroupInviteAsync(
        TrophyDbContext db,
        int groupId,
        string inviteCode,
        DateTimeOffset? expirationDate = null)
    {
        var invite = new GroupInvite
        {
            GroupId = groupId,
            InviteCode = inviteCode,
            ExpirationDate = expirationDate ?? DateTimeOffset.UtcNow.AddDays(7),
            NextAllowedResetDate = DateTimeOffset.UtcNow,
        };
        db.GroupInvites.Add(invite);
        await db.SaveChangesAsync();
        return invite;
    }

    public static async Task<Game> CreateGameAsync(
        TrophyDbContext db,
        int groupId,
        string name,
        string emoji)
    {
        var game = new Game
        {
            Name = name,
            Emoji = emoji,
            ParentGroupId = groupId,
            CreatedDate = DateTimeOffset.UtcNow,
        };
        db.Games.Add(game);
        await db.SaveChangesAsync();
        return game;
    }

    public static async Task ClearAllDataAsync(TrophyDbContext db)
    {
        db.TrophyRequestApprovals.RemoveRange(db.TrophyRequestApprovals);
        db.TrophyRequests.RemoveRange(db.TrophyRequests);
        db.Trophies.RemoveRange(db.Trophies);
        db.Games.RemoveRange(db.Games);
        db.GroupInvites.RemoveRange(db.GroupInvites);
        db.UserGroups.RemoveRange(db.UserGroups);
        db.Groups.RemoveRange(db.Groups);
        db.Users.RemoveRange(db.Users);
        await db.SaveChangesAsync();
    }
}
