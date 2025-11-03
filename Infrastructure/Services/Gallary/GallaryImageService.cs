using System.Linq.Expressions;
using Core.DTOs;
using Core.DTOs.Common;
using Core.Helpers;
using Data.Models;
using Data.Reopsitories;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{

    public class GallaryImageService(IRepository<GallaryImage> repo) : IGallaryImageService
    {
        private readonly IRepository<GallaryImage> _repo = repo;

        public async Task<GallaryImageDTO> CreateAsync(GallaryImageDTO dto)
        {

            dto.CategoryId = dto.CategoryId != 0 ? dto.CategoryId : null;
            var entity = dto.Adapt<GallaryImage>();
            _repo.Insert(entity);
            await _repo.SaveChangesAsync();
            return entity.Adapt<GallaryImageDTO>();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return false;
            _repo.Delete(e);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<GallaryImageDTO?> GetByIdAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            return e?.Adapt<GallaryImageDTO>();
        }

        public async Task<GallaryImageDTO?> UpdateAsync(int id, GallaryImageDTO dto)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return null;
            dto.CategoryId = dto.CategoryId != 0 ? dto.CategoryId : null;
            dto.Adapt(e);
            _repo.Update(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<GallaryImageDTO>();
        }

        public async Task<IEnumerable<GallaryImageDTO>> GetByCategoryAsync(int categoryId)
        {
            var list = await _repo.Query(i => i.CategoryId == categoryId, true).ToListAsync();
            return list.Adapt<IEnumerable<GallaryImageDTO>>();
        }

        public async Task<PagedResponse<GallaryImageDTO>> GetAllAsync(RequestParams requestParams)
        {
            Expression<Func<GallaryImage, object>> sort = x => x.Id; // Default sort
            Expression<Func<GallaryImage, bool>> filter = PredicateBuilder.BuildFilterExpression<GallaryImage>(requestParams.Filters);
            if (!string.IsNullOrWhiteSpace(requestParams.SearchKeyword))
            {
                requestParams.SearchKeyword = requestParams.SearchKeyword.Trim().ToLikeFilterString(Operator.Contains);
                Expression<Func<GallaryImage, bool>> searchExpr = gi => EF.Functions.Like(gi.Description, requestParams.SearchKeyword)
                                                                   || EF.Functions.Like(gi.Title, requestParams.SearchKeyword);

                filter = filter == null ? searchExpr : PredicateBuilder.And(filter, searchExpr);
            }


            if (!string.IsNullOrWhiteSpace(requestParams.SortBy))
            {
                sort = PredicateBuilder.BuildSortExpression<GallaryImage>(requestParams.SortBy);
            }

            (var total, var query) = await _repo.PagedQueryAsync(filter, sort, requestParams.Page, requestParams.PageSize, requestParams.IsDescending);

            var list = await query.ToListAsync();

            return PagedResponse<GallaryImageDTO>.Success(list.Adapt<List<GallaryImageDTO>>(), total, requestParams, StatusCodes.Status200OK);

        }
    }
}