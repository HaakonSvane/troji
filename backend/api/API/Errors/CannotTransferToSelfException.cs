namespace api.API.Errors;

public sealed class CannotTransferToSelfException : Exception
{
    public CannotTransferToSelfException() : base("You cannot transfer admin to yourself.")
    {
    }
}
