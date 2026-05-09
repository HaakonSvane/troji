namespace api.API.Errors;

public sealed class GameLimitExceededException : Exception
{
    public GameLimitExceededException()
        : base("Groups may not contain more than 5 games.")
    {
    }
}
