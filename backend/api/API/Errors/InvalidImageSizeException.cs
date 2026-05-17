namespace api.API.Errors;

public sealed class InvalidImageSizeException : Exception
{
    public InvalidImageSizeException(int size)
        : base($"Image size {size} is not a configured preset.")
    {
    }
}
