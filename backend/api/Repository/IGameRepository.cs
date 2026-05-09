using api.Database.Models;

namespace api.Repository;

public interface IGameRepository
{
    Task<int> GetGameCountForGroupAsync(int groupId, CancellationToken cancellationToken);
    Task<ILookup<int, Game>> GetGamesByGroupIdsAsync(IReadOnlyList<int> groupIds, CancellationToken cancellationToken);
    Task<Game> CreateGameAsync(Game game, Group group, CancellationToken cancellationToken);
    Task<ILookup<int, Trophy>> GetTrophiesByGroupIdsAsync(IReadOnlyList<int> groupIds, CancellationToken cancellationToken);
    Task<ILookup<int, Trophy>> GetTrophiesByGameIdsAsync(IReadOnlyList<int> gameIds, CancellationToken cancellationToken);
    Task<IReadOnlyDictionary<int, Trophy>> GetTrophiesByIdsAsync(IReadOnlyList<int> ids, CancellationToken cancellationToken);
    Task<IReadOnlyDictionary<int, Game>> GetGamesByIdsAsync(IReadOnlyList<int> ids, CancellationToken cancellationToken);
    Task<Trophy> CreateTrophyAsync(Trophy trophy, TrophyRequest request, IReadOnlyList<TrophyRequestApproval> approvals, CancellationToken cancellationToken);
    Task<IReadOnlyDictionary<int, TrophyRequest>> GetTrophyRequestsByTrophyIdsAsync(IReadOnlyList<int> trophyIds, CancellationToken cancellationToken);
    Task<TrophyRequest> UpdateTrophyRequest(TrophyRequest request, CancellationToken cancellationToken);
    Task<Trophy> UpdateTrophy(Trophy trophy, CancellationToken cancellationToken);
    
}