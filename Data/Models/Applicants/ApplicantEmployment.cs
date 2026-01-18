using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    [Table("ApplicantEmployments")]
    public class ApplicantEmployment : EntityBase
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string CompanyName { get; set; } = null!;

        [StringLength(200)]
        [Unicode(false)]
        public string Title { get; set; } = null!;

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrent { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string? Location { get; set; }

        [StringLength(2000)]
        [Unicode(false)]
        public string? Description { get; set; }

        public virtual ApplicantProfile Profile { get; set; } = null!;
    }
}
