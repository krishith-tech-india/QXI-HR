namespace Core.DTOs
{
    public class JobPostDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string CompanyName { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string Skils { get; set; } = null!;
        public string Salary { get; set; } = null!;
        public string Experience { get; set; } = null!;
        public ICollection<JobApplicationDTO>? Applications { get; set; }
    }
}