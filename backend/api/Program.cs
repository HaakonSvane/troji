using System.Reflection;
using System.Security.Claims;
using api.Auth.Handlers;
using api.Auth.Requirements;
using api.Database;
using api.Images;
using api.Repository;
using api.Transport;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

namespace api;

public class Program
{
    public static async Task Main(string[] args)
    {
        var isSchemaExport = args.Length > 0 && args[0] == "schema";
        var isSeed = args.Length > 0 && args[0] == "seed";

        var builder = WebApplication.CreateBuilder(args);

        IConfiguration config = new ConfigurationBuilder()
            .SetBasePath(builder.Environment.ContentRootPath)
            .AddJsonFile("appsettings.json", true, true)
            .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", true)
            .AddUserSecrets(Assembly.GetExecutingAssembly(), true)
            .AddEnvironmentVariables()
            .Build();

        if (!isSchemaExport)
        {
            var connectionStringBuilder = new NpgsqlConnectionStringBuilder();
            connectionStringBuilder.Host = config["Database:Host"];
            var port = config.GetValue<int>("Database:Port");
            if (port > 0) connectionStringBuilder.Port = port;
            connectionStringBuilder.Username = config["Database:User"];
            connectionStringBuilder.Password = config["Database:Password"];

            builder.Services.AddDbContextPool<TrophyDbContext>(options =>
                options.UseNpgsql(connectionStringBuilder.ConnectionString));
        }
        else
        {
            // Schema export builds the DI container and validates repository dependencies.
            // Register a dummy DbContext so export works without requiring local DB env vars.
            builder.Services.AddDbContextPool<TrophyDbContext>(options =>
                options.UseNpgsql("Host=localhost;Port=5432;Database=schema_export;Username=none;Password=none"));
        }

        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                var origins = (config["Cors:Origins"] ?? "http://localhost:5173")
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                policy
                    .WithOrigins(origins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
        });

        builder.Services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Authority = config["Auth:Authority"];
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = false,
                    NameClaimType = ClaimTypes.NameIdentifier,
                };
            });

        builder.Services.AddAuthorization(cfg =>
            cfg.AddPolicy("IsGroupMember", policy => policy.Requirements.Add(new GroupMemberRequirement()))
        );

        if (!isSchemaExport)
        {
            builder.Services.AddSingleton<IAuthorizationHandler, GroupMemberHandler>();
        }

        builder.Services
            .AddScoped<IUserRepository, UserRepository>()
            .AddScoped<IGroupRepository, GroupRepository>()
            .AddScoped<IGameRepository, GameRepository>();

        builder.Services.Configure<ImageOptions>(config.GetSection(ImageOptions.SectionName));
        builder.Services.AddSingleton<IImageService, ImageService>();

        builder.Services.Configure<FormOptions>(options =>
        {
            options.MultipartBodyLengthLimit = 10_000_000;
        });
        builder.WebHost.ConfigureKestrel(options =>
        {
            options.Limits.MaxRequestBodySize = 10_000_000;
        });

        builder.Services
            .AddGraphQLServer()
            .AddAuthorization()
            .AddTypes()
            .AddType<api.API.Group.TrophyAwardedActivity>()
            .AddType<api.API.Group.MemberJoinedActivity>()
            .AddGlobalObjectIdentification()
            .AddMutationConventions(applyToAllMutations: true)
            .AddQueryFieldToMutationPayloads()
            .AddErrorFilter<TrophyErrorFilter>()
            .AddHttpRequestInterceptor<TrophyHttpRequestInterceptor>()
            .UseDefaultPipeline()
            .AddSorting();

        var app = builder.Build();

        app.UseCors();
        app.UseAuthentication();
        app.UseAuthorization();

        if (builder.Environment.IsDevelopment())
        {
            app.MapNitroApp("/dev").AllowAnonymous();
            app.MapGraphQLSchema("/graphql/schema.graphql").AllowAnonymous();
        }
        else
        {
            app.MapGraphQLSchema("/graphql/schema.graphql");
        }

        // Public, unauthenticated build-info endpoint. Surfaces the backend version in
        // the frontend's chrome chip on every page (including welcome / sign-in, which
        // run before the user has a Clerk JWT). TROJI_VERSION is set at build time by
        // the release-please workflow; falls back to "dev" locally.
        app.MapGet(
            "/server-info",
            () => Results.Ok(new
            {
                version = Environment.GetEnvironmentVariable("TROJI_VERSION") ?? "dev"
            })
        ).AllowAnonymous();

        app.MapGraphQLHttp().RequireAuthorization();
        app.MapGraphQLWebSocket();

        app.MapImageEndpoints();

        if (isSchemaExport)
        {
            await app.RunWithGraphQLCommandsAsync(args);
            return;
        }

        using (var scope = app.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<TrophyDbContext>();
            await db.Database.MigrateAsync();

            if (isSeed)
            {
                if (args.Length < 2 || string.IsNullOrWhiteSpace(args[1]))
                {
                    Console.Error.WriteLine("Usage: seed <user-id>");
                    return;
                }
                await Seeder.SeedAsync(db, args[1]);
                return;
            }
        }

        app.Run();
    }
}
