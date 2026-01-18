namespace Core.DTOs
{
    public class ApplicantCertificationDto
    {
        public int? Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Issuer { get; set; }
        public DateTime? IssueDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}
