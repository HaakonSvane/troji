namespace api.API.Errors;

public sealed class InvalidUserNameException : Exception
{
    public InvalidUserNameException() : base("First name and last name are required.")
    {
    }
}
