using System.Text.Json;
using api.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace tests.Integration;

[TestFixture]
[Category("Integration")]
public class UserIntegrationTests
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

    private const string UpdateDisplayNameMutation = """
        mutation UpdateDisplayName($input: UpdateUserDisplayNameInput!) {
          updateUserDisplayName(input: $input) {
            user { id displayName profile { firstName middleName lastName } }
            errors {
              __typename
              ... on Error { message }
            }
          }
        }
        """;

    private const string UpdateProfileMutation = """
        mutation UpdateProfile($input: UpdateUserProfileInput!) {
          updateUserProfile(input: $input) {
            user { id displayName profile { firstName middleName lastName } }
            errors {
              __typename
              ... on Error { message }
            }
          }
        }
        """;

    [Test]
    public async Task UpdateUserDisplayName_WithValidInput_ShouldUpdateAndPersist()
    {
        const string userId = "user_dn_001";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId, displayName: "Original Name");
        }

        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, userId, UpdateDisplayNameMutation,
            new { input = new { displayName = "NewHandle" } });

        var payload = result.RootElement.GetProperty("data").GetProperty("updateUserDisplayName");

        var errors = payload.GetProperty("errors");
        Assert.That(
            errors.ValueKind == JsonValueKind.Null || errors.GetArrayLength() == 0,
            Is.True, "Expected no errors for a valid display-name update");

        var user = payload.GetProperty("user");
        Assert.That(user.GetProperty("displayName").GetString(), Is.EqualTo("NewHandle"));

        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        var stored = await verifyDb.Users.SingleAsync(u => u.Id == userId);
        Assert.That(stored.DisplayName, Is.EqualTo("NewHandle"));
    }

    [Test]
    public async Task UpdateUserDisplayName_WithEmptyName_ShouldReturnInvalidDisplayNameError()
    {
        const string userId = "user_dn_002";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId, displayName: "Original");
        }

        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, userId, UpdateDisplayNameMutation,
            new { input = new { displayName = "   " } });

        var payload = result.RootElement.GetProperty("data").GetProperty("updateUserDisplayName");

        Assert.That(payload.GetProperty("user").ValueKind, Is.EqualTo(JsonValueKind.Null));

        var errors = payload.GetProperty("errors");
        Assert.That(errors.GetArrayLength(), Is.GreaterThan(0));
        Assert.That(errors[0].GetProperty("__typename").GetString(), Is.EqualTo("InvalidDisplayNameError"));

        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        var stored = await verifyDb.Users.SingleAsync(u => u.Id == userId);
        Assert.That(stored.DisplayName, Is.EqualTo("Original"), "Row should be unchanged on validation failure");
    }

    [Test]
    public async Task UpdateUserDisplayName_WhenUserNotRegistered_ShouldReturnNoUserError()
    {
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, "user_dn_ghost", UpdateDisplayNameMutation,
            new { input = new { displayName = "Ghost" } });

        var payload = result.RootElement.GetProperty("data").GetProperty("updateUserDisplayName");

        Assert.That(payload.GetProperty("user").ValueKind, Is.EqualTo(JsonValueKind.Null));
        var errors = payload.GetProperty("errors");
        Assert.That(errors.GetArrayLength(), Is.GreaterThan(0));
        Assert.That(errors[0].GetProperty("__typename").GetString(), Is.EqualTo("NoUserError"));
    }

    [Test]
    public async Task UpdateUserProfile_WithValidInput_ShouldUpdateAndPersistAndExposeProfile()
    {
        const string userId = "user_pr_001";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId, firstName: "Old", lastName: "Name");
        }

        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, userId, UpdateProfileMutation,
            new { input = new { firstName = "New", middleName = "Q", lastName = "Surname" } });

        var payload = result.RootElement.GetProperty("data").GetProperty("updateUserProfile");
        var errors = payload.GetProperty("errors");
        Assert.That(
            errors.ValueKind == JsonValueKind.Null || errors.GetArrayLength() == 0,
            Is.True, "Expected no errors for a valid profile update");

        var profile = payload.GetProperty("user").GetProperty("profile");
        Assert.That(profile.GetProperty("firstName").GetString(), Is.EqualTo("New"));
        Assert.That(profile.GetProperty("middleName").GetString(), Is.EqualTo("Q"));
        Assert.That(profile.GetProperty("lastName").GetString(), Is.EqualTo("Surname"));

        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        var stored = await verifyDb.Users.SingleAsync(u => u.Id == userId);
        Assert.That(stored.FirstName, Is.EqualTo("New"));
        Assert.That(stored.MiddleName, Is.EqualTo("Q"));
        Assert.That(stored.LastName, Is.EqualTo("Surname"));
    }

    [Test]
    public async Task UpdateUserProfile_WithBlankFirstName_ShouldReturnInvalidUserNameError()
    {
        const string userId = "user_pr_002";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId, firstName: "Keep", lastName: "Me");
        }

        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, userId, UpdateProfileMutation,
            new { input = new { firstName = "   ", middleName = (string?)null, lastName = "Me" } });

        var payload = result.RootElement.GetProperty("data").GetProperty("updateUserProfile");
        Assert.That(payload.GetProperty("user").ValueKind, Is.EqualTo(JsonValueKind.Null));
        var errors = payload.GetProperty("errors");
        Assert.That(errors.GetArrayLength(), Is.GreaterThan(0));
        Assert.That(errors[0].GetProperty("__typename").GetString(), Is.EqualTo("InvalidUserNameError"));

        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        var stored = await verifyDb.Users.SingleAsync(u => u.Id == userId);
        Assert.That(stored.FirstName, Is.EqualTo("Keep"));
    }

    [Test]
    public async Task UpdateUserProfile_WhenUserNotRegistered_ShouldReturnNoUserError()
    {
        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, "user_pr_ghost", UpdateProfileMutation,
            new { input = new { firstName = "Ghost", middleName = (string?)null, lastName = "User" } });

        var payload = result.RootElement.GetProperty("data").GetProperty("updateUserProfile");
        Assert.That(payload.GetProperty("user").ValueKind, Is.EqualTo(JsonValueKind.Null));
        var errors = payload.GetProperty("errors");
        Assert.That(errors.GetArrayLength(), Is.GreaterThan(0));
        Assert.That(errors[0].GetProperty("__typename").GetString(), Is.EqualTo("NoUserError"));
    }

    [Test]
    public async Task Me_ReturnsDisplayNameAndProfile()
    {
        const string userId = "user_me_001";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId, firstName: "Solo", lastName: "Player", displayName: "solomon");
        }

        const string query = """
            query Me {
              me {
                id
                displayName
                profile { firstName middleName lastName }
              }
            }
            """;

        using var result = await GraphQLHelpers.ExecuteAsync(_client, userId, query);

        var me = result.RootElement.GetProperty("data").GetProperty("me");
        Assert.That(me.GetProperty("displayName").GetString(), Is.EqualTo("solomon"));

        var profile = me.GetProperty("profile");
        Assert.That(profile.GetProperty("firstName").GetString(), Is.EqualTo("Solo"));
        Assert.That(profile.GetProperty("lastName").GetString(), Is.EqualTo("Player"));
        Assert.That(profile.GetProperty("middleName").ValueKind, Is.EqualTo(JsonValueKind.Null));
    }
}
