using Core.DTOs;
using Core.Enums;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class ImageCategoriesController : ControllerBase
    {
        private readonly IImageCategoryService _service;

        public ImageCategoriesController(IImageCategoryService service) => _service = service;

        [HttpPost]
        public async Task<IActionResult> GetAll(RequestParams requestParams)
        {
            var responce = await _service.GetAllAsync(requestParams);
            return StatusCode(StatusCodes.Status200OK, responce);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ImageCategoryDTO>.Failure(new Error("NotFound", "ImageCategory not found."), StatusCodes.Status400BadRequest));
            }
            return StatusCode(StatusCodes.Status200OK, Response<ImageCategoryDTO>.Success(dto, StatusCodes.Status200OK));
        }

        [Authorize(Roles = $"{nameof(Roles.Admin)}")]
        [HttpPost]
        public async Task<IActionResult> Create(ImageCategoryDTO dto)
        {
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ImageCategoryDTO>.Failure(new Error("BadRequest", "Payload is null."), StatusCodes.Status400BadRequest));
            }

            var created = await _service.CreateAsync(dto);
            return StatusCode(StatusCodes.Status201Created, Response<ImageCategoryDTO>.Success(created, StatusCodes.Status201Created));
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, ImageCategoryDTO dto)
        {
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ImageCategoryDTO>.Failure(new Error("BadRequest", "Payload is null."), StatusCodes.Status400BadRequest));
            }

            if (dto.Id != 0 && dto.Id != id)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ImageCategoryDTO>.Failure(new Error("BadRequest", "Id mismatch."), StatusCodes.Status400BadRequest));
            }

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ImageCategoryDTO>.Failure(new Error("NotFound", "ImageCategory not found."), StatusCodes.Status400BadRequest));
            }

            return StatusCode(StatusCodes.Status200OK, Response<ImageCategoryDTO>.Success(updated, StatusCodes.Status200OK));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var removed = await _service.DeleteAsync(id);
            if (!removed)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<object>.Failure(new Error("NotFound", "ImageCategory not found."), StatusCodes.Status400BadRequest));
            }

            return StatusCode(StatusCodes.Status200OK, Response<object>.Success(null, StatusCodes.Status200OK));
        }
    }
}