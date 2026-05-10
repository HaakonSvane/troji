namespace api.API.Errors;

public sealed class SelfHandoutException : Exception
{
    public SelfHandoutException() : base("You cannot award a trophy to yourself.")
    {
    }
}
