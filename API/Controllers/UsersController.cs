using Core.DTOs;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]/[Action]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _service;

        public UsersController(IUserService service) => _service = service;

        [HttpPost]
        public async Task<IActionResult> GetAll(RequestParams requestParams)
        {
            var response = await _service.GetAllAsync(requestParams);
            return StatusCode(StatusCodes.Status200OK, response);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIUserDTO>.Failure(new Error("NotFound", "User not found."), StatusCodes.Status400BadRequest));
            }
            return StatusCode(StatusCodes.Status200OK, Response<QXIUserDTO>.Success(dto, StatusCodes.Status200OK));
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(QXIUserDTO dto)
        {
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIUserDTO>.Failure(new Error("BadRequest", "Payload is null."), StatusCodes.Status400BadRequest));
            }

            var created = await _service.CreateAsync(dto);
            return StatusCode(StatusCodes.Status201Created, Response<QXIUserDTO>.Success(created, StatusCodes.Status201Created));
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, QXIUserDTO dto)
        {
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIUserDTO>.Failure(new Error("BadRequest", "Payload is null."), StatusCodes.Status400BadRequest));
            }

            if (dto.Id != 0 && dto.Id != id)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIUserDTO>.Failure(new Error("BadRequest", "Id mismatch."), StatusCodes.Status400BadRequest));
            }

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIUserDTO>.Failure(new Error("NotFound", "User not found."), StatusCodes.Status400BadRequest));
            }

            return StatusCode(StatusCodes.Status200OK, Response<QXIUserDTO>.Success(updated, StatusCodes.Status200OK));
        }

        [HttpPut]
        [Authorize(Roles = "Admin,Applicant")]
        public async Task<IActionResult> UpdateMyProfile(QXIUserDTO dto)
        {
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIUserDTO>.Failure(new Error("BadRequest", "Payload is null."), StatusCodes.Status400BadRequest));
            }

            var email = HttpContext?.User?.Identity?.Name;
            if (string.IsNullOrWhiteSpace(email))
            {
                return StatusCode(StatusCodes.Status401Unauthorized, Response<QXIUserDTO>.Failure(new Error("Unauthorized", "Invalid user."), StatusCodes.Status401Unauthorized));
            }

            var user = await _service.GetByEmailAsync(email);
            if (user == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIUserDTO>.Failure(new Error("BadRequest", "User not found."), StatusCodes.Status400BadRequest));
            }

            if (dto.Id != 0 && dto.Id != user.Id)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIUserDTO>.Failure(new Error("BadRequest", "Id mismatch."), StatusCodes.Status400BadRequest));
            }

            // Prevent applicants from updating roles via this endpoint.
            if (!User.IsInRole("Admin"))
            {
                dto.RoleIds = null;
            }

            var updated = await _service.UpdateAsync(user.Id, dto);
            if (updated == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIUserDTO>.Failure(new Error("NotFound", "User not found."), StatusCodes.Status400BadRequest));
            }

            return StatusCode(StatusCodes.Status200OK, Response<QXIUserDTO>.Success(updated, StatusCodes.Status200OK));
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var removed = await _service.DeleteAsync(id);
            if (!removed)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<object>.Failure(new Error("NotFound", "User not found."), StatusCodes.Status400BadRequest));
            }

            return StatusCode(StatusCodes.Status200OK, Response<object>.Success(null, StatusCodes.Status200OK));
        }
    }
}
