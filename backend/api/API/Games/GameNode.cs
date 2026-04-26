using api.API.Group;
using api.Database.Models;
using api.Repository;

namespace api.API.Games;

[ExtendObjectType<Game>]
public static class GameNode
{
    public static async Task<Database.Models.Group?> GetGroupAsync(
        [Parent] Game game,
        IGroupsByIdsDataLoader dataLoader,
        CancellationToken cancellationToken)
    {
        return await dataLoader.LoadAsync(game.ParentGroupId, cancellationToken);
    }

    public static async Task<IReadOnlyCollection<Trophy>> GetTrophiesAsync(
        [Parent] Game game,
        ITrophiesByGameIdsDataLoader dataLoader,
        CancellationToken cancellationToken)
    {
        return await dataLoader.LoadAsync(game.Id, cancellationToken);
    }
    
    [UsePaging(DefaultPageSize = 3)]
    public static async Task<IReadOnlyCollection<User>> GetTopPlayersAsync(
        [Parent] Game game,
        IUsersByGameIdsDataLoader dataLoader,
        CancellationToken cancellationToken)
    {
        var users = await dataLoader.LoadAsync(game.Id, cancellationToken);
        return users
            .GroupBy(user => user.Id)
            .Select(group => new { User = group.First(), Count = group.Count() })
            .OrderByDescending(item => item.Count)
            .Select(item => item.User)
            .ToList();
    }
    
    [DataLoader]
    internal static Task<ILookup<int, User>> GetUsersByGameIdsAsync(
        IReadOnlyList<int> groupIds,
        IUserRepository repository)
    {
        return Task.FromResult(repository.GetUsersByGameIdsAsync(groupIds));
    }

    [DataLoader]
    internal static async Task<ILookup<int, Database.Models.Game>> GetGamesByGroupIdsAsync(
        IReadOnlyList<int> groupIds,
        IGameRepository repository,
        CancellationToken cancellationToken)
    {
        return await repository.GetGamesByGroupIdsAsync(groupIds, cancellationToken);
    }

    [DataLoader]
    internal static async Task<IReadOnlyDictionary<int, Database.Models.Game>> GetGamesByIdsAsync(
        IReadOnlyList<int> ids,
        IGameRepository repository,
        CancellationToken cancellationToken)
    {
        return await repository.GetGamesByIdsAsync(ids, cancellationToken);
    }
}
