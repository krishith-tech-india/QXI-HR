namespace Core.DTOs
{
    public class ApplicantProfileUpsertDto
    {
        public string ProfileHeadline { get; set; } = null!;
        public string? ProfileSummary { get; set; }
        public string? PortfolioUrl { get; set; }
        public string? ResumeUrl { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? MiddleName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? PostalCode { get; set; }
        public ICollection<ApplicantEmploymentDto>? Employments { get; set; }
        public ICollection<ApplicantEducationDto>? Educations { get; set; }
        public ICollection<ApplicantProjectDto>? Projects { get; set; }
        public ICollection<ApplicantOnlineProfileDto>? OnlineProfiles { get; set; }
        public ICollection<ApplicantCertificationDto>? Certifications { get; set; }
        public ICollection<ApplicantLanguageDto>? Languages { get; set; }
    }
}
