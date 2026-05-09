using api.API.Errors;
using api.Database.Models;
using api.Repository;
using api.Transport;
using HotChocolate.Types.Relay;

namespace api.API.Group;

[MutationType]
public static class GroupMutations
{
    [Error(typeof(InviteResetTooSoonException))]
    [Error(typeof(NoUserException))]
    [Error(typeof(GroupNotFoundException))]
    [Error(typeof(NoAdminException))]
    public static async Task<GroupInvite> CreateGroupInviteAsync(
        [TokenUser] TokenUser? tokenUser,
        [ID] int groupId,
        IGroupRepository groupRepository,
        IGroupsByIdsDataLoader dataLoader,
        CancellationToken cancellationToken,
        [Service] INodeIdSerializer serializer)
    {
        if (tokenUser is null)
        {
            throw new NoUserException();
        }

        var group = await dataLoader.LoadAsync(groupId, cancellationToken);
        if (group is null)
        {
            var serializedId = serializer.Format("Group", groupId);
            throw new GroupNotFoundException(serializedId);
        }
        if (group.AdminId != tokenUser.Id)
        {
            throw new NoAdminException();
        }

        return await groupRepository.UpsertGroupInviteAsync(group, cancellationToken);
    }

    [Error(typeof(NoInviteException))]
    [Error(typeof(NoUserException))]
    [Error(typeof(InviteExpiredException))]
    [Error(typeof(GroupNotFoundException))]
    [Error(typeof(AlreadyMemberException))]
    public static async Task<api.Database.Models.Group> JoinGroupAsync(
        [TokenUser] TokenUser? tokenUser,
        string inviteCode,
        IInvitesByInviteCodeDataLoader invitesDataLoader,
        IGroupRepository groupRepository,
        IGroupsByIdsDataLoader groupsByIdsDataLoader,
        IGroupsByUserIdsDataLoader groupsByUserIdsDataLoader,
        CancellationToken cancellationToken)
    {
        if (tokenUser is null)
        {
            throw new NoUserException();
        }

        var invite = await invitesDataLoader.LoadAsync(inviteCode, cancellationToken);
        if (invite is null)
        {
            throw new NoInviteException();
        }

        if (invite.ExpirationDate < DateTimeOffset.UtcNow)
        {
            throw new InviteExpiredException(invite.ExpirationDate);
        }

        var group = await groupsByIdsDataLoader.LoadAsync(invite.GroupId, cancellationToken);

        if (group is null)
        {
            throw new GroupNotFoundException(invite.GroupId.ToString());
        }

        var myGroups = await groupsByUserIdsDataLoader.LoadAsync(tokenUser.Id, cancellationToken);
        if (myGroups.Any(myGroup => myGroup.Id == group.Id))
        {
            throw new AlreadyMemberException();
        }
        return await groupRepository.AddUserToGroup(tokenUser.Id, group, cancellationToken);
    }


    [Error<NoUserException>]
    [Error<GroupLimitExceededException>]
    public static async Task<api.Database.Models.Group> CreateGroupAsync(
        [TokenUser] TokenUser? tokenUser,
        string name,
        string? description,
        IGroupRepository groupRepository,
        CancellationToken cancellationToken)
    {
        if (tokenUser is null)
        {
            throw new NoUserException();
        }

        var groupCount = await groupRepository.GetAdminGroupCountAsync(tokenUser.Id, cancellationToken);
        if (groupCount >= 5)
        {
            throw new GroupLimitExceededException();
        }

        var group = new api.Database.Models.Group()
        {
            Name = name,
            Description = description,
            AdminId = tokenUser.Id,
            Admin = null!,
            CreatedDate = DateTimeOffset.Now.ToUniversalTime(),
            DecisionModel = api.Database.Models.Group.RuleType.Open,
        };
        return await groupRepository.CreateGroupAsync(tokenUser.Id, group, cancellationToken);
    }
}