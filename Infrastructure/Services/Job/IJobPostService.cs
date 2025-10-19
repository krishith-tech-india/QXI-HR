using Core.DTOs;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Infrastructure.Services
{
    public interface IJobPostService : IEntityCrudService<JobPostDTO>
    {
    }

    public interface IJobApplicationService : IEntityCrudService<JobApplicationDTO>
    {
        Task<IEnumerable<JobApplicationDTO>> GetByJobPostIdAsync(int jobPostId);
    }
}