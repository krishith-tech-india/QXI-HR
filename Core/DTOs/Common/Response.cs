namespace Core.DTOs.Common
{
    public class Response<T> : ResponseBase
    {
        public T? Data { get; set; }

        public static Response<T> Success(T data, int statusCode)
        {
            return new Response<T>
            {
                Data = data,
                StatusCode = statusCode,
                IsSuccess = true
            };
        }

        public static Response<T> Failure(List<Error> errors, int statusCode)
        {
            return new Response<T>
            {
                Errors = errors,
                StatusCode = statusCode,
                IsSuccess = false
            };
        }

        public static Response<T> Failure(Error error, int statusCode)
        {
            return Response<T>.Failure([error], statusCode);
        }
    }
}
