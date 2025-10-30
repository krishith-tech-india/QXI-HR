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
            return StatusCode(StatusCodes.Status200OK, Response<IEnumerable<GallaryImageDTO>>.Success(list, StatusCodes.Status200OK));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Response<GallaryImageDTO>>> GetById(int id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<GallaryImageDTO>.Failure(new Error("NotFound", "GallaryImage not found."), StatusCodes.Status400BadRequest));
            }
            return StatusCode(StatusCodes.Status200OK, Response<GallaryImageDTO>.Success(dto, StatusCodes.Status200OK));
        }

        [HttpGet("ByCategory/{categoryId:int}")]
        public async Task<ActionResult<Response<IEnumerable<GallaryImageDTO>>>> GetByCategory(int categoryId)
        {
            var list = await _service.GetByCategoryAsync(categoryId);
            return StatusCode(StatusCodes.Status200OK, Response<IEnumerable<GallaryImageDTO>>.Success(list, StatusCodes.Status200OK));
        }

        [HttpPost]
        public async Task<ActionResult<Response<GallaryImageDTO>>> Create(GallaryImageDTO dto)
        {
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<GallaryImageDTO>.Failure(new Error("BadRequest", "Payload is null."), StatusCodes.Status400BadRequest));
            }

            var created = await _service.CreateAsync(dto);
            return StatusCode(StatusCodes.Status201Created, Response<GallaryImageDTO>.Success(created, StatusCodes.Status201Created));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<Response<GallaryImageDTO>>> Update(int id, GallaryImageDTO dto)
        {
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<GallaryImageDTO>.Failure(new Error("BadRequest", "Payload is null."), StatusCodes.Status400BadRequest));
            }

            if (dto.Id != 0 && dto.Id != id)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<GallaryImageDTO>.Failure(new Error("BadRequest", "Id mismatch."), StatusCodes.Status400BadRequest));
            }

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<GallaryImageDTO>.Failure(new Error("NotFound", "GallaryImage not found."), StatusCodes.Status400BadRequest));
            }

            return StatusCode(StatusCodes.Status200OK, Response<GallaryImageDTO>.Success(updated, StatusCodes.Status200OK));
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Response<object>>> Delete(int id)
        {
            var removed = await _service.DeleteAsync(id);
            if (!removed)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<object>.Failure(new Error("NotFound", "GallaryImage not found."), StatusCodes.Status400BadRequest));
            }

            return StatusCode(StatusCodes.Status200OK, Response<object>.Success(null, StatusCodes.Status200OK));
        }
    }
}