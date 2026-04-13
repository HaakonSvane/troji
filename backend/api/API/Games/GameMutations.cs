using api.API.Errors;
using api.API.Group;
using api.Repository;
using api.Transport;
using api.Database.Models;

namespace api.API.Games;

[MutationType]
public static class GameMutations
{
    [Error<NoUserException>]
    [Error<GroupNotFoundException>]
    public static async Task<Game> CreateGameAsync(
        [TokenUser] TokenUser? tokenUser,
        [ID] int groupId,
        string name,
        string symbol,
        string? description,
        IGroupsByIdsDataLoader groupsByIdsDataLoader,
        IGameRepository gameRepository,
        CancellationToken cancellationToken)
    {
        if (tokenUser is null)
        {
            throw new NoUserException();
        }

        var group = await groupsByIdsDataLoader.LoadAsync(groupId, cancellationToken);
        if (group is null)
        {
            throw new GroupNotFoundException(groupId.ToString());
        }

        var newGame = new Game()
        {
            Name = name,
            Emoji = symbol,
            Description = description,
            CreatedDate = DateTimeOffset.UtcNow,
        };
        
        return await gameRepository.CreateGameAsync(newGame, group, cancellationToken);
    }
}