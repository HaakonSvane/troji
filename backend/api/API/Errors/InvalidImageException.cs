namespace api.API.Errors;

public sealed class InvalidImageException : Exception
{
    public InvalidImageException(string message) : base(message)
    {
    }
}
