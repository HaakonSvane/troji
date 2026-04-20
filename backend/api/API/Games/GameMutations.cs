using api.API.Errors;
using api.API.Group;
using api.Repository;
using api.Transport;
using api.Database.Models;
using HotChocolate.Types.Relay;

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
        [Service] INodeIdSerializer serializer,
        CancellationToken cancellationToken)
    {
        if (tokenUser is null)
        {
            throw new NoUserException();
        }

        var group = await groupsByIdsDataLoader.LoadAsync(groupId, cancellationToken);
        if (group is null)
        {
            var serializedId = serializer.Format("Group", groupId);
            throw new GroupNotFoundException(serializedId);
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