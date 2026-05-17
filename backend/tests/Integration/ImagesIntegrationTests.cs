using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using api.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SkiaSharp;

namespace tests.Integration;

[TestFixture]
[Category("Integration")]
public class ImagesIntegrationTests
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

    private static byte[] CreatePngBytes(int width = 200, int height = 200)
    {
        using var bitmap = new SKBitmap(width, height);
        using (var canvas = new SKCanvas(bitmap))
        {
            canvas.Clear(SKColors.Crimson);
        }
        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(SKEncodedImageFormat.Png, 100);
        return data.ToArray();
    }

    private static async Task<HttpResponseMessage> PostMultipartAsync(
        HttpClient client, string path, string userId, byte[] bytes, string fileName, string contentType)
    {
        using var content = new MultipartFormDataContent();
        var fileContent = new ByteArrayContent(bytes);
        fileContent.Headers.ContentType = MediaTypeHeaderValue.Parse(contentType);
        content.Add(fileContent, "file", fileName);

        using var request = new HttpRequestMessage(HttpMethod.Post, path)
        {
            Content = content
        };
        request.Headers.Add("X-Test-User-Id", userId);
        return await client.SendAsync(request);
    }

    [Test]
    public async Task UploadAvatar_WithValidPng_ShouldStoreVariantsAndSetImageId()
    {
        const string userId = "user_img_001";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId);
        }

        using var response = await PostMultipartAsync(
            _client, "/api/images/avatar", userId, CreatePngBytes(), "avatar.png", "image/png");

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        using var doc = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        var imageId = doc.RootElement.GetProperty("imageId").GetString()!;
        Assert.That(imageId, Does.Match("^[0-9a-f]{32}$"));

        var dir = Path.Combine(_factory.ImageStorageRoot, "users", imageId[..2], imageId[2..]);
        Assert.That(File.Exists(Path.Combine(dir, "64.webp")), Is.True);
        Assert.That(File.Exists(Path.Combine(dir, "128.webp")), Is.True);
        Assert.That(File.Exists(Path.Combine(dir, "256.webp")), Is.True);

        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        var stored = await verifyDb.Users.SingleAsync(u => u.Id == userId);
        Assert.That(stored.ImageId, Is.EqualTo(imageId));
    }

    [Test]
    public async Task UploadAvatar_WithUnregisteredUser_ShouldReturnNotFound()
    {
        using var response = await PostMultipartAsync(
            _client, "/api/images/avatar", "user_img_ghost", CreatePngBytes(), "x.png", "image/png");

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
    }

    [Test]
    public async Task UploadAvatar_WithCorruptPayload_ShouldReturnBadRequest()
    {
        const string userId = "user_img_002";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId);
        }

        using var response = await PostMultipartAsync(
            _client, "/api/images/avatar", userId,
            "this is plain text, not an image"u8.ToArray(),
            "fake.png", "image/png");

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
    }

    [Test]
    public async Task UploadAvatar_Replacing_ShouldDeleteOldVariants()
    {
        const string userId = "user_img_003";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId);
        }

        using var first = await PostMultipartAsync(
            _client, "/api/images/avatar", userId, CreatePngBytes(), "a.png", "image/png");
        using var firstDoc = JsonDocument.Parse(await first.Content.ReadAsStringAsync());
        var firstId = firstDoc.RootElement.GetProperty("imageId").GetString()!;
        var firstDir = Path.Combine(_factory.ImageStorageRoot, "users", firstId[..2], firstId[2..]);

        using var second = await PostMultipartAsync(
            _client, "/api/images/avatar", userId, CreatePngBytes(), "b.png", "image/png");
        Assert.That(second.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        Assert.That(File.Exists(Path.Combine(firstDir, "64.webp")), Is.False);
        Assert.That(File.Exists(Path.Combine(firstDir, "128.webp")), Is.False);
        Assert.That(File.Exists(Path.Combine(firstDir, "256.webp")), Is.False);
    }

    [Test]
    public async Task UploadGroupImage_WhenNotAdmin_ShouldReturnForbidden()
    {
        const string adminId = "user_grp_admin_001";
        const string otherId = "user_grp_member_001";
        int groupId;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId);
            await TestDataBuilder.CreateUserAsync(db, otherId);
            var group = await TestDataBuilder.CreateGroupAsync(db, adminId);
            groupId = group.Id;
        }

        using var response = await PostMultipartAsync(
            _client, $"/api/images/group/{groupId}", otherId, CreatePngBytes(), "g.png", "image/png");

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.Forbidden));
    }

    [Test]
    public async Task UploadGroupImage_AsAdmin_ShouldStoreAndPersist()
    {
        const string adminId = "user_grp_admin_002";
        int groupId;
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, adminId);
            var group = await TestDataBuilder.CreateGroupAsync(db, adminId);
            groupId = group.Id;
        }

        using var response = await PostMultipartAsync(
            _client, $"/api/images/group/{groupId}", adminId, CreatePngBytes(), "g.png", "image/png");

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        using var verifyScope = _factory.CreateDbScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        var stored = await verifyDb.Groups.SingleAsync(g => g.Id == groupId);
        Assert.That(stored.ImageId, Is.Not.Null);
    }

    [Test]
    public async Task SignedUrlRoundTrip_ShouldServeWebp()
    {
        const string userId = "user_img_sig_001";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId);
        }

        using var upload = await PostMultipartAsync(
            _client, "/api/images/avatar", userId, CreatePngBytes(), "a.png", "image/png");
        using var uploadDoc = JsonDocument.Parse(await upload.Content.ReadAsStringAsync());
        var imageId = uploadDoc.RootElement.GetProperty("imageId").GetString()!;

        const string query = """
            query Me { me { avatarUrl(size: 64) } }
            """;
        using var graphqlResult = await GraphQLHelpers.ExecuteAsync(_client, userId, query);
        var avatarUrl = graphqlResult.RootElement
            .GetProperty("data").GetProperty("me").GetProperty("avatarUrl").GetString()!;
        Assert.That(avatarUrl, Does.StartWith($"/api/images/users/{imageId}/64"));

        using var imgRequest = new HttpRequestMessage(HttpMethod.Get, avatarUrl);
        using var imgResponse = await _client.SendAsync(imgRequest);
        Assert.That(imgResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));
        Assert.That(imgResponse.Content.Headers.ContentType?.MediaType, Is.EqualTo("image/webp"));
    }

    [Test]
    public async Task SignedUrl_WithBadSignature_ShouldReturnForbidden()
    {
        const string userId = "user_img_sig_002";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId);
        }

        using var upload = await PostMultipartAsync(
            _client, "/api/images/avatar", userId, CreatePngBytes(), "a.png", "image/png");
        using var uploadDoc = JsonDocument.Parse(await upload.Content.ReadAsStringAsync());
        var imageId = uploadDoc.RootElement.GetProperty("imageId").GetString()!;

        var url = $"/api/images/users/{imageId}/64?exp={DateTimeOffset.UtcNow.AddMinutes(5).ToUnixTimeSeconds()}&sig=AAAAAAAA";
        using var response = await _client.GetAsync(url);
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.Forbidden));
    }

    [Test]
    public async Task SignedUrl_WithoutSignature_ShouldReturnBadRequest()
    {
        const string userId = "user_img_sig_003";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId);
        }

        using var upload = await PostMultipartAsync(
            _client, "/api/images/avatar", userId, CreatePngBytes(), "a.png", "image/png");
        using var uploadDoc = JsonDocument.Parse(await upload.Content.ReadAsStringAsync());
        var imageId = uploadDoc.RootElement.GetProperty("imageId").GetString()!;

        using var response = await _client.GetAsync($"/api/images/users/{imageId}/64");
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.BadRequest));
    }

    [Test]
    public async Task SignedUrl_WithInvalidSize_ShouldReturnNotFound()
    {
        const string userId = "user_img_sig_004";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId);
        }

        using var upload = await PostMultipartAsync(
            _client, "/api/images/avatar", userId, CreatePngBytes(), "a.png", "image/png");
        using var uploadDoc = JsonDocument.Parse(await upload.Content.ReadAsStringAsync());
        var imageId = uploadDoc.RootElement.GetProperty("imageId").GetString()!;

        var url = $"/api/images/users/{imageId}/999?exp={DateTimeOffset.UtcNow.AddMinutes(5).ToUnixTimeSeconds()}&sig=AAAA";
        using var response = await _client.GetAsync(url);
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
    }

    [Test]
    public async Task ClearUserAvatar_ShouldRemoveImageIdAndFiles()
    {
        const string userId = "user_img_clear_001";
        using (var scope = _factory.CreateDbScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await TestDataBuilder.CreateUserAsync(db, userId);
        }

        using var upload = await PostMultipartAsync(
            _client, "/api/images/avatar", userId, CreatePngBytes(), "a.png", "image/png");
        using var uploadDoc = JsonDocument.Parse(await upload.Content.ReadAsStringAsync());
        var imageId = uploadDoc.RootElement.GetProperty("imageId").GetString()!;
        var dir = Path.Combine(_factory.ImageStorageRoot, "users", imageId[..2], imageId[2..]);

        const string mutation = """
            mutation { clearUserAvatar { user { id imageId } errors { __typename } } }
            """;
        using var result = await GraphQLHelpers.ExecuteAsync(_client, userId, mutation);

        var payload = result.RootElement.GetProperty("data").GetProperty("clearUserAvatar");
        var user = payload.GetProperty("user");
        Assert.That(user.GetProperty("imageId").ValueKind, Is.EqualTo(JsonValueKind.Null));

        Assert.That(File.Exists(Path.Combine(dir, "64.webp")), Is.False);
        Assert.That(File.Exists(Path.Combine(dir, "128.webp")), Is.False);
        Assert.That(File.Exists(Path.Combine(dir, "256.webp")), Is.False);
    }
}
