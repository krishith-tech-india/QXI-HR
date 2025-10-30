using Core.DTOs;
using Data.Models.Identity;
using Data.Reopsitories;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRepository<QXIRole> _repo;
        public RoleService(IRepository<QXIRole> repo) => _repo = repo;

        public async Task<QXIRoleDTO> CreateAsync(QXIRoleDTO dto)
        {
            var e = dto.Adapt<QXIRole>();
            _repo.Insert(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<QXIRoleDTO>();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return false;
            _repo.Delete(e);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<QXIRoleDTO>> GetAllAsync()
        {
            var list = await _repo.GetAll(false).ToListAsync();
            return list.Adapt<IEnumerable<QXIRoleDTO>>();
        }

        public async Task<QXIRoleDTO?> GetByIdAsync(int id)
        {
            var e = await _repo.Query(r => r.Id == id, false).FirstOrDefaultAsync();
            return e?.Adapt<QXIRoleDTO>();
        }

        public async Task<QXIRoleDTO?> UpdateAsync(int id, QXIRoleDTO dto)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return null;
            dto.Adapt(e);
            _repo.Update(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<QXIRoleDTO>();
        }
    }

}