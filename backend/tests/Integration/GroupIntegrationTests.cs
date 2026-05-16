using System.Text.Json;
using api.Database;
using api.Database.Models;
using HotChocolate.Types.Relay;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace tests.Integration;

[TestFixture]
[Category("Integration")]
public class GroupIntegrationTests
{
    private TrophyWebAppFactory _factory = null!;
    private HttpClient _client = null!;

    [OneTimeSetUp]
    public async Task OneTimeSetUpAsync()
    {
        _factory = new TrophyWebAppFactory();
        await _factory.InitializeAsync();
        _client = _factory.CreateClient();
        await _factory.ApplyMigrationsAsync();
    }

    [TearDown]
    public async Task TearDownAsync()
    {
        using var scope = _factory.CreateDbScope();
        var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        await TestDataBuilder.ClearAllDataAsync(db);
    }

    [OneTimeTearDown]
    public async Task OneTimeTearDownAsync()
    {
        _client.Dispose();
        await _factory.DisposeAsync();
    }

    [Test]
    public async Task JoinGroup_WithValidInviteCode_ShouldSucceedAndUserShouldBelongToGroup()
    {
        // Arrange
        const string adminId = "user_group_admin_001";
        const string joinerId = "user_group_joiner_001";
        const string inviteCode = "TSTCD001";

        int groupId;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId, "Admin", "One");
            await TestDataBuilder.CreateUserAsync(db, joinerId, "Joiner", "One");
            var group = await TestDataBuilder.CreateGroupAsync(db, adminId, "Joinable Group");
            groupId = group.Id;
            await TestDataBuilder.CreateGroupInviteAsync(db, group.Id, inviteCode);
        }

        const string mutation = """
            mutation JoinGroup($input: JoinGroupInput!) {
              joinGroup(input: $input) {
                group { id }
                errors { __typename }
              }
            }
            """;

        // Act
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, joinerId, mutation, new { input = new { inviteCode } });

        // Assert: mutation returned a group with no errors
        var joinGroup = result.RootElement.GetProperty("data").GetProperty("joinGroup");
        var groupNode = joinGroup.GetProperty("group");
        Assert.That(groupNode.ValueKind, Is.Not.EqualTo(JsonValueKind.Null),
            "Expected group to be returned after joining");

        var errorsNode = joinGroup.GetProperty("errors");
        Assert.That(
            errorsNode.ValueKind == JsonValueKind.Null || errorsNode.GetArrayLength() == 0,
            Is.True, "Expected no errors after joining with a valid invite code");

        // Assert: joiner is now stored as a group member in the database
        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        var isMember = await verifyDb.UserGroups
            .AnyAsync(ug => ug.UserId == joinerId && ug.GroupId == groupId);
        Assert.That(isMember, Is.True, "Expected the joiner to be recorded as a group member");
    }

    [Test]
    public async Task RecentActivity_AfterJoinAndTrophyAward_ShouldReturnNewestFirstWithCorrectTypes()
    {
        // Arrange
        const string adminId = "user_activity_admin_001";
        const string joinerId = "user_activity_joiner_001";
        const string inviteCode = "ACTCD001";

        int groupId;
        int gameId;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId, "Activity", "Admin");
            await TestDataBuilder.CreateUserAsync(db, joinerId, "Activity", "Joiner");
            var group = await TestDataBuilder.CreateGroupAsync(db, adminId, "Activity Group");
            groupId = group.Id;
            await TestDataBuilder.CreateGroupInviteAsync(db, group.Id, inviteCode);
            var game = await TestDataBuilder.CreateGameAsync(db, group.Id, "Slack Replies", "💬");
            gameId = game.Id;
        }

        const string joinMutation = """
            mutation JoinGroup($input: JoinGroupInput!) {
              joinGroup(input: $input) { group { id } }
            }
            """;
        using (var joinResult = await GraphQLHelpers.ExecuteAsync(
            _client, joinerId, joinMutation, new { input = new { inviteCode } }))
        {
            // sanity check
            var groupNode = joinResult.RootElement.GetProperty("data").GetProperty("joinGroup").GetProperty("group");
            Assert.That(groupNode.ValueKind, Is.Not.EqualTo(JsonValueKind.Null));
        }

        string relayAdminId;
        string relayJoinerId;
        string relayGameId;
        string relayGroupId;
        using (var idScope = _factory.CreateDbScope())
        {
            var serializer = idScope.ServiceProvider.GetRequiredService<INodeIdSerializer>();
            relayAdminId = serializer.Format("User", adminId);
            relayJoinerId = serializer.Format("User", joinerId);
            relayGameId = serializer.Format("Game", gameId);
            relayGroupId = serializer.Format("Group", groupId);
        }

        const string awardMutation = """
            mutation AwardTrophy($input: CreateTrophyRequestInput!) {
              createTrophyRequest(input: $input) { trophy { id } }
            }
            """;
        using (var awardResult = await GraphQLHelpers.ExecuteAsync(
            _client, adminId, awardMutation,
            new { input = new { userId = relayJoinerId, gameId = relayGameId, description = "wittiest reply" } }))
        {
            var trophyNode = awardResult.RootElement.GetProperty("data").GetProperty("createTrophyRequest").GetProperty("trophy");
            Assert.That(trophyNode.ValueKind, Is.Not.EqualTo(JsonValueKind.Null));
        }

        const string activityQuery = """
            query GroupActivity($id: ID!) {
              groupById(id: $id) {
                recentActivity(first: 10) {
                  __typename
                  id
                  occurredAt
                  ... on TrophyAwardedActivity {
                    trophy {
                      id
                      description
                      receiver { id displayName }
                      awardedBy { id displayName }
                      game { id name }
                    }
                  }
                  ... on MemberJoinedActivity {
                    member { id displayName }
                  }
                }
              }
            }
            """;

        // Act
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, adminId, activityQuery, new { id = relayGroupId });

        // Assert
        var activity = result.RootElement
            .GetProperty("data")
            .GetProperty("groupById")
            .GetProperty("recentActivity");

        Assert.That(activity.ValueKind, Is.EqualTo(JsonValueKind.Array));
        Assert.That(activity.GetArrayLength(), Is.EqualTo(3),
            "Expected 3 activity entries: 1 trophy + 2 member joins (admin and joiner)");

        // Newest first — trophy was awarded last
        Assert.That(activity[0].GetProperty("__typename").GetString(), Is.EqualTo("TrophyAwardedActivity"));
        var trophy = activity[0].GetProperty("trophy");
        Assert.That(trophy.GetProperty("description").GetString(), Is.EqualTo("wittiest reply"));
        Assert.That(trophy.GetProperty("receiver").GetProperty("displayName").GetString(), Is.EqualTo("Activity Joiner"));
        Assert.That(trophy.GetProperty("awardedBy").GetProperty("displayName").GetString(), Is.EqualTo("Activity Admin"));

        // Joiner joined just before the award
        Assert.That(activity[1].GetProperty("__typename").GetString(), Is.EqualTo("MemberJoinedActivity"));
        Assert.That(activity[1].GetProperty("member").GetProperty("id").GetString(), Is.EqualTo(relayJoinerId));

        // Admin was added when group was created
        Assert.That(activity[2].GetProperty("__typename").GetString(), Is.EqualTo("MemberJoinedActivity"));
        Assert.That(activity[2].GetProperty("member").GetProperty("id").GetString(), Is.EqualTo(relayAdminId));
    }

    [Test]
    public async Task UpdateGroup_AsAdmin_ShouldChangeNameAndDescription()
    {
        // Arrange
        const string adminId = "user_update_admin_001";
        int groupId;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId, "Update", "Admin");
            var group = await TestDataBuilder.CreateGroupAsync(db, adminId, "Original Name");
            groupId = group.Id;
        }

        string relayGroupId;
        using (var idScope = _factory.CreateDbScope())
        {
            var serializer = idScope.ServiceProvider.GetRequiredService<INodeIdSerializer>();
            relayGroupId = serializer.Format("Group", groupId);
        }

        const string mutation = """
            mutation UpdateGroup($input: UpdateGroupInput!) {
              updateGroup(input: $input) {
                group { id name description }
                errors { __typename ... on Error { message } }
              }
            }
            """;

        // Act
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, adminId, mutation,
            new { input = new { groupId = relayGroupId, name = "Renamed Group", description = "A new tagline." } });

        // Assert: response data is correct
        var updateGroup = result.RootElement.GetProperty("data").GetProperty("updateGroup");
        var errorsNode = updateGroup.GetProperty("errors");
        Assert.That(
            errorsNode.ValueKind == JsonValueKind.Null || errorsNode.GetArrayLength() == 0,
            Is.True, "Expected no errors after updating as admin");
        var groupNode = updateGroup.GetProperty("group");
        Assert.That(groupNode.GetProperty("name").GetString(), Is.EqualTo("Renamed Group"));
        Assert.That(groupNode.GetProperty("description").GetString(), Is.EqualTo("A new tagline."));

        // Assert: DB state matches
        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        var persisted = await verifyDb.Groups.SingleAsync(g => g.Id == groupId);
        Assert.That(persisted.Name, Is.EqualTo("Renamed Group"));
        Assert.That(persisted.Description, Is.EqualTo("A new tagline."));
    }

    [Test]
    public async Task UpdateGroup_AsNonAdmin_ShouldReturnNoAdminError()
    {
        // Arrange
        const string adminId = "user_update_admin_002";
        const string memberId = "user_update_member_002";
        int groupId;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId, "Update", "Admin");
            await TestDataBuilder.CreateUserAsync(db, memberId, "Update", "Member");
            var group = await TestDataBuilder.CreateGroupAsync(db, adminId, "Locked Group");
            groupId = group.Id;
            db.UserGroups.Add(new UserGroup
            {
                UserId = memberId,
                GroupId = group.Id,
                JoinedAt = DateTimeOffset.UtcNow,
            });
            await db.SaveChangesAsync();
        }

        string relayGroupId;
        using (var idScope = _factory.CreateDbScope())
        {
            var serializer = idScope.ServiceProvider.GetRequiredService<INodeIdSerializer>();
            relayGroupId = serializer.Format("Group", groupId);
        }

        const string mutation = """
            mutation UpdateGroup($input: UpdateGroupInput!) {
              updateGroup(input: $input) {
                group { id }
                errors { __typename ... on Error { message } }
              }
            }
            """;

        // Act
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, memberId, mutation,
            new { input = new { groupId = relayGroupId, name = "Hijacked", description = (string?)null } });

        // Assert
        var updateGroup = result.RootElement.GetProperty("data").GetProperty("updateGroup");
        Assert.That(updateGroup.GetProperty("group").ValueKind, Is.EqualTo(JsonValueKind.Null));
        var errors = updateGroup.GetProperty("errors");
        Assert.That(errors.GetArrayLength(), Is.EqualTo(1));
        Assert.That(errors[0].GetProperty("__typename").GetString(), Is.EqualTo("NoAdminError"));

        // Assert: DB state unchanged
        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        var persisted = await verifyDb.Groups.SingleAsync(g => g.Id == groupId);
        Assert.That(persisted.Name, Is.EqualTo("Locked Group"));
    }

    [Test]
    public async Task TransferGroupAdmin_AsAdmin_ShouldPromoteMemberAndKeepOldAdminAsMember()
    {
        // Arrange
        const string adminId = "user_transfer_admin_001";
        const string memberId = "user_transfer_member_001";
        int groupId;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId, "Transfer", "Admin");
            await TestDataBuilder.CreateUserAsync(db, memberId, "Transfer", "Member");
            var group = await TestDataBuilder.CreateGroupAsync(db, adminId, "Transferable Group");
            groupId = group.Id;
            db.UserGroups.Add(new UserGroup
            {
                UserId = memberId,
                GroupId = group.Id,
                JoinedAt = DateTimeOffset.UtcNow,
            });
            await db.SaveChangesAsync();
        }

        string relayGroupId;
        string relayMemberId;
        using (var idScope = _factory.CreateDbScope())
        {
            var serializer = idScope.ServiceProvider.GetRequiredService<INodeIdSerializer>();
            relayGroupId = serializer.Format("Group", groupId);
            relayMemberId = serializer.Format("User", memberId);
        }

        const string mutation = """
            mutation TransferAdmin($input: TransferGroupAdminInput!) {
              transferGroupAdmin(input: $input) {
                group { id admin { id displayName } }
                errors { __typename ... on Error { message } }
              }
            }
            """;

        // Act
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, adminId, mutation,
            new { input = new { groupId = relayGroupId, newAdminId = relayMemberId } });

        // Assert
        var transfer = result.RootElement.GetProperty("data").GetProperty("transferGroupAdmin");
        var errorsNode = transfer.GetProperty("errors");
        Assert.That(
            errorsNode.ValueKind == JsonValueKind.Null || errorsNode.GetArrayLength() == 0,
            Is.True, "Expected no errors when transferring as admin");
        var adminNode = transfer.GetProperty("group").GetProperty("admin");
        Assert.That(adminNode.GetProperty("id").GetString(), Is.EqualTo(relayMemberId));

        // Assert DB state: AdminId flipped, old admin still in UserGroups
        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        var persisted = await verifyDb.Groups.SingleAsync(g => g.Id == groupId);
        Assert.That(persisted.AdminId, Is.EqualTo(memberId));
        var oldAdminStillMember = await verifyDb.UserGroups
            .AnyAsync(ug => ug.GroupId == groupId && ug.UserId == adminId);
        Assert.That(oldAdminStillMember, Is.True, "Old admin should remain a regular member");
    }

    [Test]
    public async Task TransferGroupAdmin_ToNonMember_ShouldReturnNoMemberError()
    {
        // Arrange
        const string adminId = "user_transfer_admin_002";
        const string outsiderId = "user_transfer_outsider_002";
        int groupId;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId, "Transfer", "Admin");
            await TestDataBuilder.CreateUserAsync(db, outsiderId, "Transfer", "Outsider");
            var group = await TestDataBuilder.CreateGroupAsync(db, adminId, "Closed Group");
            groupId = group.Id;
        }

        string relayGroupId;
        string relayOutsiderId;
        using (var idScope = _factory.CreateDbScope())
        {
            var serializer = idScope.ServiceProvider.GetRequiredService<INodeIdSerializer>();
            relayGroupId = serializer.Format("Group", groupId);
            relayOutsiderId = serializer.Format("User", outsiderId);
        }

        const string mutation = """
            mutation TransferAdmin($input: TransferGroupAdminInput!) {
              transferGroupAdmin(input: $input) {
                group { id }
                errors { __typename ... on Error { message } }
              }
            }
            """;

        // Act
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, adminId, mutation,
            new { input = new { groupId = relayGroupId, newAdminId = relayOutsiderId } });

        // Assert
        var transfer = result.RootElement.GetProperty("data").GetProperty("transferGroupAdmin");
        Assert.That(transfer.GetProperty("group").ValueKind, Is.EqualTo(JsonValueKind.Null));
        var errors = transfer.GetProperty("errors");
        Assert.That(errors.GetArrayLength(), Is.EqualTo(1));
        Assert.That(errors[0].GetProperty("__typename").GetString(), Is.EqualTo("NoMemberError"));
    }

    [Test]
    public async Task TransferGroupAdmin_ToSelf_ShouldReturnCannotTransferToSelfError()
    {
        // Arrange
        const string adminId = "user_transfer_admin_003";
        int groupId;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId, "Transfer", "Self");
            var group = await TestDataBuilder.CreateGroupAsync(db, adminId, "Solo Group");
            groupId = group.Id;
        }

        string relayGroupId;
        string relayAdminId;
        using (var idScope = _factory.CreateDbScope())
        {
            var serializer = idScope.ServiceProvider.GetRequiredService<INodeIdSerializer>();
            relayGroupId = serializer.Format("Group", groupId);
            relayAdminId = serializer.Format("User", adminId);
        }

        const string mutation = """
            mutation TransferAdmin($input: TransferGroupAdminInput!) {
              transferGroupAdmin(input: $input) {
                group { id }
                errors { __typename ... on Error { message } }
              }
            }
            """;

        // Act
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, adminId, mutation,
            new { input = new { groupId = relayGroupId, newAdminId = relayAdminId } });

        // Assert
        var transfer = result.RootElement.GetProperty("data").GetProperty("transferGroupAdmin");
        var errors = transfer.GetProperty("errors");
        Assert.That(errors.GetArrayLength(), Is.EqualTo(1));
        Assert.That(errors[0].GetProperty("__typename").GetString(), Is.EqualTo("CannotTransferToSelfError"));
    }

    [Test]
    public async Task DeleteGroup_AsAdmin_ShouldCascadeAllChildren()
    {
        // Arrange: build a group with a game, an invite, a second member, plus a trophy via CreateTrophyRequest
        const string adminId = "user_delete_admin_001";
        const string joinerId = "user_delete_joiner_001";
        const string inviteCode = "DELCD001";

        int groupId;
        int gameId;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId, "Delete", "Admin");
            await TestDataBuilder.CreateUserAsync(db, joinerId, "Delete", "Joiner");
            var group = await TestDataBuilder.CreateGroupAsync(db, adminId, "Doomed Group");
            groupId = group.Id;
            await TestDataBuilder.CreateGroupInviteAsync(db, group.Id, inviteCode);
            var game = await TestDataBuilder.CreateGameAsync(db, group.Id, "Best Joke", "🃏");
            gameId = game.Id;
            db.UserGroups.Add(new UserGroup
            {
                UserId = joinerId,
                GroupId = group.Id,
                JoinedAt = DateTimeOffset.UtcNow,
            });
            await db.SaveChangesAsync();
        }

        string relayGroupId;
        string relayJoinerId;
        string relayGameId;
        using (var idScope = _factory.CreateDbScope())
        {
            var serializer = idScope.ServiceProvider.GetRequiredService<INodeIdSerializer>();
            relayGroupId = serializer.Format("Group", groupId);
            relayJoinerId = serializer.Format("User", joinerId);
            relayGameId = serializer.Format("Game", gameId);
        }

        const string awardMutation = """
            mutation AwardTrophy($input: CreateTrophyRequestInput!) {
              createTrophyRequest(input: $input) { trophy { id } }
            }
            """;
        using (var awardResult = await GraphQLHelpers.ExecuteAsync(
            _client, adminId, awardMutation,
            new { input = new { userId = relayJoinerId, gameId = relayGameId, description = "punchiest line" } }))
        {
            var trophyNode = awardResult.RootElement
                .GetProperty("data").GetProperty("createTrophyRequest").GetProperty("trophy");
            Assert.That(trophyNode.ValueKind, Is.Not.EqualTo(JsonValueKind.Null));
        }

        const string mutation = """
            mutation DeleteGroup($input: DeleteGroupInput!) {
              deleteGroup(input: $input) {
                deletedGroupPayload { deletedId }
                errors { __typename ... on Error { message } }
              }
            }
            """;

        // Act
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, adminId, mutation,
            new { input = new { groupId = relayGroupId, confirmName = "Doomed Group" } });

        // Assert: response
        var delete = result.RootElement.GetProperty("data").GetProperty("deleteGroup");
        var errorsNode = delete.GetProperty("errors");
        Assert.That(
            errorsNode.ValueKind == JsonValueKind.Null || errorsNode.GetArrayLength() == 0,
            Is.True, "Expected no errors when deleting as admin");
        Assert.That(
            delete.GetProperty("deletedGroupPayload").GetProperty("deletedId").GetString(),
            Is.EqualTo(relayGroupId));

        // Assert: cascade — nothing remains for this group; users untouched
        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();

        Assert.That(await verifyDb.Groups.AnyAsync(g => g.Id == groupId), Is.False, "Group row should be gone");
        Assert.That(await verifyDb.Games.AnyAsync(g => g.ParentGroupId == groupId), Is.False, "Games should be gone");
        Assert.That(await verifyDb.Trophies.AnyAsync(t => t.Game.ParentGroupId == groupId), Is.False, "Trophies should be gone");
        Assert.That(await verifyDb.TrophyRequests.AnyAsync(r => r.Trophy.Game.ParentGroupId == groupId), Is.False, "Trophy requests should be gone");
        Assert.That(await verifyDb.TrophyRequestApprovals.AnyAsync(a => a.Request.Trophy.Game.ParentGroupId == groupId), Is.False, "Approvals should be gone");
        Assert.That(await verifyDb.GroupInvites.AnyAsync(i => i.GroupId == groupId), Is.False, "Invites should be gone");
        Assert.That(await verifyDb.UserGroups.AnyAsync(ug => ug.GroupId == groupId), Is.False, "Memberships should be gone");
        Assert.That(await verifyDb.Users.CountAsync(), Is.EqualTo(2), "Users should remain untouched");
    }

    [Test]
    public async Task DeleteGroup_WithWrongConfirmName_ShouldReturnGroupNameMismatchError()
    {
        // Arrange
        const string adminId = "user_delete_admin_002";
        int groupId;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId, "Delete", "Admin");
            var group = await TestDataBuilder.CreateGroupAsync(db, adminId, "Protected Group");
            groupId = group.Id;
        }

        string relayGroupId;
        using (var idScope = _factory.CreateDbScope())
        {
            var serializer = idScope.ServiceProvider.GetRequiredService<INodeIdSerializer>();
            relayGroupId = serializer.Format("Group", groupId);
        }

        const string mutation = """
            mutation DeleteGroup($input: DeleteGroupInput!) {
              deleteGroup(input: $input) {
                deletedGroupPayload { deletedId }
                errors { __typename ... on Error { message } }
              }
            }
            """;

        // Act
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, adminId, mutation,
            new { input = new { groupId = relayGroupId, confirmName = "wrong name" } });

        // Assert
        var delete = result.RootElement.GetProperty("data").GetProperty("deleteGroup");
        Assert.That(delete.GetProperty("deletedGroupPayload").ValueKind, Is.EqualTo(JsonValueKind.Null));
        var errors = delete.GetProperty("errors");
        Assert.That(errors.GetArrayLength(), Is.EqualTo(1));
        Assert.That(errors[0].GetProperty("__typename").GetString(), Is.EqualTo("GroupNameMismatchError"));

        // DB state unchanged
        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        Assert.That(await verifyDb.Groups.AnyAsync(g => g.Id == groupId), Is.True);
    }

    [Test]
    public async Task DeleteGroup_AsNonAdmin_ShouldReturnNoAdminError()
    {
        // Arrange
        const string adminId = "user_delete_admin_003";
        const string memberId = "user_delete_member_003";
        int groupId;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId, "Delete", "Admin");
            await TestDataBuilder.CreateUserAsync(db, memberId, "Delete", "Member");
            var group = await TestDataBuilder.CreateGroupAsync(db, adminId, "Cannot Touch This");
            groupId = group.Id;
            db.UserGroups.Add(new UserGroup
            {
                UserId = memberId,
                GroupId = group.Id,
                JoinedAt = DateTimeOffset.UtcNow,
            });
            await db.SaveChangesAsync();
        }

        string relayGroupId;
        using (var idScope = _factory.CreateDbScope())
        {
            var serializer = idScope.ServiceProvider.GetRequiredService<INodeIdSerializer>();
            relayGroupId = serializer.Format("Group", groupId);
        }

        const string mutation = """
            mutation DeleteGroup($input: DeleteGroupInput!) {
              deleteGroup(input: $input) {
                deletedGroupPayload { deletedId }
                errors { __typename ... on Error { message } }
              }
            }
            """;

        // Act
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, memberId, mutation,
            new { input = new { groupId = relayGroupId, confirmName = "Cannot Touch This" } });

        // Assert
        var delete = result.RootElement.GetProperty("data").GetProperty("deleteGroup");
        var errors = delete.GetProperty("errors");
        Assert.That(errors.GetArrayLength(), Is.EqualTo(1));
        Assert.That(errors[0].GetProperty("__typename").GetString(), Is.EqualTo("NoAdminError"));

        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        Assert.That(await verifyDb.Groups.AnyAsync(g => g.Id == groupId), Is.True);
    }

    [Test]
    public async Task GetGroupById_WhenUserIsNotMember_ShouldReturnAuthorizationError()
    {
        // Arrange
        const string adminId = "user_group_admin_002";
        const string nonMemberId = "user_group_nonmember_002";

        Group group;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId, "Admin", "Two");
            await TestDataBuilder.CreateUserAsync(db, nonMemberId, "NonMember", "Two");
            group = await TestDataBuilder.CreateGroupAsync(db, adminId, "Members Only Group");
        }

        string relayGroupId;
        using (var idScope = _factory.CreateDbScope())
        {
            var serializer = idScope.ServiceProvider.GetRequiredService<INodeIdSerializer>();
            relayGroupId = serializer.Format("Group", group.Id);
        }

        const string query = """
            query GetGroup($id: ID!) {
              groupById(id: $id) {
                id
                name
              }
            }
            """;

        // Act
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, nonMemberId, query, new { id = relayGroupId });

        // Assert: the non-member receives an authorization error and no group data
        Assert.That(
            result.RootElement.TryGetProperty("errors", out var errors) && errors.GetArrayLength() > 0,
            Is.True, "Expected GraphQL errors for an unauthorized group access");

        var groupData = result.RootElement.GetProperty("data").GetProperty("groupById");
        Assert.That(groupData.ValueKind, Is.EqualTo(JsonValueKind.Null),
            "Expected groupById to be null for a non-member");
    }
}
