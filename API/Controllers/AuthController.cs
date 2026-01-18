using System.Collections.Generic;
using Core.DTOs;
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
        private readonly IRoleService _roleService;
        private readonly IApplicantProfileService _applicantProfileService;

        public AuthController(IJwtTokenService jwtService, IUserService userService, IRoleService roleService, IApplicantProfileService applicantProfileService)
        {
            _jwtService = jwtService;
            _userService = userService;
            _roleService = roleService;
            _applicantProfileService = applicantProfileService;
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

            var displayName = string.Join(" ", new[] { user.FirstName, user.LastName }.Where(value => !string.IsNullOrWhiteSpace(value)));
            var auth = _jwtService.GenerateToken(request.UsernameOrEmail, displayName, [..user.Roles.Select(x=> x.Role)]);

            return StatusCode(StatusCodes.Status200OK, Response<AuthRespDto>.Success(auth, 200));
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterApplicant([FromBody] ApplicantSignupDto request)
        {
            if (request == null ||
                string.IsNullOrWhiteSpace(request.FirstName) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.PhoneNumber) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                request.Profile == null ||
                string.IsNullOrWhiteSpace(request.Profile.ProfileHeadline))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<AuthRespDto>.Failure(new Error("BadRequest", "Required fields are missing."), StatusCodes.Status400BadRequest));
            }

            if (await _userService.EmailOrPhoneExistsAsync(request.Email, request.PhoneNumber))
            {
                return StatusCode(StatusCodes.Status409Conflict, Response<AuthRespDto>.Failure(new Error("Conflict", "Email or phone number already exists."), StatusCodes.Status409Conflict));
            }

            var roleParams = new RequestParams
            {
                Page = 1,
                PageSize = 10,
                Filters = new List<CommonFilterParams>
                {
                    new() { FieldName = "RoleName", Value = Roles.Applicant.ToString(), Operator = "Equals" }
                }
            };

            var rolesResponse = await _roleService.GetAllAsync(roleParams);
            var applicantRole = rolesResponse.Data?.FirstOrDefault();
            if (applicantRole == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<AuthRespDto>.Failure(new Error("BadRequest", "Applicant role not found."), StatusCodes.Status400BadRequest));
            }

            var createDto = new QXIUserDTO
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Password = request.Password,
                IsPublic = true,
                RoleIds = new List<int> { applicantRole.Id },
                SkillIds = request.SkillIds
            };

            var created = await _userService.CreateAsync(createDto);
            await _applicantProfileService.UpsertAsync(created.Id, request.Profile);
            var displayName = string.Join(" ", new[] { request.FirstName, request.LastName }.Where(value => !string.IsNullOrWhiteSpace(value)));
            var auth = _jwtService.GenerateToken(created.Email ?? request.Email, displayName, Roles.Applicant);

            return StatusCode(StatusCodes.Status201Created, Response<AuthRespDto>.Success(auth, StatusCodes.Status201Created));
        }
    }
}
