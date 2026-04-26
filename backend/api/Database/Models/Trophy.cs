using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace api.Database.Models;

[Index(nameof(GameId))]
public class Trophy
{
    [Key] 
    public int Id { get; set; }
    
    [GraphQLIgnore]
    public int GameId { get; set; }

    [ForeignKey("GameId")]
    public Game Game { get; set; }

    [GraphQLIgnore]
    public string ReceiverId { get; set; }

    [ForeignKey("ReceiverId")]
    public User Receiver { get; set; }
    
    
    public TrophyRequest Request { get; set; }
    
    public string? Description { get; set; }
    
    public DateTimeOffset? AwardedDate { get; set; }
}