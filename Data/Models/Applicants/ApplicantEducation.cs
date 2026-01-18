using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    [Table("ApplicantEducations")]
    public class ApplicantEducation : EntityBase
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string Institution { get; set; } = null!;

        [StringLength(200)]
        [Unicode(false)]
        public string? Degree { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string? FieldOfStudy { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string? Grade { get; set; }

        [StringLength(2000)]
        [Unicode(false)]
        public string? Description { get; set; }

        public virtual ApplicantProfile Profile { get; set; } = null!;
    }
}
