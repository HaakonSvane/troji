using api.API.Errors;
using HotChocolate;
using HotChocolate.Execution;
using Microsoft.Extensions.Logging;

namespace api.Transport;

public sealed class TrophyErrorFilter : IErrorFilter
{
    // HotChocolate's schema service container is isolated from application DI, so a
    // standard ILogger<T> constructor injection fails at schema-export and at runtime.
    // Resolving via a static factory keeps logging available everywhere (production,
    // schema export, tests) at the cost of bypassing the host's logger configuration —
    // acceptable here because this filter only logs unexpected exceptions.
    private static readonly ILogger Logger =
        LoggerFactory.Create(builder => builder.AddSimpleConsole())
            .CreateLogger(typeof(TrophyErrorFilter).FullName!);

    public IError OnError(IError error)
    {
        if (error.Exception is null)
        {
            return error;
        }

        if (error.Exception is
            NoUserException or
            UserAlreadyRegisteredException or
            InvalidUserNameException or
            InvalidDisplayNameException or
            GroupNotFoundException or
            NoAdminException or
            NoInviteException or
            InviteExpiredException or
            AlreadyMemberException or
            InviteResetTooSoonException or
            NoGameException or
            NoTrophyRequestException or
            NoApprovalRequiredException or
            NoMemberException or
            GroupLimitExceededException or
            GameLimitExceededException or
            DuplicateGameEmojiException or
            SelfHandoutException or
            InvalidGroupNameException or
            CannotTransferToSelfException or
            GroupNameMismatchException)
        {
            var code = error.Exception.GetType().Name.Replace("Exception", "Error", StringComparison.Ordinal);

            return error
                .WithMessage(error.Exception.Message)
                .WithCode(code);
        }

        Logger.LogError(
            error.Exception,
            "Unhandled exception in GraphQL operation at path {Path}: {ExceptionType}",
            error.Path?.ToString() ?? "<unknown>",
            error.Exception.GetType().FullName);

        return ErrorBuilder.FromError(error)
            .SetMessage("Internal server error.")
            .SetCode("UnexpectedError")
            .SetException(null)
            .Build();
    }
}
