using Core.DTOs;

namespace Infrastructure.Services
{
    public interface IJobApplicationService : IEntityCrudService<JobApplicationDTO>
    {
        Task<IEnumerable<JobApplicationDTO>> GetByJobPostIdAsync(int jobPostId);

        Task<ResumePresignedUrlDto> GetUploadUrl(string filename);

        Task<bool> CheckApplicationExist(JobApplicationDTO dto);
    }
}