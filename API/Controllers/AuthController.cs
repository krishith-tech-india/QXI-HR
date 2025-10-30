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

        public AuthController(IJwtTokenService jwtService)
        {
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthRequestDto request)
        {
            

            //Validate username/Email and password 
            
            //Get user by email or username 

            
            //Fetch user roles

            //Genearte token
            // Dummy validation
            if (request.UsernameOrEmail == "admin" && request.Password == "1234")
            {
                var token = _jwtService.GenerateToken(request.UsernameOrEmail, Roles.Admin);
                return Ok(new { token });
            }

            if (request.UsernameOrEmail == "user" && request.Password == "1234")
            {
                var token = _jwtService.GenerateToken(request.UsernameOrEmail, Roles.Staff);
                return Ok(new { token });
            }

            return Unauthorized();
        }
    }
}
