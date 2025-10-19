using Core.DTOs;
using Data.Models;
using Data.Reopsitories;
using Mapster;
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

        public async Task<IEnumerable<ImageCategoryDTO>> GetAllAsync()
        {
            var list = await _repo.GetAll(false).Include(c => c.Images).ToListAsync();
            return list.Adapt<IEnumerable<ImageCategoryDTO>>();
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