using Core.DTOs;
using Core.DTOs.Common;
using Data.Models;
using Data.Reopsitories;
using Mapster;
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

        public async Task<IEnumerable<GallaryImageDTO>> GetAllAsync()
        {
            var list = await _repo.GetAll(true).ToListAsync();
            return list.Adapt<IEnumerable<GallaryImageDTO>>();
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

        public Task<PagedResponse<GallaryImageDTO>> GetAllAsync(RequestParams requestParams)
        {
            throw new NotImplementedException();
        }
    }
}