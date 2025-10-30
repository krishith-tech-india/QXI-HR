using Core.DTOs;
using Core.DTOs.Common;
using Data.Models;
using Data.Reopsitories;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<QXIUser> _repo;
        public UserService(IRepository<QXIUser> repo) => _repo = repo;

        public async Task<QXIUserDTO> CreateAsync(QXIUserDTO dto)
        {
            var e = dto.Adapt<QXIUser>();
            _repo.Insert(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<QXIUserDTO>();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return false;
            _repo.Delete(e);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<QXIUserDTO>> GetAllAsync()
        {
            var list = await _repo.GetAll(false).ToListAsync();
            return list.Adapt<IEnumerable<QXIUserDTO>>();
        }

        public async Task<QXIUserDTO?> GetByIdAsync(int id)
        {
            var e = await _repo.Query(u => u.Id == id, false).Include(u => u.UserRoles).FirstOrDefaultAsync();
            return e?.Adapt<QXIUserDTO>();
        }

        public async Task<QXIUserDTO?> UpdateAsync(int id, QXIUserDTO dto)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return null;
            dto.Adapt(e);
            _repo.Update(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<QXIUserDTO>();
        }

        public async Task<QXIUserDTO?> AuthenticateUser(AuthRequestDto auth)
        {
            var user = await _repo.Query(u => u.Email.Equals(auth.UsernameOrEmail) && u.Password.Equals(auth.Password), true)
                                  .Include(u => u.UserRoles)
                                  .ThenInclude(ur => ur.Role)
                                  .FirstOrDefaultAsync();
            return user?.Adapt<QXIUserDTO>();
        }
    }

}