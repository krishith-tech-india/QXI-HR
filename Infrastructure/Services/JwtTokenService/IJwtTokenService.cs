using Core.DTOs.Common;
using Core.Enums;

namespace Infrastructure.Services;

public interface IJwtTokenService
{
    AuthRespDto GenerateToken(string username, Roles role);
}
