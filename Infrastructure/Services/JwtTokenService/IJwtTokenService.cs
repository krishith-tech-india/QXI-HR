using Core.DTOs;
using Core.Enums;

namespace Infrastructure.Services;

public interface IJwtTokenService
{
    AuthRespDto GenerateToken(string username, string? displayName, string? profilePictureUrl, params Roles[] role);
}
