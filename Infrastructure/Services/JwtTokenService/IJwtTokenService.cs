using Core.DTOs;
using Core.Enums;

namespace Infrastructure.Services;

public interface IJwtTokenService
{
    AuthRespDto GenerateToken(string username, string? displayName, params Roles[] role);
}
