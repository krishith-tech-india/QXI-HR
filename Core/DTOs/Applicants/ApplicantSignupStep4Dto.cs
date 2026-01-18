namespace Core.DTOs
{
    public class ApplicantSignupStep4Dto
    {
        public string Email { get; set; } = null!;
        public string VerificationCode { get; set; } = null!;
        public ICollection<ApplicantEmploymentDto>? Employments { get; set; }
        public ICollection<ApplicantEducationDto>? Educations { get; set; }
    }
}
