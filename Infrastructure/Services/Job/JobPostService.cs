using Core.DTOs;
using Core.Helpers;
using Data.Models;
using Data.Reopsitories;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.Services
{
    public class JobPostService : IJobPostService
    {
        private readonly IRepository<JobPost> _repo;
        public JobPostService(IRepository<JobPost> repo) => _repo = repo;

        public async Task<JobPostDTO> CreateAsync(JobPostDTO dto)
        {
            var entity = dto.Adapt<JobPost>();
            _repo.Insert(entity);
            await _repo.SaveChangesAsync();
            return entity.Adapt<JobPostDTO>();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return false;
            _repo.Delete(e);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResponse<JobPostDTO>> GetAllAsync(RequestParams requestParams)
        {
            Expression<Func<JobPost, object>> sort = x => x.Id; // Default sort
            Expression<Func<JobPost, bool>> filter = PredicateBuilder.BuildFilterExpression<JobPost>(requestParams.Filters);
            if (!string.IsNullOrWhiteSpace(requestParams.SearchKeyword))
            {
                requestParams.SearchKeyword = requestParams.SearchKeyword.Trim().ToLikeFilterString(Operator.Contains);
                Expression<Func<JobPost, bool>> searchExpr = ja => EF.Functions.ILike(ja.CompanyName, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.Skils, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.Description, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.Title, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.Location, requestParams.SearchKeyword);

                filter = filter == null ? searchExpr : PredicateBuilder.And(filter, searchExpr);
            }


            if (!string.IsNullOrWhiteSpace(requestParams.SortBy))
            {
                sort = PredicateBuilder.BuildSortExpression<JobPost>(requestParams.SortBy);
            }

            (var total, var query) = await _repo.PagedQueryAsync(filter, sort, requestParams.Page, requestParams.PageSize, requestParams.IsDescending);

            var list = await query.ToListAsync();

            return PagedResponse<JobPostDTO>.Success(list.Adapt<List<JobPostDTO>>(), total, requestParams, StatusCodes.Status200OK);

        }

        public async Task<JobPostDTO?> GetByIdAsync(int id)
        {
            var e = await _repo.Query(j => j.Id == id, false).Include(j => j.Applications).FirstOrDefaultAsync();
            return e?.Adapt<JobPostDTO>();
        }

        public async Task<JobPostDTO?> UpdateAsync(int id, JobPostDTO dto)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return null;
            dto.Adapt(e);
            _repo.Update(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<JobPostDTO>();
        }
    }
}