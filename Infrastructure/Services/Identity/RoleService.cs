using Core.DTOs;
using Core.DTOs.Common;
using Data.Models;
using Data.Models.Identity;
using Data.Reopsitories;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class RoleService(IRepository<QXIRole> repo) : IRoleService
    {
        private readonly IRepository<QXIRole> _repo = repo;

        public async Task<QXIRoleDTO> CreateAsync(QXIRoleDTO dto)
        {
            var entity = dto.Adapt<QXIRole>();
            _repo.Insert(entity);
            await _repo.SaveChangesAsync();
            return entity.Adapt<QXIRoleDTO>();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return false;
            _repo.Delete(e);
            await _repo.SaveChangesAsync();
            return true;
        }

        // Updated GetAllAsync with RequestParams
        public async Task<IEnumerable<QXIRoleDTO>> GetAllAsync(RequestParams requestParams)
        {
            var query = _repo.GetAll(false);

            if (!string.IsNullOrWhiteSpace(requestParams?.SearchKeyword))
            {
                // var kw = requestParams.SearchKeyword.Trim();
                // query = query.Where(r => r.Name.Contains(kw) || r.Description.Contains(kw));
            }

            if (!string.IsNullOrWhiteSpace(requestParams?.SortBy))
            {
                if (requestParams.IsDescending)
                    query = query.OrderByDescending(e => EF.Property<object>(e, requestParams.SortBy));
                else
                    query = query.OrderBy(e => EF.Property<object>(e, requestParams.SortBy));
            }

            var page = requestParams?.Page > 0 ? requestParams.Page : 1;
            var pageSize = (requestParams?.PageSize > 0 && requestParams.PageSize <= 100) ? requestParams.PageSize : 10;
            var list = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return list.Adapt<IEnumerable<QXIRoleDTO>>();
        }

        public async Task<QXIRoleDTO?> GetByIdAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
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

        Task<PagedResponse<QXIRoleDTO>> IEntityCrudService<QXIRoleDTO>.GetAllAsync(RequestParams requestParams)
        {
            throw new NotImplementedException();
        }
    }
}