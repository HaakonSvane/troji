using api.API.Account;
using api.API.Errors;
using api.API.Group;
using api.Database.Models;
using api.Repository;
using api.Transport;
using HotChocolate.Language;
using HotChocolate.Types.Relay;

namespace api.API.Games;

[MutationType]
public static class TrophyMutations
{
    [Error<NoUserException>]
    [Error<NoGameException>]
    [Error<NoMemberException>]
    [Error<SelfHandoutException>]
    public static async Task<Trophy> CreateTrophyRequest(
        [TokenUser] TokenUser? tokenUser,
        [ID] string userId,
        [ID] int gameId,
        string? description,
        IGamesByIdsDataLoader gamesByIdsDataLoader,
        IUsersByGroupIdsDataLoader usersByGroupIdsDataLoader,
        IGameRepository gameRepository,
        CancellationToken cancellationToken,
        [Service] INodeIdSerializer serializer)
    {
        if (tokenUser is null)
        {
            throw new NoUserException();
        }

        var game = await gamesByIdsDataLoader.LoadAsync(gameId, cancellationToken);

        if (game is null)
        {
            throw new NoGameException(gameId.ToString());
        }

        var members = await usersByGroupIdsDataLoader.LoadAsync(game.ParentGroupId, cancellationToken);
        if (members.All(member => member.Id != tokenUser.Id))
        {
            string serializedGroupId = serializer.Format(nameof(Group), game.ParentGroupId);
            throw new NoMemberException(tokenUser.Id, serializedGroupId);
        }
        if (members.All(member => member.Id != userId))
        {
            string serializedGroupId2 = serializer.Format(nameof(Group), game.ParentGroupId);
            throw new NoMemberException(tokenUser.Id, serializedGroupId2);
        }

        if (tokenUser.Id == userId)
        {
            throw new SelfHandoutException();
        }

        var trophy = new Trophy()
        {
            GameId = game.Id,
            ReceiverId = userId,
            Description = description,
        };

        var request = new api.Database.Models.TrophyRequest()
        {
            Trophy = trophy,
        };

        List<TrophyRequestApproval> approvals = new List<TrophyRequestApproval>()
        {
            new()
            {
                UserId = tokenUser.Id,
                Request = request,
                IsApproved = true,
            }
        };

        trophy.AwardedDate = DateTimeOffset.UtcNow;
        var savedTrophy = await gameRepository.CreateTrophyAsync(trophy, request, approvals, cancellationToken);

        // Populate navigation properties so HotChocolate can resolve trophy.game and trophy.receiver
        // without additional DB round-trips. These objects are already in memory from earlier in this method.
        savedTrophy.Game = game;
        savedTrophy.Receiver = members.First(m => m.Id == userId);

        return savedTrophy;
    }

    [Error<NoUserException>]
    [Error<NoTrophyRequestException>]
    [Error<NoApprovalRequiredException>]
    public static async Task<Trophy> ApproveTrophy(
        [TokenUser] TokenUser? tokenUser,
        [ID] int trophyId,
        ITrophyRequestsByTrophyIdsDataLoader trophyRequestsByTrophyIdsDataLoader,
        ITrophiesByIdsDataLoader trophiesByIdsDataLoader,
        IGameRepository repository,
        CancellationToken cancellationToken)
    {
        if (tokenUser is null)
        {
            throw new NoUserException();
        }

        var request = await trophyRequestsByTrophyIdsDataLoader.LoadAsync(trophyId, cancellationToken);

        if (request is null)
        {
            throw new NoTrophyRequestException(trophyId.ToString());
        }

        var myApproval = request.Approvals.FirstOrDefault(approval => approval.UserId == tokenUser.Id);
        if (myApproval is null || myApproval.IsApproved)
        {
            throw new NoApprovalRequiredException();
        }

        myApproval.IsApproved = true;

        if (request.Approvals.All(approval => approval.IsApproved))
        {
            var trophy = await trophiesByIdsDataLoader.LoadAsync(trophyId, cancellationToken);
            trophy.AwardedDate = DateTimeOffset.UtcNow;
            await repository.UpdateTrophy(trophy, cancellationToken);
        }

        await repository.UpdateTrophyRequest(request, cancellationToken);
        return await trophiesByIdsDataLoader.LoadAsync(trophyId, cancellationToken);
    }
}