using Core.DTOs;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ApplicantSignupController : ControllerBase
    {
        private readonly IApplicantSignupService _service;
        private readonly IJobApplicationService _verificationService;

        public ApplicantSignupController(IApplicantSignupService service, IJobApplicationService verificationService)
        {
            _service = service;
            _verificationService = verificationService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Start([FromBody] ApplicantSignupStartDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.PhoneNumber))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<object>.Failure(new Error("BadRequest", "Email and phone number are required."), StatusCodes.Status400BadRequest));
            }

            try
            {
                await _service.StartAsync(dto);
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status409Conflict, Response<object>.Failure(new Error("Conflict", ex.Message), StatusCodes.Status409Conflict));
            }

            var sent = await _verificationService.SendVerificationCodeAsync(dto.Email);
            if (!sent)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, Response<object>.Failure(new Error("EmailFailure", "Failed to send verification code."), StatusCodes.Status500InternalServerError));
            }

            return StatusCode(StatusCodes.Status200OK, Response<object>.Success(null, StatusCodes.Status200OK));
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Verify([FromBody] VerifyEmailCodeRequest request)
        {
            if (!ModelState.IsValid)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantSignupSessionDto>.Failure(new Error("BadRequest", "Invalid request."), StatusCodes.Status400BadRequest));
            }

            try
            {
                var session = await _service.VerifyAsync(request);
                if (session == null)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantSignupSessionDto>.Failure(new Error("BadRequest", "Invalid verification code."), StatusCodes.Status400BadRequest));
                }

                return StatusCode(StatusCodes.Status200OK, Response<ApplicantSignupSessionDto>.Success(session, StatusCodes.Status200OK));
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantSignupSessionDto>.Failure(new Error("BadRequest", ex.Message), StatusCodes.Status400BadRequest));
            }
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Draft(string email, string verificationCode)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(verificationCode))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantSignupDraftDto>.Failure(new Error("BadRequest", "Email and verification code are required."), StatusCodes.Status400BadRequest));
            }

            var draft = await _service.GetDraftAsync(email, verificationCode);
            if (draft == null)
            {
                return StatusCode(StatusCodes.Status404NotFound, Response<ApplicantSignupDraftDto>.Failure(new Error("NotFound", "Signup draft not found."), StatusCodes.Status404NotFound));
            }

            return StatusCode(StatusCodes.Status200OK, Response<ApplicantSignupDraftDto>.Success(draft, StatusCodes.Status200OK));
        }

        [HttpPut]
        [AllowAnonymous]
        public async Task<IActionResult> Step2([FromBody] ApplicantSignupStep2Dto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.VerificationCode) || string.IsNullOrWhiteSpace(dto.FirstName))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantSignupDraftDto>.Failure(new Error("BadRequest", "Required fields are missing."), StatusCodes.Status400BadRequest));
            }

            try
            {
                var updated = await _service.SaveStep2Async(dto);
                return StatusCode(StatusCodes.Status200OK, Response<ApplicantSignupDraftDto>.Success(updated, StatusCodes.Status200OK));
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantSignupDraftDto>.Failure(new Error("BadRequest", ex.Message), StatusCodes.Status400BadRequest));
            }
        }

        [HttpPut]
        [AllowAnonymous]
        public async Task<IActionResult> Step3([FromBody] ApplicantSignupStep3Dto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.VerificationCode) || string.IsNullOrWhiteSpace(dto.ProfileHeadline))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantSignupDraftDto>.Failure(new Error("BadRequest", "Required fields are missing."), StatusCodes.Status400BadRequest));
            }

            try
            {
                var updated = await _service.SaveStep3Async(dto);
                return StatusCode(StatusCodes.Status200OK, Response<ApplicantSignupDraftDto>.Success(updated, StatusCodes.Status200OK));
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantSignupDraftDto>.Failure(new Error("BadRequest", ex.Message), StatusCodes.Status400BadRequest));
            }
        }

        [HttpPut]
        [AllowAnonymous]
        public async Task<IActionResult> Step4([FromBody] ApplicantSignupStep4Dto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.VerificationCode))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantSignupDraftDto>.Failure(new Error("BadRequest", "Required fields are missing."), StatusCodes.Status400BadRequest));
            }

            try
            {
                var updated = await _service.SaveStep4Async(dto);
                return StatusCode(StatusCodes.Status200OK, Response<ApplicantSignupDraftDto>.Success(updated, StatusCodes.Status200OK));
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantSignupDraftDto>.Failure(new Error("BadRequest", ex.Message), StatusCodes.Status400BadRequest));
            }
        }

        [HttpPut]
        [AllowAnonymous]
        public async Task<IActionResult> Step5([FromBody] ApplicantSignupStep5Dto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.VerificationCode) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantSignupDraftDto>.Failure(new Error("BadRequest", "Required fields are missing."), StatusCodes.Status400BadRequest));
            }

            try
            {
                var updated = await _service.SaveStep5Async(dto);
                return StatusCode(StatusCodes.Status200OK, Response<ApplicantSignupDraftDto>.Success(updated, StatusCodes.Status200OK));
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ApplicantSignupDraftDto>.Failure(new Error("BadRequest", ex.Message), StatusCodes.Status400BadRequest));
            }
        }
    }
}
