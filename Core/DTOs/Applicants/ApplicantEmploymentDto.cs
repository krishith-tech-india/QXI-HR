namespace Core.DTOs
{
    public class ApplicantEmploymentDto
    {
        public int? Id { get; set; }
        public string CompanyName { get; set; } = null!;
        public string Title { get; set; } = null!;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrent { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
    }
}
