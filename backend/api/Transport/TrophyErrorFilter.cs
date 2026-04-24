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

        if (error.Exception.GetType().Namespace != typeof(NoUserException).Namespace)
        {
            return error;
        }

        var code = error.Exception.GetType().Name.Replace("Exception", "Error", StringComparison.Ordinal);

        return error
            .WithMessage(error.Exception.Message)
            .WithCode(code);
    }
}