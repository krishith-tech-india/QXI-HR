using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    [Table("GallaryImages")]
    [Index(nameof(CategoryId), Name = "IX_GallaryImages_CategoryId")]
    public class GallaryImage
    {
        [Key]
        public int Id { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string? Title { get; set; }

        [Unicode(false)]
        public string? Description { get; set; }

        [StringLength(500)]
        [DataType(DataType.ImageUrl)]
        public string ImageUrl { get; set; }

        public int? CategoryId { get; set; }

        public virtual ImageCategory? Category { get; set; }
    }
}
