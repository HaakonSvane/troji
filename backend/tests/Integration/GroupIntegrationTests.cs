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
