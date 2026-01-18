using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Data.Models
{
    [Table("Skills")]
    public class Skill : EntityBase
    {
        [Key]
        public int Id { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string Name { get; set; } = string.Empty;

        [StringLength(200)]
        [Unicode(false)]
        public string? Description { get; set; }

        public virtual ICollection<JobPostSkill> JobPostSkills { get; set; } = new List<JobPostSkill>();
        public virtual ICollection<ApplicantSkill> ApplicantSkills { get; set; } = new List<ApplicantSkill>();
    }
}
