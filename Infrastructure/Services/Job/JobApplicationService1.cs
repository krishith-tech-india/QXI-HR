using Core.DTOs;
using Core.DTOs.Common;
using Core.Helpers;
using Data.Models;
using Data.Reopsitories;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.Services
{
    public class JobApplicationService : IJobApplicationService
    {
        private readonly IRepository<JobApplication> _repo;
        public JobApplicationService(IRepository<JobApplication> repo) => _repo = repo;

        public async Task<JobApplicationDTO> CreateAsync(JobApplicationDTO dto)
        {
            var entity = dto.Adapt<JobApplication>();
            _repo.Insert(entity);
            await _repo.SaveChangesAsync();
            return entity.Adapt<JobApplicationDTO>();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return false;
            _repo.Delete(e);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResponse<JobApplicationDTO>> GetAllAsync(RequestParams requestParams)
        {
            Expression<Func<JobApplication, object>> sort = x => x.Id; // Default sort
            Expression<Func<JobApplication, bool>> filter = PredicateBuilder.BuildFilterExpression<JobApplication>(requestParams.Filters);
            if(!string.IsNullOrWhiteSpace(requestParams.SearchKeyword))
            {
                requestParams.SearchKeyword = requestParams.SearchKeyword.Trim().ToLikeFilterString(Operator.Contains);
                Expression<Func<JobApplication, bool>> searchExpr = ja => EF.Functions.Like(ja.ApplicantName, requestParams.SearchKeyword) 
                || EF.Functions.Like(ja.ApplicantEmail, requestParams.SearchKeyword);

                filter = filter == null ? searchExpr : PredicateBuilder.And(filter, searchExpr);
            }


            if (!string.IsNullOrWhiteSpace(requestParams.SortBy))
            {
                sort = PredicateBuilder.BuildSortExpression<JobApplication>(requestParams.SortBy);
            }

            (var total, var query) = await _repo.PagedQueryAsync(filter, sort, requestParams.Page, requestParams.PageSize);
                
            var list = await query.ToListAsync();

            return PagedResponse<JobApplicationDTO>.Success(list.Adapt<List<JobApplicationDTO>>(), total, requestParams, StatusCodes.Status200OK);
        }

        public async Task<JobApplicationDTO?> GetByIdAsync(int id)
        {
            var e = await _repo.Query(a => a.Id == id, false).Include(a => a.JobPost).FirstOrDefaultAsync();
            return e?.Adapt<JobApplicationDTO>();
        }

        public async Task<JobApplicationDTO?> UpdateAsync(int id, JobApplicationDTO dto)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return null;
            dto.Adapt(e);
            _repo.Update(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<JobApplicationDTO>();
        }

        public async Task<IEnumerable<JobApplicationDTO>> GetByJobPostIdAsync(int jobPostId)
        {
            var list = await _repo.Query(a => a.JobPostId == jobPostId, true).ToListAsync();
            return list.Adapt<IEnumerable<JobApplicationDTO>>();
        }
    }
}