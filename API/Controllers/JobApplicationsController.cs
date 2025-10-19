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

        [HttpGet]
        public async Task<ActionResult<Response<IEnumerable<JobApplicationDTO>>>> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(Response<IEnumerable<JobApplicationDTO>>.Success(list, 200));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Response<JobApplicationDTO>>> GetById(int id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto == null)
            {
                var errors = new List<Error> { new Error { Message = "NotFound", Description = "JobApplication not found." } };
                return NotFound(Response<JobApplicationDTO>.Failue(errors, 404));
            }
            return Ok(Response<JobApplicationDTO>.Success(dto, 200));
        }

        [HttpGet("ByJob/{jobPostId:int}")]
        public async Task<ActionResult<Response<IEnumerable<JobApplicationDTO>>>> GetByJobPost(int jobPostId)
        {
            var list = await _service.GetByJobPostIdAsync(jobPostId);
            return Ok(Response<IEnumerable<JobApplicationDTO>>.Success(list, 200));
        }

        [HttpPost]
        public async Task<ActionResult<Response<JobApplicationDTO>>> Create(JobApplicationDTO dto)
        {
            if (dto == null)
            {
                var errors = new List<Error> { new Error { Message = "BadRequest", Description = "Payload is null." } };
                return BadRequest(Response<JobApplicationDTO>.Failue(errors, 400));
            }

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, Response<JobApplicationDTO>.Success(created, 201));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<Response<JobApplicationDTO>>> Update(int id, JobApplicationDTO dto)
        {
            if (dto == null)
            {
                var errors = new List<Error> { new Error { Message = "BadRequest", Description = "Payload is null." } };
                return BadRequest(Response<JobApplicationDTO>.Failue(errors, 400));
            }

            if (dto.Id != 0 && dto.Id != id)
            {
                var errors = new List<Error> { new Error { Message = "BadRequest", Description = "Id mismatch." } };
                return BadRequest(Response<JobApplicationDTO>.Failue(errors, 400));
            }

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null)
            {
                var errors = new List<Error> { new Error { Message = "NotFound", Description = "JobApplication not found." } };
                return NotFound(Response<JobApplicationDTO>.Failue(errors, 404));
            }

            return Ok(Response<JobApplicationDTO>.Success(updated, 200));
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Response<object>>> Delete(int id)
        {
            var removed = await _service.DeleteAsync(id);
            if (!removed)
            {
                var errors = new List<Error> { new Error { Message = "NotFound", Description = "JobApplication not found." } };
                return NotFound(Response<object>.Failue(errors, 404));
            }

            return StatusCode(204, Response<object>.Success(null, 204));
        }
    }
}