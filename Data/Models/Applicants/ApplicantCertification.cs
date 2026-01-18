using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    [Table("ApplicantCertifications")]
    public class ApplicantCertification : EntityBase
    {
        [Key]
        public int Id { get; set; }

        public int UserId { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string Name { get; set; } = null!;

        [StringLength(200)]
        [Unicode(false)]
        public string? Issuer { get; set; }

        public DateTime? IssueDate { get; set; }
        public DateTime? ExpiryDate { get; set; }

        public virtual ApplicantProfile Profile { get; set; } = null!;
    }
}
