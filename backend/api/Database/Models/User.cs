using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Database.Models;

[Index(nameof(Id))]
public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public required string Id { get; init; }

    public required string FirstName { get; set; }

    public string? MiddleName { get; set; }

    public required string LastName { get; set; }

    public string? ImageId { get; set; }

    public ICollection<Trophy> Trophies { get; set; } = new List<Trophy>();

    [GraphQLIgnore] public ICollection<UserGroup> UserGroups { get; set; } = new List<UserGroup>();
}