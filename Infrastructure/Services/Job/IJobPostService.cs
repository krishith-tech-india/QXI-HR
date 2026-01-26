using Core.DTOs;

namespace Infrastructure.Services
{
    public interface IJobPostService : IEntityCrudService<JobPostDTO, int>
    {
        Task<JobPostDTO?> GetByIdAsync(int id, bool includeInactive);
    }
}
