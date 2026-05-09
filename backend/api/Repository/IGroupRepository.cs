using api.Database.Models;

namespace api.Repository;

public interface IGroupRepository
{
    public Task<ILookup<string, Group>> GetGroupsForUsersIdsAsync(IReadOnlyList<string> ids,
        CancellationToken cancellationToken);
    
    public Task<IReadOnlyDictionary<int, Group>> GetGroupsByIdsAsync(IReadOnlyList<int> ids,
        CancellationToken cancellationToken);

    public Task<int> GetAdminGroupCountAsync(string adminUserId, CancellationToken cancellationToken);
    public Task<Group> CreateGroupAsync(string adminUserId, Group group, CancellationToken cancellationToken);
    public Task<GroupInvite> UpsertGroupInviteAsync(Group group, CancellationToken cancellationToken);
    public Task<IReadOnlyDictionary<int, GroupInvite>> GetInvitesForGroupIdsAsync(IReadOnlyList<int> ids, CancellationToken cancellationToken);
    public Task<IReadOnlyDictionary<string, GroupInvite>> GetInvitesForInviteCodesAsync(IReadOnlyList<string> codes, CancellationToken cancellationToken);
    public Task<Group> AddUserToGroup(string userId, Group group, CancellationToken cancellationToken);
}