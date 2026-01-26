using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    [Table("JobPosts")]
    public class JobPost : EntityBase
    {
        [Key]
        public int Id { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string Title { get; set; } = string.Empty;

        [Unicode(false)]
        public string Description { get; set; } = string.Empty;

        [StringLength(200)]
        [Unicode(false)]
        public string? CompanyName { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string Location { get; set; } = string.Empty;

        [Unicode(false)]
        public string Skils { get; set; } = string.Empty;

        [StringLength(200)]
        [Unicode(false)]
        public string Salary { get; set; } = string.Empty;

        [StringLength(200)]
        [Unicode(false)]
        public string Experience { get; set; } = string.Empty;

        [StringLength(100)]
        [Unicode(false)]
        public string JobCode { get; set; } = string.Empty;

        [StringLength(50)]
        [Unicode(false)]
        public string? RecruiterWhatsAppNumber { get; set; }

        public virtual ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
        public virtual ICollection<JobPostSkill> JobPostSkills { get; set; } = new List<JobPostSkill>();
    }
}
