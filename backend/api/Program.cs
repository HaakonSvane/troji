using System.Reflection;
using System.Security.Claims;
using api.Auth.Handlers;
using api.Auth.Requirements;
using api.Database;
using api.Repository;
using api.Transport;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

namespace api;

public class Program
{
    public static void Main(string[] args)
    {
        var isSchemaExport = args.Length > 0 && args[0] == "schema";

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

        builder.Services
            .AddGraphQLServer()
            .AddAuthorization()
            .AddTypes()
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

        app.MapGraphQLHttp().RequireAuthorization();
        app.MapGraphQLWebSocket();

        if (isSchemaExport)
        {
            app.RunWithGraphQLCommandsAsync(args);
            return;
        }

        using (var scope = app.Services.CreateScope())
        {
            await scope.ServiceProvider.GetRequiredService<TrophyDbContext>()
                .Database.MigrateAsync();
        }

        app.Run();
    }
}
