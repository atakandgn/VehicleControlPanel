using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class AuthenticationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;

    public AuthenticationMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
        _configuration = configuration;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/api/users/login") || context.Request.Path.StartsWithSegments("/api/users/register"))
        {
            await _next(context);
            return;
        }

        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (token == null)
        {
            if (!context.Response.HasStarted)
            {
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                var result = JsonSerializer.Serialize(new { status = context.Response.StatusCode, message = "Unauthorized. Token is missing." });
                await context.Response.WriteAsync(result);
            }
            return;
        }

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var claims = jwtToken.Claims.ToDictionary(c => c.Type, c => c.Value);

            context.Items["User"] = new 
            {
                Id = claims["Id"],
                FirstName = claims["FirstName"],
                LastName = claims["LastName"],
                Username = claims["Username"],
                Email = claims["Email"],
                PhoneNumber = claims["PhoneNumber"],
                CreatedAt = claims["CreatedAt"],
                RoleId = claims["RoleId"],
                RoleName = claims["RoleName"]
            };
        }
        catch
        {
            if (!context.Response.HasStarted)
            {
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                var result = JsonSerializer.Serialize(new { status = context.Response.StatusCode, message = "Invalid token or expired. Please log in again." });
                await context.Response.WriteAsync(result);
            }
        }

        await _next(context);
    }
}
