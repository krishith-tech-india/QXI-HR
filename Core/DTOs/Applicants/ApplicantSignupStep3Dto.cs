namespace Core.DTOs
{
    public class ApplicantSignupStep3Dto
    {
        public string Email { get; set; } = null!;
        public string VerificationCode { get; set; } = null!;
        public string ProfileHeadline { get; set; } = null!;
        public string? ProfileSummary { get; set; }
        public string? PortfolioUrl { get; set; }
        public string? ResumeUrl { get; set; }
        public ICollection<int>? SkillIds { get; set; }
    }
}
