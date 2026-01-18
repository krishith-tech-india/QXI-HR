using System.Linq.Expressions;
using Core.DTOs;
using Core.Helpers;
using Data.Models;
using Data.Reopsitories;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class SkillService(IRepository<Skill> repo) : ISkillService
    {
        private readonly IRepository<Skill> _repo = repo;

        public async Task<SkillDTO> CreateAsync(SkillDTO dto)
        {
            var entity = dto.Adapt<Skill>();
            _repo.Insert(entity);
            await _repo.SaveChangesAsync();
            return entity.Adapt<SkillDTO>();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return false;
            _repo.Delete(e);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<SkillDTO?> GetByIdAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            return e?.Adapt<SkillDTO>();
        }

        public async Task<SkillDTO?> UpdateAsync(int id, SkillDTO dto)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return null;
            dto.Adapt(e);
            _repo.Update(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<SkillDTO>();
        }

        public async Task<PagedResponse<SkillDTO>> GetAllAsync(RequestParams requestParams)
        {
            Expression<Func<Skill, object>> sort = x => x.Id;
            Expression<Func<Skill, bool>> filter = PredicateBuilder.BuildFilterExpression<Skill>(requestParams.Filters);

            if (!string.IsNullOrWhiteSpace(requestParams.SearchKeyword))
            {
                requestParams.SearchKeyword = requestParams.SearchKeyword.Trim().ToLikeFilterString(Operator.Contains);
                Expression<Func<Skill, bool>> searchExpr = s =>
                    EF.Functions.ILike(s.Name, requestParams.SearchKeyword)
                    || EF.Functions.ILike(s.Description ?? string.Empty, requestParams.SearchKeyword);

                filter = filter == null ? searchExpr : PredicateBuilder.And(filter, searchExpr);
            }

            if (!string.IsNullOrWhiteSpace(requestParams.SortBy))
            {
                sort = PredicateBuilder.BuildSortExpression<Skill>(requestParams.SortBy);
            }

            (var total, var query) = await _repo.PagedQueryAsync(filter, sort, requestParams.Page, requestParams.PageSize, requestParams.IsDescending);
            var list = await query.ToListAsync();

            return PagedResponse<SkillDTO>.Success(list.Adapt<List<SkillDTO>>(), total, requestParams, StatusCodes.Status200OK);
        }
    }
}
