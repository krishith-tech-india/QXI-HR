namespace Core.DTOs
{
    public class AppSettings
    {
        public string[] ClientList { get; set; } = [];
        public string APIUrl { get; set; } = string.Empty;
        public string? SecurityKey { get; set; }
        public int TokenExpiryHours { get; set; }
    }
}
