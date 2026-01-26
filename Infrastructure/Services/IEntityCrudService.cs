using Core.DTOs;

namespace Infrastructure.Services
{
    // Generic minimal CRUD interface used by concrete service interfaces
    public interface IEntityCrudService<TDto, TKey>
    {
        Task<PagedResponse<TDto>> GetAllAsync(RequestParams requestParams);
        Task<TDto?> GetByIdAsync(TKey id);
        Task<TDto> CreateAsync(TDto dto);
        Task<TDto?> UpdateAsync(TKey id, TDto dto);
        Task<bool> DeleteAsync(TKey id);
    }
}
