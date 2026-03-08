using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace JadwalPetani.Filters;

public class ValidateCsrfHeaderAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var method = context.HttpContext.Request.Method;
        if (method != "GET" && method != "HEAD" && method != "OPTIONS" && method != "TRACE")
        {
            if (!context.HttpContext.Request.Headers.ContainsKey("X-Requested-With"))
            {
                context.Result = new BadRequestObjectResult(new { message = "Possible CSRF detected. Missing security header." });
            }
        }

        base.OnActionExecuting(context);
    }
}
