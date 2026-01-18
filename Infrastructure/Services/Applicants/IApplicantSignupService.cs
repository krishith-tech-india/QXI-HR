using Core.DTOs;

namespace Infrastructure.Services
{
    public interface IApplicantSignupService
    {
        Task StartAsync(ApplicantSignupStartDto dto);
        Task<ApplicantSignupSessionDto?> VerifyAsync(VerifyEmailCodeRequest request);
        Task<ApplicantSignupDraftDto?> GetDraftAsync(string email, string verificationCode);
        Task<ApplicantSignupDraftDto> SaveStep2Async(ApplicantSignupStep2Dto dto);
        Task<ApplicantSignupDraftDto> SaveStep3Async(ApplicantSignupStep3Dto dto);
        Task<ApplicantSignupDraftDto> SaveStep4Async(ApplicantSignupStep4Dto dto);
        Task<ApplicantSignupDraftDto> SaveStep5Async(ApplicantSignupStep5Dto dto);
    }
}
