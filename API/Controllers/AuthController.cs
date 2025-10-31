using Core.DTOs.Common;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IJwtTokenService _jwtService;
        private readonly IUserService _userService;

        public AuthController(IJwtTokenService jwtService, IUserService userService)
        {
            _jwtService = jwtService;
            _userService = userService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthRequestDto request)
        {
            //Validate username/Email and password 
            var user = await _userService.AuthenticateUser(request);

            if (user == null)
                return StatusCode(StatusCodes.Status401Unauthorized, Response<AuthRespDto>.Failure(new Error("StatusCode", "Username or password are incorrect."), StatusCodes.Status401Unauthorized));

            if (user.Roles == null || user.Roles.Count <= 0)
                return StatusCode(StatusCodes.Status401Unauthorized, Response<AuthRespDto>.Failure(new Error("StatusCode", "Roles are not assigned to user."), StatusCodes.Status401Unauthorized));

            var auth = _jwtService.GenerateToken(request.UsernameOrEmail, [..user.Roles.Select(x=> x.Role)]);

            return StatusCode(StatusCodes.Status200OK, Response<AuthRespDto>.Success(auth, 200));
        }
    }
}
