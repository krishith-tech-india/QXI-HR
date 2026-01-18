namespace Core.DTOs
{
    public class ApplicantOnlineProfileDto
    {
        public int? Id { get; set; }
        public string Platform { get; set; } = null!;
        public string Url { get; set; } = null!;
    }
}
