using api.API.Errors;
using api.Database.Models;
using api.Repository;
using api.Transport;
using HotChocolate.Types.Relay;

namespace api.API.Group;

public sealed record DeletedGroupPayload([property: ID(nameof(Database.Models.Group))] int DeletedId);

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
    public static async Task<Database.Models.Group> JoinGroupAsync(
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

        var joinedGroup = await groupRepository.AddUserToGroup(tokenUser.Id, group, cancellationToken);
        groupsByUserIdsDataLoader.RemoveCacheEntry(tokenUser.Id);
        return joinedGroup;


    }


    [Error<NoUserException>]
    [Error<GroupLimitExceededException>]
    public static async Task<Database.Models.Group> CreateGroupAsync(
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

    [Error<NoUserException>]
    [Error<GroupNotFoundException>]
    [Error<NoAdminException>]
    [Error<InvalidGroupNameException>]
    public static async Task<Database.Models.Group> UpdateGroupAsync(
        [TokenUser] TokenUser? tokenUser,
        [ID(nameof(Database.Models.Group))] int groupId,
        string name,
        string? description,
        IGroupRepository groupRepository,
        IGroupsByIdsDataLoader groupsByIdsDataLoader,
        CancellationToken cancellationToken,
        [Service] INodeIdSerializer serializer)
    {
        if (tokenUser is null)
        {
            throw new NoUserException();
        }

        var group = await groupsByIdsDataLoader.LoadAsync(groupId, cancellationToken);
        if (group is null)
        {
            throw new GroupNotFoundException(serializer.Format("Group", groupId));
        }
        if (group.AdminId != tokenUser.Id)
        {
            throw new NoAdminException();
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new InvalidGroupNameException();
        }

        var updated = await groupRepository.UpdateGroupAsync(group, name, description, cancellationToken);
        groupsByIdsDataLoader.RemoveCacheEntry(groupId);
        return updated;
    }

    [Error<NoUserException>]
    [Error<GroupNotFoundException>]
    [Error<NoAdminException>]
    [Error<NoMemberException>]
    [Error<CannotTransferToSelfException>]
    public static async Task<Database.Models.Group> TransferGroupAdminAsync(
        [TokenUser] TokenUser? tokenUser,
        [ID(nameof(Database.Models.Group))] int groupId,
        [ID(nameof(Database.Models.User))] string newAdminId,
        IGroupRepository groupRepository,
        IGroupsByIdsDataLoader groupsByIdsDataLoader,
        IGroupsByUserIdsDataLoader groupsByUserIdsDataLoader,
        CancellationToken cancellationToken,
        [Service] INodeIdSerializer serializer)
    {
        if (tokenUser is null)
        {
            throw new NoUserException();
        }

        var group = await groupsByIdsDataLoader.LoadAsync(groupId, cancellationToken);
        if (group is null)
        {
            throw new GroupNotFoundException(serializer.Format("Group", groupId));
        }
        if (group.AdminId != tokenUser.Id)
        {
            throw new NoAdminException();
        }
        if (newAdminId == tokenUser.Id)
        {
            throw new CannotTransferToSelfException();
        }

        var previousAdminId = group.AdminId;
        var transferred = await groupRepository.TransferAdminAsync(group, newAdminId, cancellationToken);
        groupsByIdsDataLoader.RemoveCacheEntry(groupId);
        groupsByUserIdsDataLoader.RemoveCacheEntry(previousAdminId);
        groupsByUserIdsDataLoader.RemoveCacheEntry(newAdminId);
        return transferred;
    }

    [Error<NoUserException>]
    [Error<GroupNotFoundException>]
    [Error<NoAdminException>]
    [Error<GroupNameMismatchException>]
    public static async Task<DeletedGroupPayload> DeleteGroupAsync(
        [TokenUser] TokenUser? tokenUser,
        [ID(nameof(Database.Models.Group))] int groupId,
        string confirmName,
        IGroupRepository groupRepository,
        IGroupsByIdsDataLoader groupsByIdsDataLoader,
        IGroupsByUserIdsDataLoader groupsByUserIdsDataLoader,
        CancellationToken cancellationToken,
        [Service] INodeIdSerializer serializer)
    {
        if (tokenUser is null)
        {
            throw new NoUserException();
        }

        var group = await groupsByIdsDataLoader.LoadAsync(groupId, cancellationToken);
        if (group is null)
        {
            throw new GroupNotFoundException(serializer.Format("Group", groupId));
        }
        if (group.AdminId != tokenUser.Id)
        {
            throw new NoAdminException();
        }
        if (!string.Equals(confirmName, group.Name, StringComparison.Ordinal))
        {
            throw new GroupNameMismatchException();
        }

        var affectedMemberIds = await groupRepository.DeleteGroupAsync(group, cancellationToken);
        groupsByIdsDataLoader.RemoveCacheEntry(groupId);
        foreach (var memberId in affectedMemberIds)
        {
            groupsByUserIdsDataLoader.RemoveCacheEntry(memberId);
        }
        return new DeletedGroupPayload(groupId);
    }
}