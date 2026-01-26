using Core.DTOs;
namespace Infrastructure.Services
{
    public interface IJobApplicationService : IEntityCrudService<JobApplicationDTO, int>
    {
        Task<IEnumerable<JobApplicationDTO>> GetByJobPostIdAsync(int jobPostId);
        Task<IEnumerable<JobApplicationDTO>> GetByJobPostIdAsync(int jobPostId, bool includeInactive);
        Task<IEnumerable<JobApplicationDTO>> GetByApplicantUserIdAsync(int userId);

        Task<ResumePresignedUrlDto> GetUploadUrl(string filename);

        Task<bool> CheckApplicationExist(JobApplicationDTO dto);

        // Sends a verification code to the provided email and stores it in DB
        Task<bool> SendVerificationCodeAsync(string email);

        // Verifies a stored verification code against the provided code
        Task<bool> VerifyEmailCodeAsync(string email, string verificationCode);
        Task<bool> SendEMailContactMessage(MailContactMessageDto messageDto);
    }
}
