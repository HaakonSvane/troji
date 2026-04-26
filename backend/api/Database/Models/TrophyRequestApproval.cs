using System.ComponentModel.DataAnnotations.Schema;

namespace api.Database.Models;

public class TrophyRequestApproval
{
    [GraphQLIgnore]
    public string UserId { get; set; }
    
    [ForeignKey("UserId")]
    public User User { get; set; }
    
    public int RequestId { get; set; }
    
    [ForeignKey("RequestId")]
    public TrophyRequest Request { get; set; }
    
    public required bool IsApproved { get; set; }
}