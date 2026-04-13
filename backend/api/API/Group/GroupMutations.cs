using api.API.Errors;
using api.Database.Models;
using api.Repository;
using api.Transport;

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
        CancellationToken cancellationToken)
    {
        if (tokenUser is null)
        {
            throw new NoUserException();
        }

        var group = await dataLoader.LoadAsync(groupId, cancellationToken);
        if (group is null)
        {
            throw new GroupNotFoundException(groupId.ToString());
        }
        if (group.AdminId != tokenUser.Id)
        {
            throw new NoAdminException();
        }
        
        return await groupRepository.UpsertGroupInviteAsync(group, cancellationToken);
    }
    
    [Error(typeof(NoInviteException))]
    [Error(typeof(NoUserException))]
    [Error(typeof(UserNotRegisteredException))]
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
        IUserRepository userRepository,
        CancellationToken cancellationToken)
    {
        if (tokenUser is null)
        {
            throw new NoUserException();
        }

        // Ensure user is registered before joining group
        var user = await userRepository.GetUserByIdAsync(tokenUser.Id, cancellationToken);
        if (user is null)
        {
            throw new UserNotRegisteredException();
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
        if (myGroups != null && myGroups.Any(myGroup => myGroup.Id == group.Id))
        {
            throw new AlreadyMemberException();
        }
        return await groupRepository.AddUserToGroup(tokenUser.Id, group, cancellationToken);
    }
        
    
    [Error<NoUserException>]
    [Error<UserNotRegisteredException>]
    public static async Task<api.Database.Models.Group> CreateGroupAsync(
        [TokenUser] TokenUser? tokenUser,
        string name,
        string? description,
        api.Database.Models.Group.RuleType? decisionModel,
        IGroupRepository groupRepository,
        IUserRepository userRepository,
        CancellationToken cancellationToken)
    {
        if (tokenUser is null)
        {
            throw new NoUserException();
        }

        // Ensure user is registered before creating group
        var user = await userRepository.GetUserByIdAsync(tokenUser.Id, cancellationToken);
        if (user is null)
        {
            throw new UserNotRegisteredException();
        }

        var group = new api.Database.Models.Group()
        {
            Name = name,
            Description = description,
            CreatedDate = DateTimeOffset.Now.ToUniversalTime(),
            DecisionModel = decisionModel ?? api.Database.Models.Group.RuleType.Democracy,
        };
        return await groupRepository.CreateGroupAsync(tokenUser.Id, group, cancellationToken);
    }
}