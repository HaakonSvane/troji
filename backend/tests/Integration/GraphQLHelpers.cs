using System.Net.Http.Json;
using System.Text.Json;

namespace tests.Integration;

public static class GraphQLHelpers
{
    public static async Task<JsonDocument> ExecuteAsync(
        HttpClient client,
        string userId,
        string query,
        object? variables = null)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "/graphql");
        request.Headers.Add("X-Test-User-Id", userId);
        request.Content = JsonContent.Create(new { query, variables });

        var response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        return JsonDocument.Parse(content);
    }
}
