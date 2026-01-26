using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Data.Models
{
    [Table("JobPostSkills")]
    [PrimaryKey(nameof(JobPostId), nameof(SkillId))]
    public class JobPostSkill : EntityBase
    {
        public int JobPostId { get; set; }
        public int SkillId { get; set; }

        public virtual JobPost JobPost { get; set; } = null!;
        public virtual Skill Skill { get; set; } = null!;
    }
}
