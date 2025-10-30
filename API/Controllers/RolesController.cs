using Core.DTOs;
using Core.DTOs.Common;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _service;

        public RolesController(IRoleService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _service.GetAllAsync();
            return StatusCode(StatusCodes.Status200OK, Response<IEnumerable<QXIRoleDTO>>.Success(list, StatusCodes.Status200OK));
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIRoleDTO>.Failure(new Error("NotFound", "Role not found."), StatusCodes.Status400BadRequest));
            }
            return StatusCode(StatusCodes.Status200OK, Response<QXIRoleDTO>.Success(dto, StatusCodes.Status200OK));
        }

        [HttpPost]
        public async Task<IActionResult> Create(QXIRoleDTO dto)
        {
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIRoleDTO>.Failure(new Error("BadRequest", "Payload is null."), StatusCodes.Status400BadRequest));
            }

            var created = await _service.CreateAsync(dto);
            return StatusCode(StatusCodes.Status201Created, Response<QXIRoleDTO>.Success(created, StatusCodes.Status201Created));
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, QXIRoleDTO dto)
        {
            if (dto == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIRoleDTO>.Failure(new Error("BadRequest", "Payload is null."), StatusCodes.Status400BadRequest));
            }

            if (dto.Id != 0 && dto.Id != id)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIRoleDTO>.Failure(new Error("BadRequest", "Id mismatch."), StatusCodes.Status400BadRequest));
            }

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<QXIRoleDTO>.Failure(new Error("NotFound", "Role not found."), StatusCodes.Status400BadRequest));
            }

            return StatusCode(StatusCodes.Status200OK, Response<QXIRoleDTO>.Success(updated, StatusCodes.Status200OK));
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var removed = await _service.DeleteAsync(id);
            if (!removed)
            {
                return StatusCode(StatusCodes.Status400BadRequest, Response<object>.Failure(new Error("NotFound", "Role not found."), StatusCodes.Status400BadRequest));
            }

            return StatusCode(StatusCodes.Status200OK, Response<object>.Success(null, StatusCodes.Status200OK));
        }
    }
}