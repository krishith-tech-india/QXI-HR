namespace Core.DTOs
{
    public class ApplicantEducationDto
    {
        public int? Id { get; set; }
        public string Institution { get; set; } = null!;
        public string? Degree { get; set; }
        public string? FieldOfStudy { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Grade { get; set; }
        public string? Description { get; set; }
    }
}
