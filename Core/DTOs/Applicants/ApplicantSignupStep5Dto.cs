namespace Core.DTOs
{
    public class ApplicantSignupStep5Dto
    {
        public string Email { get; set; } = null!;
        public string VerificationCode { get; set; } = null!;
        public string Password { get; set; } = null!;
        public ICollection<ApplicantProjectDto>? Projects { get; set; }
        public ICollection<ApplicantCertificationDto>? Certifications { get; set; }
        public ICollection<ApplicantLanguageDto>? Languages { get; set; }
        public ICollection<ApplicantOnlineProfileDto>? OnlineProfiles { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }
    }
}
