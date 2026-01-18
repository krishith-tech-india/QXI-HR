namespace Core.DTOs
{
    public class ApplicantSignupDto
    {
        public string FirstName { get; set; } = null!;
        public string? LastName { get; set; }
        public string Email { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public string Password { get; set; } = null!;
        public ICollection<int>? SkillIds { get; set; }
        public ApplicantProfileUpsertDto Profile { get; set; } = null!;
    }
}
