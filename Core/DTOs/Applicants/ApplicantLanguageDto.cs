namespace Core.DTOs
{
    public class ApplicantLanguageDto
    {
        public int? Id { get; set; }
        public string LanguageName { get; set; } = null!;
        public string? Proficiency { get; set; }
    }
}
