using api.Database.Models;

namespace api.API.Group;

[InterfaceType("GroupActivity")]
public interface IGroupActivity
{
    string Id { get; }
    DateTimeOffset OccurredAt { get; }
}

public sealed class TrophyAwardedActivity : IGroupActivity
{
    public TrophyAwardedActivity(Trophy trophy)
    {
        Trophy = trophy;
        OccurredAt = trophy.AwardedDate ?? DateTimeOffset.UtcNow;
        Id = $"trophy-awarded:{trophy.Id}";
    }

    public string Id { get; }
    public DateTimeOffset OccurredAt { get; }
    public Trophy Trophy { get; }
}

public sealed class MemberJoinedActivity : IGroupActivity
{
    public MemberJoinedActivity(User member, int groupId, DateTimeOffset joinedAt)
    {
        Member = member;
        OccurredAt = joinedAt;
        Id = $"member-joined:{groupId}:{member.Id}";
    }

    public string Id { get; }
    public DateTimeOffset OccurredAt { get; }
    public User Member { get; }
}
