namespace Core.DTOs
{
    public class JobApplicationDTO
    {
        public int Id { get; set; }
        public string? ApplicantName { get; set; }
        public string? ApplicantEmail { get; set; }
        public string? ApplicantPhoneNumber { get; set; }
        public string? ResumeUrl { get; set; }
        public string? CoverLetterUrl { get; set; }
        public int JobPostId { get; set; }
    }
}