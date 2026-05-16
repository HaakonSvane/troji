namespace api.API.Errors;

public sealed class GroupNameMismatchException : Exception
{
    public GroupNameMismatchException() : base("Group name confirmation does not match.")
    {
    }
}
