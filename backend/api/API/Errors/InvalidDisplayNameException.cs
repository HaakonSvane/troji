namespace api.API.Errors;

public sealed class InvalidDisplayNameException : Exception
{
    public InvalidDisplayNameException() : base("Display name must be between 1 and 32 characters.")
    {
    }
}
