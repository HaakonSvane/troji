using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace api.Transport;

public class FakeAuthHandlerOptions : AuthenticationSchemeOptions
{
}

public class FakeAuthHandler : AuthenticationHandler<FakeAuthHandlerOptions>
{
    public const string AuthenticationScheme = "DEV";

    public FakeAuthHandler(IOptionsMonitor<FakeAuthHandlerOptions> options, ILoggerFactory logger, UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        // Allow per-request user ID override via header (used in integration tests).
        var headerValue = Context.Request.Headers.TryGetValue("X-Test-User-Id", out var headerValues)
            ? headerValues.FirstOrDefault()
            : null;
        var userId = string.IsNullOrWhiteSpace(headerValue) ? "user_devlocalfakeuser001" : headerValue;

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId),
            new(ClaimTypes.Name, "Developer Dude"),
            new(ClaimTypes.Email, "dev@trophydev.com"),
            new(ClaimTypes.Role, "Admin")
        };
        var identity = new ClaimsIdentity(claims, AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, AuthenticationScheme);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
