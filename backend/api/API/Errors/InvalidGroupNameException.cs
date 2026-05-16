namespace api.API.Errors;

public sealed class InvalidGroupNameException : Exception
{
    public InvalidGroupNameException() : base("Circle name is required.")
    {
    }
}
