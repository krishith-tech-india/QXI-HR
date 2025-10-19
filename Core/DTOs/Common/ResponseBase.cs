namespace Core.DTOs.Common
{
    public class ResponseBase
    {
        public int StatusCode { get; set; }
        public bool IsSuccess { get; set; }
        public List<Error>? Errors { get; set; }
    }
}
