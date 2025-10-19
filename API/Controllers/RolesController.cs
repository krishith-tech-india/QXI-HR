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
        public async Task<ActionResult<Response<IEnumerable<QXIRoleDTO>>>> GetAll()
        {
            var list = await _service.GetAllAsync();
            return Ok(Response<IEnumerable<QXIRoleDTO>>.Success(list, 200));
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Response<QXIRoleDTO>>> GetById(int id)
        {
            var dto = await _service.GetByIdAsync(id);
            if (dto == null)
            {
                var errors = new List<Error> { new Error { Message = "NotFound", Description = "Role not found." } };
                return NotFound(Response<QXIRoleDTO>.Failue(errors, 404));
            }
            return Ok(Response<QXIRoleDTO>.Success(dto, 200));
        }

        [HttpPost]
        public async Task<ActionResult<Response<QXIRoleDTO>>> Create(QXIRoleDTO dto)
        {
            if (dto == null)
            {
                var errors = new List<Error> { new Error { Message = "BadRequest", Description = "Payload is null." } };
                return BadRequest(Response<QXIRoleDTO>.Failue(errors, 400));
            }

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, Response<QXIRoleDTO>.Success(created, 201));
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult<Response<QXIRoleDTO>>> Update(int id, QXIRoleDTO dto)
        {
            if (dto == null)
            {
                var errors = new List<Error> { new Error { Message = "BadRequest", Description = "Payload is null." } };
                return BadRequest(Response<QXIRoleDTO>.Failue(errors, 400));
            }

            if (dto.Id != 0 && dto.Id != id)
            {
                var errors = new List<Error> { new Error { Message = "BadRequest", Description = "Id mismatch." } };
                return BadRequest(Response<QXIRoleDTO>.Failue(errors, 400));
            }

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null)
            {
                var errors = new List<Error> { new Error { Message = "NotFound", Description = "Role not found." } };
                return NotFound(Response<QXIRoleDTO>.Failue(errors, 404));
            }

            return Ok(Response<QXIRoleDTO>.Success(updated, 200));
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult<Response<object>>> Delete(int id)
        {
            var removed = await _service.DeleteAsync(id);
            if (!removed)
            {
                var errors = new List<Error> { new Error { Message = "NotFound", Description = "Role not found." } };
                return NotFound(Response<object>.Failue(errors, 404));
            }

            return StatusCode(204, Response<object>.Success(null, 204));
        }
    }
}