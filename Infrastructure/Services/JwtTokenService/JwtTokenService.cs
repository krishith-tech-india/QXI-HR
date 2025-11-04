using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Core.DTOs;
using Core.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Services;

public class JwtTokenService: IJwtTokenService
{
    private readonly IConfiguration _config;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public JwtTokenService(
                    IConfiguration config,
                    IHttpContextAccessor httpContextAccessor
                )
    {
        _config = config;
        _httpContextAccessor = httpContextAccessor;
    }

    public AuthRespDto GenerateToken(string username, params Roles[] roles)
    {
        var appSettings = _config.GetSection("AppSettings");
        var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(appSettings["SecurityKey"]!));

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, username),
        };

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role.ToString()));
        }

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var httpContext = _httpContextAccessor.HttpContext;
        var requestOrigin = httpContext?.Request.Headers["Origin"].ToString();

        // Fallback if no Origin header (like in Swagger or direct API calls)
        var audience = !string.IsNullOrEmpty(requestOrigin)
            ? requestOrigin.TrimEnd('/')
            : appSettings["APIUrl"];
        
        var token = new JwtSecurityToken(
            issuer: appSettings["APIUrl"],
            audience: audience, // how to set valic audiance here?
            claims: claims,
            expires: DateTime.UtcNow.AddHours(double.Parse(appSettings["TokenExpiryHours"] ?? "1")),
            signingCredentials: creds
        );

        return new AuthRespDto { Token = new JwtSecurityTokenHandler().WriteToken(token), Role = string.Join(",", roles.Select(r => r.ToString()))};
    }
}
