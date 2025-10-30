using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs.Common
{
    public class PagedResponse<T> : Response<IEnumerable<T>>
    {
        public int Total { get; set; }
        public RequestParams RequestParams { get; set; }

        public static PagedResponse<T> Success(IEnumerable<T> data, int total, RequestParams requestParams, int statusCode)
        {

            return new PagedResponse<T>
            {
                Data = data,
                Total = total,
                RequestParams = requestParams,
                StatusCode = statusCode,
                IsSuccess = true
            };
        }   
    }
}
