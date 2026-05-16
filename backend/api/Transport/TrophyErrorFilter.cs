using api.API.Errors;
using HotChocolate;
using HotChocolate.Execution;

namespace api.Transport;

public sealed class TrophyErrorFilter : IErrorFilter
{
    public IError OnError(IError error)
    {
        if (error.Exception is null)
        {
            return error;
        }

        if (error.Exception is not (
            NoUserException or
            UserAlreadyRegisteredException or
            InvalidUserNameException or
            GroupNotFoundException or
            NoAdminException or
            NoInviteException or
            InviteExpiredException or
            AlreadyMemberException or
            InviteResetTooSoonException or
            NoGameException or
            NoTrophyRequestException or
            NoApprovalRequiredException or
            NoMemberException))
        {
            return error;
        }

        var code = error.Exception.GetType().Name.Replace("Exception", "Error", StringComparison.Ordinal);

        return error
            .WithMessage(error.Exception.Message)
            .WithCode(code);
    }
}