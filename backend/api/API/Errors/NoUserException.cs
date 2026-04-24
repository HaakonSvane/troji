namespace api.API.Errors;

public sealed class NoUserException : Exception
{
    public NoUserException()
        : base("No registered user exists for the current authenticated identity. Complete registration first.")
    {
    }
}