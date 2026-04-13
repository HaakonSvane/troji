using System.Reflection;
using api.Auth.Handlers;
using api.Auth.Requirements;
using api.Database;
using api.Repository;
using api.Transport;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Npgsql;

namespace api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        IConfiguration config = new ConfigurationBuilder()
            .SetBasePath(builder.Environment.ContentRootPath)
            .AddJsonFile("appsettings.json", true, true)
            .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", true)
            .AddUserSecrets(Assembly.GetExecutingAssembly(), true)
            .AddEnvironmentVariables()
            .Build();
        
        var connectionStringBuilder = new NpgsqlConnectionStringBuilder();
        connectionStringBuilder.Host = config["Database:Host"];
        connectionStringBuilder.Port = config.GetValue<int>("Database:Port");
        connectionStringBuilder.Username = config["Database:User"];
        connectionStringBuilder.Password = config["Database:Password"];

        builder.Services.AddDbContextPool<TrophyDbContext>(options =>
            options
                .UseNpgsql(connectionStringBuilder.ConnectionString));

        var authBuilder = builder.Services.AddAuthentication(options =>
        {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;   
        });
        authBuilder
            .AddJwtBearer(options =>
            {
                options.Authority = config["Auth:Authority"];
                options.Audience = config["Auth:Audience"];
            });
        
        builder.Services.AddAuthorization(cfg => 
            cfg.AddPolicy("IsGroupMember", policy => policy.Requirements.Add(new GroupMemberRequirement()))
            );

        builder.Services
            .AddScoped<IUserRepository, UserRepository>()
            .AddScoped<IGroupRepository, GroupRepository>()
            .AddScoped<IGameRepository, GameRepository>();

        builder.Services.AddSingleton<IAuthorizationHandler, GroupMemberHandler>();

        builder.Services
            .AddGraphQLServer()
            .AddAuthorization()
            .AddTypes()
            .AddGlobalObjectIdentification()
            .AddMutationConventions(applyToAllMutations: true)
            .AddQueryFieldToMutationPayloads()
            .AddHttpRequestInterceptor<TrophyHttpRequestInterceptor>()
            .UseDefaultPipeline()
            .AddSorting();

        var app = builder.Build();

        app
            .UseAuthentication()
            .UseAuthorization();

        if (builder.Environment.IsDevelopment())
        {
            app.MapNitroApp("/dev");
        }
        
        app.MapGraphQLHttp().RequireAuthorization();
        app.MapGraphQLWebSocket();
        app.MapGraphQLSchema();
        
        if (args.Length > 0)
        {
            app.RunWithGraphQLCommandsAsync(args);
            return;
        }
        
        app.Run();
    }
}