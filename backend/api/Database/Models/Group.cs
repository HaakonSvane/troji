using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Database.Models;

public class Group
{
    public enum RuleType
    {
        Open
    }

    [Key] public int Id { get; set; }

    public required string Name { get; set; }

    public string? Description { get; set; }

    public string? ImageId { get; set; }

    public required string AdminId { get; set; }


    public GroupInvite? Invite { get; set; }

    public required RuleType DecisionModel { get; set; }

    [ForeignKey("AdminId")] public User? Admin { get; set; }

    [GraphQLIgnore]
    public ICollection<UserGroup> UserGroups { get; set; } = new List<UserGroup>();

    public ICollection<Game> Games { get; set; } = new List<Game>();

    public required DateTimeOffset CreatedDate { get; set; }
}