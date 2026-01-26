using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    [Table("ApplicantOnlineProfiles")]
    public class ApplicantOnlineProfile : EntityBase
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string Platform { get; set; } = null!;

        [StringLength(500), DataType(DataType.Url)]
        [Unicode(false)]
        public string Url { get; set; } = null!;

        public virtual QXIUser User { get; set; } = null!;
    }
}
