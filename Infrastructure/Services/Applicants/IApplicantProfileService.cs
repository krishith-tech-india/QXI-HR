using Core.DTOs;

namespace Infrastructure.Services
{
    public interface IApplicantProfileService
    {
        Task<ApplicantProfileDto?> GetByUserIdAsync(int userId);
        Task<ApplicantProfileDto?> GetByEmailAsync(string email);
        Task<ApplicantProfileDto> UpsertAsync(int userId, ApplicantProfileUpsertDto dto);
        Task<ResumePresignedUrlDto> GetUploadUrl(string filename, string category);
    }
}
