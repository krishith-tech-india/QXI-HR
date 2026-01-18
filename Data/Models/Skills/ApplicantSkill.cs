using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Data.Models
{
    [Table("ApplicantSkills")]
    [PrimaryKey(nameof(UserId), nameof(SkillId))]
    public class ApplicantSkill : EntityBase
    {
        public int UserId { get; set; }
        public int SkillId { get; set; }

        public virtual QXIUser User { get; set; } = null!;
        public virtual Skill Skill { get; set; } = null!;
    }
}
