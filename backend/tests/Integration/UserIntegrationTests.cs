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

    private const string UpdateUserMutation = """
        mutation UpdateUser($input: UpdateUserInput!) {
          updateUser(input: $input) {
            user { id firstName middleName lastName }
            errors {
              __typename
              ... on Error { message }
            }
          }
        }
        """;

    [Test]
    public async Task UpdateUser_WithValidInput_ShouldUpdateNameAndPersistToDatabase()
    {
        const string userId = "user_update_001";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId, "Old", "Name");
        }

        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, userId, UpdateUserMutation,
            new { input = new { firstName = "New", middleName = "Q", lastName = "Surname" } });

        var updateUser = result.RootElement.GetProperty("data").GetProperty("updateUser");

        var errors = updateUser.GetProperty("errors");
        Assert.That(
            errors.ValueKind == JsonValueKind.Null || errors.GetArrayLength() == 0,
            Is.True, "Expected no errors for a valid update");

        var user = updateUser.GetProperty("user");
        Assert.That(user.ValueKind, Is.Not.EqualTo(JsonValueKind.Null));
        Assert.That(user.GetProperty("firstName").GetString(), Is.EqualTo("New"));
        Assert.That(user.GetProperty("middleName").GetString(), Is.EqualTo("Q"));
        Assert.That(user.GetProperty("lastName").GetString(), Is.EqualTo("Surname"));

        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        var stored = await verifyDb.Users.SingleAsync(u => u.Id == userId);
        Assert.That(stored.FirstName, Is.EqualTo("New"));
        Assert.That(stored.MiddleName, Is.EqualTo("Q"));
        Assert.That(stored.LastName, Is.EqualTo("Surname"));
    }

    [Test]
    public async Task UpdateUser_WithBlankFirstName_ShouldReturnInvalidUserNameError()
    {
        const string userId = "user_update_002";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId, "Original", "Person");
        }

        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, userId, UpdateUserMutation,
            new { input = new { firstName = "   ", middleName = (string?)null, lastName = "Person" } });

        var updateUser = result.RootElement.GetProperty("data").GetProperty("updateUser");

        Assert.That(updateUser.GetProperty("user").ValueKind, Is.EqualTo(JsonValueKind.Null),
            "Expected no user payload when the input is invalid");

        var errors = updateUser.GetProperty("errors");
        Assert.That(errors.ValueKind, Is.Not.EqualTo(JsonValueKind.Null));
        Assert.That(errors.GetArrayLength(), Is.GreaterThan(0));
        Assert.That(errors[0].GetProperty("__typename").GetString(), Is.EqualTo("InvalidUserNameError"));

        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        var stored = await verifyDb.Users.SingleAsync(u => u.Id == userId);
        Assert.That(stored.FirstName, Is.EqualTo("Original"), "Row should be unchanged on validation failure");
    }

    [Test]
    public async Task UpdateUser_WhenUserNotRegistered_ShouldReturnNoUserError()
    {
        const string unregisteredUserId = "user_update_unregistered";

        using var result = await GraphQLHelpers.ExecuteAsync(
            _client, unregisteredUserId, UpdateUserMutation,
            new { input = new { firstName = "Ghost", middleName = (string?)null, lastName = "User" } });

        var updateUser = result.RootElement.GetProperty("data").GetProperty("updateUser");

        Assert.That(updateUser.GetProperty("user").ValueKind, Is.EqualTo(JsonValueKind.Null));

        var errors = updateUser.GetProperty("errors");
        Assert.That(errors.ValueKind, Is.Not.EqualTo(JsonValueKind.Null));
        Assert.That(errors.GetArrayLength(), Is.GreaterThan(0));
        Assert.That(errors[0].GetProperty("__typename").GetString(), Is.EqualTo("NoUserError"));
    }
}
