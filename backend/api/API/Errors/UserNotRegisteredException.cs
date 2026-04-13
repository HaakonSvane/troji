namespace api.API.Errors;

public sealed class UserNotRegisteredException : Exception
{
    public UserNotRegisteredException()
        : base("User is authenticated but not registered. Please call registerUser mutation first.")
    {
    }
}

