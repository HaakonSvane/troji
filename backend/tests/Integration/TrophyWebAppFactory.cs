using api;
using api.Database;
using api.Transport;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Testcontainers.PostgreSql;

namespace tests.Integration;

public sealed class TrophyWebAppFactory : WebApplicationFactory<Program>
{
    private readonly PostgreSqlContainer _postgres = new PostgreSqlBuilder()
        .WithDatabase("trophy_test")
        .WithUsername("test")
        .WithPassword("test")
        .Build();

    public async Task InitializeAsync()
    {
        await _postgres.StartAsync();
    }

    public override async ValueTask DisposeAsync()
    {
        await _postgres.DisposeAsync();
        await base.DisposeAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureTestServices(services =>
        {
            // Replace DbContext pool with a plain scoped DbContext pointing at the test container.
            services.RemoveAll<TrophyDbContext>();
            services.RemoveAll<DbContextOptions<TrophyDbContext>>();
            services.AddDbContext<TrophyDbContext>(options =>
                options.UseNpgsql(_postgres.GetConnectionString()));

            // Replace JWT auth with the in-process FakeAuthHandler.
            // PostConfigure runs after all Configure actions, guaranteeing the override wins.
            services.PostConfigure<AuthenticationOptions>(options =>
            {
                options.DefaultScheme = FakeAuthHandler.AuthenticationScheme;
                options.DefaultAuthenticateScheme = FakeAuthHandler.AuthenticationScheme;
                options.DefaultChallengeScheme = FakeAuthHandler.AuthenticationScheme;
                options.DefaultForbidScheme = FakeAuthHandler.AuthenticationScheme;
            });
            services.AddAuthentication()
                .AddScheme<FakeAuthHandlerOptions, FakeAuthHandler>(
                    FakeAuthHandler.AuthenticationScheme, _ => { });
        });
    }

    public async Task ApplyMigrationsAsync()
    {
        using var scope = Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
        await db.Database.MigrateAsync();
    }

    public IServiceScope CreateDbScope() => Services.CreateScope();
}
