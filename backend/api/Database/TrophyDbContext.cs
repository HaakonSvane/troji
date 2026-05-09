using api.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Database;

public class TrophyDbContext : DbContext
{
    public TrophyDbContext(DbContextOptions<TrophyDbContext> options) : base(options)
    {
    }

    public DbSet<Group> Groups { get; set; } = default!;
    public DbSet<GroupInvite> GroupInvites { get; set; } = default!;
    public DbSet<User> Users { get; set; } = default!;
    public DbSet<UserGroup> UserGroups { get; set; } = default!;
    public DbSet<Game> Games { get; set; } = default!;
    public DbSet<Trophy> Trophies { get; set; } = default!;
    public DbSet<TrophyRequest> TrophyRequests { get; set; } = default!;

    public DbSet<TrophyRequestApproval> TrophyRequestApprovals { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .Entity<UserGroup>()
            .HasKey(userGroup => new { userGroup.UserId, userGroup.GroupId });

        modelBuilder
            .Entity<TrophyRequestApproval>()
            .HasKey(approval => new { approval.UserId, approval.RequestId });

        modelBuilder
            .Entity<Game>()
            .HasIndex(game => new { game.ParentGroupId, game.Emoji })
            .IsUnique();
    }
}