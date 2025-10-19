namespace Core.DTOs
{
    public class GallaryImageDTO
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string ImageUrl { get; set; } = null!;
        public int? CategoryId { get; set; }
    }
}