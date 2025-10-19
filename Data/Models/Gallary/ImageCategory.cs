using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    [Table("ImageCategories")]
    public class ImageCategory : EntityBase
    {
        [Key]
        public int Id { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string Name { get; set; }

        public virtual ICollection<GallaryImage> Images { get; set; } = [];
    }
}
