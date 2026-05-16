namespace api.API.Errors;

public sealed class InvalidGroupNameException : Exception
{
    public InvalidGroupNameException() : base("Group name is required.")
    {
    }
}
