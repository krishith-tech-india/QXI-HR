using Core.DTOs;

namespace Infrastructure.Services
{
    public interface IGallaryImageService : IEntityCrudService<GallaryImageDTO, int>
    {
        Task<IEnumerable<GallaryImageDTO>> GetByCategoryAsync(int categoryId);
    }
}
