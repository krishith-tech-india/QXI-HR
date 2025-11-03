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
    public class ImageCategoryService : IImageCategoryService
    {
        private readonly IRepository<ImageCategory> _repo;
        public ImageCategoryService(IRepository<ImageCategory> repo) => _repo = repo;

        public async Task<ImageCategoryDTO> CreateAsync(ImageCategoryDTO dto)
        {
            var entity = dto.Adapt<ImageCategory>();
            _repo.Insert(entity);
            await _repo.SaveChangesAsync();
            return entity.Adapt<ImageCategoryDTO>();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return false;
            _repo.Delete(e);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResponse<ImageCategoryDTO>> GetAllAsync(RequestParams requestParams)
        {
            Expression<Func<ImageCategory, object>> sort = x => x.Id; // Default sort
            Expression<Func<ImageCategory, bool>> filter = PredicateBuilder.BuildFilterExpression<ImageCategory>(requestParams.Filters);
            if (!string.IsNullOrWhiteSpace(requestParams.SearchKeyword))
            {
                requestParams.SearchKeyword = requestParams.SearchKeyword.Trim().ToLikeFilterString(Operator.Contains);
                Expression<Func<ImageCategory, bool>> searchExpr = ja => EF.Functions.Like(ja.Name, requestParams.SearchKeyword);

                filter = filter == null ? searchExpr : PredicateBuilder.And(filter, searchExpr);
            }

            if (!string.IsNullOrWhiteSpace(requestParams.SortBy))
            {
                sort = PredicateBuilder.BuildSortExpression<ImageCategory>(requestParams.SortBy);
            }

            (var total, var query) = await _repo.PagedQueryAsync(filter, sort, requestParams.Page, requestParams.PageSize, requestParams.IsDescending);

            var list = await query.ToListAsync();

            return PagedResponse<ImageCategoryDTO>.Success(list.Adapt<List<ImageCategoryDTO>>(), total, requestParams, StatusCodes.Status200OK);

        }

        public async Task<ImageCategoryDTO?> GetByIdAsync(int id)
        {
            var e = await _repo.Query(c => c.Id == id, false).Include(c => c.Images).FirstOrDefaultAsync();
            return e?.Adapt<ImageCategoryDTO>();
        }

        public async Task<ImageCategoryDTO?> UpdateAsync(int id, ImageCategoryDTO dto)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return null;
            dto.Adapt(e);
            _repo.Update(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<ImageCategoryDTO>();
        }
    }
}