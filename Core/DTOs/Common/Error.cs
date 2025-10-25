namespace Core.DTOs.Common
{
    public class Error(string message, string description = "")
    {
        public string Message { get; set; } = message;
        public string Description { get; set; } = description;
    }
}