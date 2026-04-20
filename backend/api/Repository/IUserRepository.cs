using api.Database.Models;

namespace api.Repository;

public interface IUserRepository
{
    public Task<User?> GetUserByIdAsync(string userId, CancellationToken cancellationToken);
    public Task<IReadOnlyDictionary<string, User>> GetUsersByIdsAsync(IReadOnlyList<string> ids,
        CancellationToken cancellationToken);
    public Task<User> RegisterUserAsync(string userId, string firstName, string? middleName, string lastName,
        CancellationToken cancellationToken);
    public Task<ILookup<int, User>> GetUsersByGroupIdsAsync(IReadOnlyList<int> ids, CancellationToken cancellationToken);
    ILookup<int, User> GetUsersByGameIdsAsync(IReadOnlyList<int> ids);
}
