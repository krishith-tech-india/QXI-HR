using Core.DTOs;
using Core.DTOs.Common;
using Infrastructure.Services;
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
                var errors = new List<Error> { new Error { Message = "NotFound", Description = "ImageCategory not found." } };
                return NotFound(Response<ImageCategoryDTO>.Failue(errors, 404));
            }
            return Ok(Response<ImageCategoryDTO>.Success(dto, 200));
        }

        [HttpPost]
        public async Task<ActionResult<Response<ImageCategoryDTO>>> Create(ImageCategoryDTO dto)
        {
            if (dto == null)
            {
                var errors = new List<Error> { new Error { Message = "BadRequest", Description = "Payload is null." } };
                return BadRequest(Response<ImageCategoryDTO>.Failue(errors, 400));
            }

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, Response<ImageCategoryDTO>.Success(created, 201));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<Response<ImageCategoryDTO>>> Update(int id, ImageCategoryDTO dto)
        {
            if (dto == null)
            {
                var errors = new List<Error> { new Error { Message = "BadRequest", Description = "Payload is null." } };
                return BadRequest(Response<ImageCategoryDTO>.Failue(errors, 400));
            }

            if (dto.Id != 0 && dto.Id != id)
            {
                var errors = new List<Error> { new Error { Message = "BadRequest", Description = "Id mismatch." } };
                return BadRequest(Response<ImageCategoryDTO>.Failue(errors, 400));
            }

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null)
            {
                var errors = new List<Error> { new Error { Message = "NotFound", Description = "ImageCategory not found." } };
                return NotFound(Response<ImageCategoryDTO>.Failue(errors, 404));
            }

            return Ok(Response<ImageCategoryDTO>.Success(updated, 200));
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Response<object>>> Delete(int id)
        {
            var removed = await _service.DeleteAsync(id);
            if (!removed)
            {
                var errors = new List<Error> { new Error { Message = "NotFound", Description = "ImageCategory not found." } };
                return NotFound(Response<object>.Failue(errors, 404));
            }

            return StatusCode(204, Response<object>.Success(null, 204));
        }
    }
}