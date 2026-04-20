namespace api.API.Errors;

public sealed class UserAlreadyRegisteredException : Exception
{
    public UserAlreadyRegisteredException()
        : base("A user with this ID is already registered.")
    {
    }
}
