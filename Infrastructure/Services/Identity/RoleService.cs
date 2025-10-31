using System.Linq.Expressions;
using Core.DTOs;
using Core.DTOs.Common;
using Core.Helpers;
using Data.Models;
using Data.Models.Identity;
using Data.Reopsitories;
using Mapster;
using Microsoft.AspNetCore.Http;
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

        public async Task<PagedResponse<QXIRoleDTO>> GetAllAsync(RequestParams requestParams)
        {
            Expression<Func<QXIRole, object>> sort = x => x.Id; // Default sort
            Expression<Func<QXIRole, bool>> filter = PredicateBuilder.BuildFilterExpression<QXIRole>(requestParams.Filters);
            if (!string.IsNullOrWhiteSpace(requestParams.SearchKeyword))
            {
                requestParams.SearchKeyword = requestParams.SearchKeyword.Trim().ToLikeFilterString(Operator.Contains);
                Expression<Func<QXIRole, bool>> searchExpr = ja => EF.Functions.Like(ja.RoleName, requestParams.SearchKeyword)
                                                                   || EF.Functions.Like(ja.Description, requestParams.SearchKeyword);

                filter = filter == null ? searchExpr : PredicateBuilder.And(filter, searchExpr);
            }


            if (!string.IsNullOrWhiteSpace(requestParams.SortBy))
            {
                sort = PredicateBuilder.BuildSortExpression<QXIRole>(requestParams.SortBy);
            }

            (var total, var query) = await _repo.PagedQueryAsync(filter, sort, requestParams.Page, requestParams.PageSize);

            var list = await query.ToListAsync();

            return PagedResponse<QXIRoleDTO>.Success(list.Adapt<List<QXIRoleDTO>>(), total, requestParams, StatusCodes.Status200OK);

        }
    }
}