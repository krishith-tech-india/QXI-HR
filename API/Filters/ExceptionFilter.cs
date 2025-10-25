using Core;
using Core.DTOs.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Filters
{
    public class ExceptionFilter : IActionFilter, IOrderedFilter
    {
        public int Order => int.MaxValue - 10;

        public void OnActionExecuted(ActionExecutedContext context)
        {

            if (context.Exception is APIException handledException)
            {
                context.Result =
                    new ObjectResult(Response<object>.Failure(
                            new Error(handledException.ErrorMessage),
                            handledException.StatusCode
                        ))
                    {
                        StatusCode = handledException.StatusCode,
                    };

                context.ExceptionHandled = true;
            }

            if ((context.Exception is Exception ex) && !(context.Exception is APIException))
            {
                context.Result =
                    new ObjectResult(new APIException(
                            StatusCodes.Status500InternalServerError,
                            ex.Message
                        ))
                    {
                        StatusCode = StatusCodes.Status500InternalServerError,
                    };

                context.ExceptionHandled = true;
            }
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
        }
    }
}
