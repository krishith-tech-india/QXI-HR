using Core.Enums;

namespace Infrastructure.Services;

public interface IJwtTokenService
{
    string GenerateToken(string username, Roles role);
}
