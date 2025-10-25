using Core.DTOs;
using Core.DTOs.Common;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GallaryImagesController : ControllerBase
    {
        private readonly IGallaryImageService _service;

        public GallaryImagesController(IGallaryImageService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<Response<IEnumerable<GallaryImageDTO>>>> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(Response<IEnumerable<GallaryImageDTO>>.Success(list, 200));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Response<GallaryImageDTO>>> GetById(int id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto == null)
            {
                return NotFound(Response<GallaryImageDTO>.Failure(new Error("NotFound", "GallaryImage not found."), 400));
            }
            return Ok(Response<GallaryImageDTO>.Success(dto, 200));
        }

        [HttpGet("ByCategory/{categoryId:int}")]
        public async Task<ActionResult<Response<IEnumerable<GallaryImageDTO>>>> GetByCategory(int categoryId)
        {
            var list = await _service.GetByCategoryAsync(categoryId);
            return Ok(Response<IEnumerable<GallaryImageDTO>>.Success(list, 200));
        }

        [HttpPost]
        public async Task<ActionResult<Response<GallaryImageDTO>>> Create(GallaryImageDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(Response<GallaryImageDTO>.Failure(new Error("BadRequest", "Payload is null."), 400));
            }

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, Response<GallaryImageDTO>.Success(created, 201));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<Response<GallaryImageDTO>>> Update(int id, GallaryImageDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(Response<GallaryImageDTO>.Failure(new Error("BadRequest", "Payload is null."), 400));
            }

            if (dto.Id != 0 && dto.Id != id)
            {
                return BadRequest(Response<GallaryImageDTO>.Failure(new Error("BadRequest", "Id mismatch."), 400));
            }

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null)
            {
                return NotFound(Response<GallaryImageDTO>.Failure(new Error("NotFound", "GallaryImage not found."), 404));
            }

            return Ok(Response<GallaryImageDTO>.Success(updated, 200));
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Response<object>>> Delete(int id)
        {
            var removed = await _service.DeleteAsync(id);
            if (!removed)
            {
                return NotFound(Response<object>.Failure(new Error("NotFound", "GallaryImage not found."), 404));
            }

            return StatusCode(200, Response<object>.Success(id, 200));
        }
    }
}