using Core;
using Core.DTOs;
using Core.DTOs.Common;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Options;

namespace API.Filters
{
    public class AuthorizationFilter : Attribute, IAuthorizationFilter, IAsyncAuthorizationFilter
    {
        private readonly AppSettings _appSettings;

        public AuthorizationFilter(IOptions<AppSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            AuthorizeTokenAsync(context).Wait();
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            await AuthorizeTokenAsync(context);
        }

        private async Task AuthorizeTokenAsync(AuthorizationFilterContext context)
        {
            try
            {
                var unauthorizedResult = new ObjectResult(
                                                            Response<object>.Failure(
                                                                new Error("Authorizaion Failed", "Invalid Token"),
                                                                401
                                                            ))
                {
                    StatusCode = 401,
                };

                var authHeader = context.HttpContext?.Request?.Headers.Authorization.ToString();

                if (string.IsNullOrEmpty(authHeader))
                {
                    context.Result = unauthorizedResult;
                }

                var token = await authHeader?.Replace("Bearer ", string.Empty, StringComparison.OrdinalIgnoreCase)
                                                              .ValidateToken(_appSettings.ClientList, _appSettings.APIUrl, _appSettings.SecurityKey)!;

                if (token == null || !token.IsValid)
                {
                    context.Result = unauthorizedResult;
                }
                else
                {
                    context.HttpContext.User = new System.Security.Claims.ClaimsPrincipal(token?.ClaimsIdentity);
                }


            }
            catch (APIException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new Exception("Authorization failed", ex);
            }
        }

    }
}
