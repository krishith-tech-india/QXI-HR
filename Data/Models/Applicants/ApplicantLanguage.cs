using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    [Table("ApplicantLanguages")]
    public class ApplicantLanguage : EntityBase
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string LanguageName { get; set; } = null!;

        [StringLength(100)]
        [Unicode(false)]
        public string? Proficiency { get; set; }

        public virtual ApplicantProfile Profile { get; set; } = null!;
    }
}
