using Core.DTOs;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _service;

        public ClientsController(IClientService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> GetAll(RequestParams requestParams)
        {
            var response = await _service.GetAllAsync(requestParams);
            return StatusCode(StatusCodes.Status200OK, response);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> Create(ClientDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.LogoUrl))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ClientDTO>.Failure(new Error("BadRequest", "Logo is required."), StatusCodes.Status400BadRequest));
            }

            var created = await _service.CreateAsync(dto);
            return StatusCode(StatusCodes.Status201Created, Response<ClientDTO>.Success(created, StatusCodes.Status201Created));
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> Delete(int id)
        {
            var removed = await _service.DeleteAsync(id);
            if (!removed)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<object>.Failure(new Error("NotFound", "Client not found."), StatusCodes.Status400BadRequest));
            }

            return StatusCode(StatusCodes.Status200OK, Response<object>.Success(null, StatusCodes.Status200OK));
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Staff")]
        public async Task<IActionResult> GetUploadUrl(string filename)
        {
            if (string.IsNullOrWhiteSpace(filename))
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<ResumePresignedUrlDto>.Failure(new Error("BadRequest", "Filename is required."), StatusCodes.Status400BadRequest));
            }

            var preSignedUrlDto = await _service.GetUploadUrl(filename);

            return StatusCode(StatusCodes.Status200OK, Response<ResumePresignedUrlDto>.Success(preSignedUrlDto, StatusCodes.Status200OK));
        }
    }
}
