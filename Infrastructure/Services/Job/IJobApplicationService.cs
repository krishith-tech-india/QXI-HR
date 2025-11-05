using Core.DTOs;

namespace Infrastructure.Services
{
    public interface IJobApplicationService : IEntityCrudService<JobApplicationDTO>
    {
        Task<IEnumerable<JobApplicationDTO>> GetByJobPostIdAsync(int jobPostId);

        Task<ResumePresignedUrlDto> GetUploadUrl(string filename);

        Task<bool> CheckApplicationExist(JobApplicationDTO dto);

        // Sends a verification code to the provided email and stores it in DB
        Task<bool> SendVerificationCodeAsync(string email);

        // Verifies a stored verification code against the provided code
        Task<bool> VerifyEmailCodeAsync(string email, string verificationCode);
    }
}