using Core.DTOs.Common;
using Core.Enums;
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
        public async ActionResult<Response<AuthRespDto>> Login([FromBody] AuthRequestDto request)
        {


            //Validate username/Email and password 
            var user = await _userService.AuthenticateUser(request);

            if (user == null)
                return Unauthorized(Response<AuthRespDto>.Failure(new Error("Unauthorized", "Username or password are incorrect."), StatusCodes.Status401Unauthorized));


            var userRole = user.UserRoles.FirstOrDefault();

            if (userRole == null)
                return Unauthorized(Response<AuthRespDto>.Failure(new Error("Unauthorized", "Roles are not assigned to user."), StatusCodes.Status401Unauthorized));

            // Dummy validation
            var auth = _jwtService.GenerateToken(request.UsernameOrEmail, Roles.Admin);

            return Ok(Response<AuthRespDto>.Success(auth, 200));
        }
    }
}
