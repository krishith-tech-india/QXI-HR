namespace Core.DTOs
{
    public class ApplicantSignupSessionDto
    {
        public string Email { get; set; } = null!;
        public string PhoneNumber { get; set; } = null!;
        public int CurrentStep { get; set; }
        public int UserId { get; set; }
    }
}
