using Core.DTOs;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class JobApplicationsController : ControllerBase
    {
        private readonly IJobApplicationService _service;

        public JobApplicationsController(IJobApplicationService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> SendVerificationCode(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<object>.Failure(new Error("BadRequest", "Email is required."), StatusCodes.Status400BadRequest));
            }

            var sent = await _service.SendVerificationCodeAsync(email);
            if (!sent)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, Response<object>.Failure(new Error("EmailFailure", "Failed to send verification code."), StatusCodes.Status500InternalServerError));
            }

            return StatusCode(StatusCodes.Status200OK, Response<object>.Success(null, StatusCodes.Status200OK));
        }
        
        [HttpPost]
        public async Task<IActionResult> SendEMailContactMessage(MailContactMessageDto messageDto)
        {
            if (string.IsNullOrWhiteSpace(messageDto.Name) || string.IsNullOrWhiteSpace(messageDto.Email) ||
                    string.IsNullOrWhiteSpace(messageDto.Subject) || string.IsNullOrWhiteSpace(messageDto.PhoneNo) ||
                    string.IsNullOrWhiteSpace(messageDto.Message) || string.IsNullOrWhiteSpace(messageDto.Comapny))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<object>.Failure(new Error("BadRequest", "All required Fields are not filled."), StatusCodes.Status400BadRequest));
            }

            var sent = await _service.SendEMailContactMessage(messageDto);
            if (!sent)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, Response<object>.Failure(new Error("EmailFailure", "Failed to send verification code."), StatusCodes.Status500InternalServerError));
            }

            return StatusCode(StatusCodes.Status200OK, Response<object>.Success(null, StatusCodes.Status200OK));
        }

        [HttpPost]
        public async Task<IActionResult> GetAll(RequestParams dto)
        {
            var response = await _service.GetAllAsync(dto);
            return StatusCode(StatusCodes.Status200OK, response);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<JobApplicationDTO>.Failure(new Error("NotFound", "JobApplication not found."), StatusCodes.Status400BadRequest));
            }
            return StatusCode(StatusCodes.Status200OK, Response<JobApplicationDTO>.Success(dto, StatusCodes.Status200OK));
        }

        [HttpGet("ByJob/{jobPostId:int}")]
        public async Task<IActionResult> GetByJobPost(int jobPostId)
        {
            var list = await _service.GetByJobPostIdAsync(jobPostId);
            return StatusCode(StatusCodes.Status200OK, Response<IEnumerable<JobApplicationDTO>>.Success(list, StatusCodes.Status200OK));
        }

        [HttpPost]
        public async Task<IActionResult> Create(JobApplicationDTO dto)
        {
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<JobApplicationDTO>.Failure(new Error("BadRequest", "Payload is null."), StatusCodes.Status400BadRequest));
            }

            var created = await _service.CreateAsync(dto);
            return StatusCode(StatusCodes.Status201Created, Response<JobApplicationDTO>.Success(created, StatusCodes.Status201Created));
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, JobApplicationDTO dto)
        {
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<JobApplicationDTO>.Failure(new Error("BadRequest", "Payload is null."), StatusCodes.Status400BadRequest));
            }

            if (dto.Id != 0 && dto.Id != id)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<JobApplicationDTO>.Failure(new Error("BadRequest", "Id mismatch."), StatusCodes.Status400BadRequest));
            }

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<JobApplicationDTO>.Failure(new Error("NotFound", "JobApplication not found."), StatusCodes.Status400BadRequest));
            }

            return StatusCode(StatusCodes.Status200OK, Response<JobApplicationDTO>.Success(updated, StatusCodes.Status200OK));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var removed = await _service.DeleteAsync(id);
            if (!removed)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<object>.Failure(new Error("NotFound", "JobApplication not found."), StatusCodes.Status400BadRequest));
            }

            return StatusCode(StatusCodes.Status200OK, Response<object>.Success(null, StatusCodes.Status200OK));
        }

        [HttpGet]
        public async Task<IActionResult> GetUploadUrl(string filename)
        {
            if (string.IsNullOrWhiteSpace(filename))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ResumePresignedUrlDto>.Failure(new Error("NotFound", "JobApplication not found."), StatusCodes.Status400BadRequest));
            }

            var preSignedUrlDto = await _service.GetUploadUrl(filename);

            return StatusCode(StatusCodes.Status200OK, Response<ResumePresignedUrlDto>.Success(preSignedUrlDto, StatusCodes.Status200OK));
        }

        [HttpPost]
        public async Task<IActionResult> CheckApplicationExist(JobApplicationDTO dto)
        {
            return StatusCode(StatusCodes.Status200OK, Response<bool>.Success(await _service.CheckApplicationExist(dto), StatusCodes.Status200OK));
        }

        [HttpPost]
        public async Task<IActionResult> VerifyEmailCode([FromBody] VerifyEmailCodeRequest request)
        {
            if (!ModelState.IsValid)
            {
                return StatusCode(StatusCodes.Status400BadRequest, 
                    Response<bool>.Failure(new Error("BadRequest", "Invalid request. Email and verification code are required."), 
                    StatusCodes.Status400BadRequest));
            }

            var isValid = await _service.VerifyEmailCodeAsync(request.Email, request.VerificationCode);
            return StatusCode(StatusCodes.Status200OK, Response<bool>.Success(isValid, StatusCodes.Status200OK));
        }
    }
}