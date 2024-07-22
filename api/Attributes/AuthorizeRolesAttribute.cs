using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using System.Net;

public class AuthorizeRolesAttribute : AuthorizeAttribute, IAuthorizationFilter
{
    private readonly string[] _roles;

    public AuthorizeRolesAttribute(params string[] roles)
    {
        _roles = roles;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        var hasAuthorizationHeader = context.HttpContext.Request.Headers.ContainsKey("Authorization");

        if (!hasAuthorizationHeader)
        {
            context.Result = new JsonResult(new { status = (int)HttpStatusCode.Unauthorized, message = "Unauthorized. Token is missing." }) { StatusCode = (int)HttpStatusCode.Unauthorized };
            return;
        }

        if (!user.Identity.IsAuthenticated)
        {
            context.Result = new JsonResult(new { status = (int)HttpStatusCode.Unauthorized, message = "Unauthorized" }) { StatusCode = (int)HttpStatusCode.Unauthorized };
            return;
        }

        var userRole = user.Claims.FirstOrDefault(c => c.Type == "RoleId")?.Value;

        if (userRole == null || !_roles.Contains(userRole))
        {
            context.Result = new JsonResult(new { status = (int)HttpStatusCode.Forbidden, message = "Forbidden" }) { StatusCode = (int)HttpStatusCode.Forbidden };
        }
    }
}
