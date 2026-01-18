using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    [Table("ApplicantProjects")]
    public class ApplicantProject : EntityBase
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string Name { get; set; } = null!;

        [StringLength(2000)]
        [Unicode(false)]
        public string? Description { get; set; }

        [StringLength(500)]
        [Unicode(false)]
        public string? TechStack { get; set; }

        [StringLength(500), DataType(DataType.Url)]
        [Unicode(false)]
        public string? ProjectUrl { get; set; }

        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        public virtual ApplicantProfile Profile { get; set; } = null!;
    }
}
