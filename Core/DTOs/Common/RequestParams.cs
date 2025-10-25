using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Core.DTOs
{
    public class RequestParams

    {
        [Range(1, int.MaxValue, ErrorMessage = $"Field {nameof(Page)} Must be grater than zero.")]
        [DefaultValue(1)]
        public int Page { get; set; } = 1;

        [Range(0, 100, ErrorMessage = $"Field {nameof(PageSize)} Must be a positive Number less than 100.")]
        public int PageSize { get; set; } = 10;
        public string? SearchKeyword { get; set; }
        public string? SortBy { get; set; }
        public bool IsDescending { get; set; } = false;
        public List<CommonFilterParams>? Filters { get; set; }

    }

    public class CommonFilterParams
    {
        public string? FieldName { get; set; }
        public object? Value { get; set; }
        public string? Condition { get; set; } = "and";
        public string? Operator { get; set; } = "equals";
    }
}
