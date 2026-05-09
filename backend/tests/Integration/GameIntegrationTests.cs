using System.Text.Json;
using api.Database;
using HotChocolate.Types.Relay;
using Microsoft.Extensions.DependencyInjection;

namespace tests.Integration;

[TestFixture]
[Category("Integration")]
public class GameIntegrationTests
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
    public async Task CreateGame_WithDuplicateEmoji_ShouldReturnDuplicateGameEmojiError()
    {
        // Arrange
        const string adminId = "user_game_admin_001";
        const string emoji = "🎮";

        int groupId;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId, "Admin", "Game");
            var group = await TestDataBuilder.CreateGroupAsync(db, adminId, "Gaming Group");
            groupId = group.Id;
            await TestDataBuilder.CreateGameAsync(db, group.Id, "Original Game", emoji);
        }

        string relayGroupId;
        using (var idScope = _factory.CreateDbScope())
        {
            var serializer = idScope.ServiceProvider.GetRequiredService<INodeIdSerializer>();
            relayGroupId = serializer.Format("Group", groupId);
        }

        const string mutation = """
            mutation CreateGame($input: CreateGameInput!) {
              createGame(input: $input) {
                game { id }
                errors { __typename }
              }
            }
            """;

        // Act
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, adminId, mutation,
            new { input = new { groupId = relayGroupId, name = "Duplicate Game", symbol = emoji } });

        // Assert: a DuplicateGameEmojiError is returned and no game was created
        var createGame = result.RootElement.GetProperty("data").GetProperty("createGame");

        var gameNode = createGame.GetProperty("game");
        Assert.That(gameNode.ValueKind, Is.EqualTo(JsonValueKind.Null),
            "Expected no game to be created when the emoji is already in use");

        var errors = createGame.GetProperty("errors");
        Assert.That(errors.ValueKind, Is.Not.EqualTo(JsonValueKind.Null));
        Assert.That(errors.GetArrayLength(), Is.GreaterThan(0), "Expected at least one error");

        var firstErrorTypeName = errors[0].GetProperty("__typename").GetString();
        Assert.That(firstErrorTypeName, Is.EqualTo("DuplicateGameEmojiError"),
            "Expected a DuplicateGameEmojiError when creating a game with a duplicate emoji");
    }
}
