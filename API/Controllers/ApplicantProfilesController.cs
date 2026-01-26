using Core.DTOs;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ApplicantProfilesController : ControllerBase
    {
        private readonly IApplicantProfileService _service;

        public ApplicantProfilesController(IApplicantProfileService service)
        {
            _service = service;
        }

        [HttpGet("{userId:int}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var profile = await _service.GetByUserIdAsync(userId);
            if (profile == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, Response<ApplicantProfileDto>.Failure(new Error("NotFound", "Profile not found."), StatusCodes.Status404NotFound));
            }

            return StatusCode(StatusCodes.Status200OK, Response<ApplicantProfileDto>.Success(profile, StatusCodes.Status200OK));
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Applicant")]
        public async Task<IActionResult> GetMyProfile()
        {
            var email = HttpContext?.User?.Identity?.Name;
            if (string.IsNullOrWhiteSpace(email))
            {
                return StatusCode(StatusCodes.Status401Unauthorized, Response<ApplicantProfileDto>.Failure(new Error("Unauthorized", "Invalid user."), StatusCodes.Status401Unauthorized));
            }

            var profile = await _service.GetByEmailAsync(email);
            if (profile == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, Response<ApplicantProfileDto>.Failure(new Error("NotFound", "Profile not found."), StatusCodes.Status404NotFound));
            }

            return StatusCode(StatusCodes.Status200OK, Response<ApplicantProfileDto>.Success(profile, StatusCodes.Status200OK));
        }

        [HttpPut("{userId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Upsert(int userId, [FromBody] ApplicantProfileUpsertDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.ProfileHeadline))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantProfileDto>.Failure(new Error("BadRequest", "Profile headline is required."), StatusCodes.Status400BadRequest));
            }

            var profile = await _service.UpsertAsync(userId, dto);
            return StatusCode(StatusCodes.Status200OK, Response<ApplicantProfileDto>.Success(profile, StatusCodes.Status200OK));
        }

        [HttpPut]
        [Authorize(Roles = "Admin, Applicant")]
        public async Task<IActionResult> UpdateMyProfile([FromBody] ApplicantProfileUpsertDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.ProfileHeadline))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantProfileDto>.Failure(new Error("BadRequest", "Profile headline is required."), StatusCodes.Status400BadRequest));
            }

            var email = HttpContext?.User?.Identity?.Name;
            if (string.IsNullOrWhiteSpace(email))
            {
                return StatusCode(StatusCodes.Status401Unauthorized, Response<ApplicantProfileDto>.Failure(new Error("Unauthorized", "Invalid user."), StatusCodes.Status401Unauthorized));
            }

            var userId = await _service.GetUserIdByEmailAsync(email);
            if (userId == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, Response<ApplicantProfileDto>.Failure(new Error("NotFound", "Profile not found."), StatusCodes.Status404NotFound));
            }

            var updated = await _service.UpsertAsync(userId.Value, dto);
            return StatusCode(StatusCodes.Status200OK, Response<ApplicantProfileDto>.Success(updated, StatusCodes.Status200OK));
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetUploadUrl(string filename, string category)
        {
            if (string.IsNullOrWhiteSpace(filename))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ResumePresignedUrlDto>.Failure(new Error("BadRequest", "Filename is required."), StatusCodes.Status400BadRequest));
            }

            var preSignedUrlDto = await _service.GetUploadUrl(filename, category);
            return StatusCode(StatusCodes.Status200OK, Response<ResumePresignedUrlDto>.Success(preSignedUrlDto, StatusCodes.Status200OK));
        }
    }
}
