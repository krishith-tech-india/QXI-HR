using Core.DTOs;

namespace Infrastructure.Services
{
    public interface IGallaryImageService : IEntityCrudService<GallaryImageDTO>
    {
        Task<IEnumerable<GallaryImageDTO>> GetByCategoryAsync(int categoryId);
    }
}