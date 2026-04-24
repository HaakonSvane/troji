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
    [Error<GroupNotFoundException>]
    [Error<NoMemberException>]
    public static async Task<Trophy> CreateTrophyRequest(
        [TokenUser] TokenUser? tokenUser,
        [ID] string userId,
        [ID] int gameId,
        string? description,
        IGamesByIdsDataLoader gamesByIdsDataLoader,
        IUsersByGroupIdsDataLoader usersByGroupIdsDataLoader,
        IGroupsByIdsDataLoader groupsByIdsDataLoader,
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

        var group = await groupsByIdsDataLoader.LoadAsync(game.ParentGroupId, cancellationToken);
        if (group is null)
        {
            string serializedGroupId3 = serializer.Format(nameof(Group), game.ParentGroupId);
            throw new GroupNotFoundException(serializedGroupId3);
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
        if (group.DecisionModel == Database.Models.Group.RuleType.Democracy)
        {
            foreach (var member in members)
            {
                if (member.Id == tokenUser.Id)
                {
                    continue;
                }
                approvals.Push(new TrophyRequestApproval()
                {
                    UserId = member.Id,
                    Request = request,
                    IsApproved = false
                });
            }
        }

        if (approvals.All(approval => approval.IsApproved))
        {
            trophy.AwardedDate = DateTimeOffset.UtcNow;
        }
        return await gameRepository.CreateTrophyAsync(trophy, request, approvals, cancellationToken);
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