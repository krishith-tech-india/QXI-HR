using System.Diagnostics.CodeAnalysis;

namespace Core
{
    public class APIException(int httpStatusCode, string errorMessage) : Exception
    {
        [NotNull]
        public int StatusCode { get; set; } = httpStatusCode;
        public string ErrorMessage { get; set; } = errorMessage;
    }
}
