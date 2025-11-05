using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    [Table("EmailVerificationCodes")]
    public class EmailVerificationCode : EntityBase
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        [Unicode(false)]
        public string Email { get; set; }

        // storing as string to allow leading zeros and length constraint
        [Required]
        [StringLength(100)]
        [Unicode(false)]
        public string VerificationCode { get; set; }
    }
}
