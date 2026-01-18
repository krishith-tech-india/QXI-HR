namespace Core.DTOs
{
    public class ApplicantSignupStep2Dto
    {
        public string Email { get; set; } = null!;
        public string VerificationCode { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? ProfileImageUrl { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
