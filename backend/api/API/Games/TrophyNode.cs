using api.Database.Models;
using api.Repository;

namespace api.API.Games;

[ExtendObjectType<Trophy>]
public static class TrophyNode
{
    public static async Task<bool> IsAwarded(
        [Parent] Trophy trophy,
        ITrophyRequestsByTrophyIdsDataLoader dataLoader,
        CancellationToken cancellationToken)
    {
        var requests = await dataLoader.LoadAsync(trophy.Id, cancellationToken);
        return requests.Approvals.All(approval => approval.IsApproved);
    }

    public static async Task<api.Database.Models.TrophyRequest> GetRequestAsync(
        [Parent] Trophy trophy,
        ITrophyRequestsByTrophyIdsDataLoader dataLoader,
        CancellationToken cancellationToken)
    {
        return await dataLoader.LoadAsync(trophy.Id, cancellationToken);
    }

    public static async Task<User?> GetAwardedByAsync(
        [Parent] Trophy trophy,
        ITrophyRequestsByTrophyIdsDataLoader dataLoader,
        CancellationToken cancellationToken)
    {
        var request = await dataLoader.LoadAsync(trophy.Id, cancellationToken);
        return request?.Approvals.FirstOrDefault(a => a.IsApproved)?.User;
    }

    [DataLoader]
    internal static async Task<ILookup<int, Trophy>> GetTrophiesByGroupIds(
        IReadOnlyList<int> groupIds,
        IGameRepository repository,
        CancellationToken cancellationToken)
    {
        return await repository.GetTrophiesByGroupIdsAsync(groupIds, cancellationToken);
    }

    [DataLoader]
    internal static async Task<IReadOnlyDictionary<int, Trophy>> GetTrophiesByIdsAsync(
        IReadOnlyList<int> ids,
        IGameRepository repository,
        CancellationToken cancellationToken)
    {
        return await repository.GetTrophiesByIdsAsync(ids, cancellationToken);
    }

    [DataLoader]
    internal static async Task<ILookup<int, Trophy>> GetTrophiesByGameIdsAsync(IReadOnlyList<int> ids, IGameRepository repository, CancellationToken cancellationToken)
    {
        return await repository.GetTrophiesByGameIdsAsync(ids, cancellationToken);
    }
}