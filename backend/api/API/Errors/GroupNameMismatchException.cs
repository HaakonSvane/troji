namespace api.API.Errors;

public sealed class GroupNameMismatchException : Exception
{
    public GroupNameMismatchException() : base("Circle name confirmation does not match.")
    {
    }
}
