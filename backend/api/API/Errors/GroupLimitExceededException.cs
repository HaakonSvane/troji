namespace api.API.Errors;

public sealed class GroupLimitExceededException : Exception
{
    public GroupLimitExceededException()
        : base("Users may not create more than 5 groups.")
    {
    }
}
