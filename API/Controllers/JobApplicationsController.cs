using Core.DTOs;
using Core.DTOs.Common;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobApplicationsController : ControllerBase
    {
        private readonly IJobApplicationService _service;

        public JobApplicationsController(IJobApplicationService service) => _service = service;

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
    }
}