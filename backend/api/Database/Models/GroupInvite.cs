using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using api.Properties;
using Microsoft.EntityFrameworkCore;

namespace api.Database.Models;

[Index(nameof(InviteCode))]
[GraphQLName("Invite")]
public class GroupInvite
{
    [GraphQLIgnore]
    [Key]
    [ForeignKey("Group")]
    public int GroupId { get; set; }

    public Group Group { get; set; }

    [StringLength(ShortIdOptions.IdLength)]
    public required string InviteCode { get; set; }

    public required DateTimeOffset ExpirationDate { get; set; }

    [GraphQLIgnore]
    public required DateTimeOffset NextAllowedResetDate { get; set; }
}