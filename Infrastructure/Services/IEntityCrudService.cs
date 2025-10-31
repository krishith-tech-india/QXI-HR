using Core.DTOs;
using Core.DTOs.Common;

namespace Infrastructure.Services
{
    // Generic minimal CRUD interface used by concrete service interfaces
    public interface IEntityCrudService<TDto>
    {
        Task<PagedResponse<TDto>> GetAllAsync(RequestParams requestParams);
        Task<TDto?> GetByIdAsync(int id);
        Task<TDto> CreateAsync(TDto dto);
        Task<TDto?> UpdateAsync(int id, TDto dto);
        Task<bool> DeleteAsync(int id);
    }
}