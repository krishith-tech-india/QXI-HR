using Core.DTOs;
using Core.DTOs.Common;
using Core.Enums;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImageCategoriesController : ControllerBase
    {
        private readonly IImageCategoryService _service;

        public ImageCategoriesController(IImageCategoryService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<Response<IEnumerable<ImageCategoryDTO>>>> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(Response<IEnumerable<ImageCategoryDTO>>.Success(list, 200));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Response<ImageCategoryDTO>>> GetById(int id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto == null)
            {
                return NotFound(Response<ImageCategoryDTO>.Failure(new Error("NotFound", "ImageCategory not found."), 404));
            }
            return Ok(Response<ImageCategoryDTO>.Success(dto, 200));
        }

        [Authorize(Roles = $"{nameof(Roles.Admin)}")]
        [HttpPost]
        public async Task<ActionResult<Response<ImageCategoryDTO>>> Create(ImageCategoryDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(Response<ImageCategoryDTO>.Failure(new Error("BadRequest", "Payload is null."), 400));
            }

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, Response<ImageCategoryDTO>.Success(created, 201));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<Response<ImageCategoryDTO>>> Update(int id, ImageCategoryDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(Response<ImageCategoryDTO>.Failure(new Error("BadRequest", "Payload is null."), 400));
            }

            if (dto.Id != 0 && dto.Id != id)
            {
                return BadRequest(Response<ImageCategoryDTO>.Failure(new Error("BadRequest", "Id mismatch."), 400));
            }

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null)
            {
                return NotFound(Response<ImageCategoryDTO>.Failure(new Error("NotFound", "ImageCategory not found."), 404));
            }

            return Ok(Response<ImageCategoryDTO>.Success(updated, 200));
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Response<object>>> Delete(int id)
        {
            var removed = await _service.DeleteAsync(id);
            if (!removed)
            {
                return NotFound(Response<object>.Failure(new Error("NotFound", "ImageCategory not found."), 404));
            }

            return StatusCode(204, Response<object>.Success(null, 204));
        }
    }
}