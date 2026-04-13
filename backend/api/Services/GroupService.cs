using api.API.Errors;
using api.API.Group;
using api.Database.Models;
using api.Repository;

namespace api.Services;

public class GroupService : IGroupService
{
    private readonly IGroupRepository _groupRepository;
    private readonly IGroupsByIdsDataLoader _groupsByIdsDataLoader;
    
    public GroupService(IGroupRepository groupRepository, IGroupsByIdsDataLoader groupsByIdsDataLoader)
    {
        _groupRepository = groupRepository;
        _groupsByIdsDataLoader = groupsByIdsDataLoader;
    }

    public async Task<GroupInvite> ResetGroupInviteAsync(string userId, int groupId, CancellationToken cancellationToken)
    {
        var group = await _groupsByIdsDataLoader.LoadAsync(groupId, cancellationToken);
        if (group is null)
        {
            throw new GroupNotFoundException(groupId.ToString());
        }
        if (group.AdminId != userId)
        {
            throw new NoAdminException();
        }
        
        return await _groupRepository.UpsertGroupInviteAsync(group, cancellationToken);
    }
}