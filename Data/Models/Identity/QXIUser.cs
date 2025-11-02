using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Data.Models
{
    [Table("Users")]
    public class QXIUser : EntityBase
    {
        [Key]
        public int Id { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string FirstName { get; set; } = null!;

        [StringLength(100)]
        [Unicode(false)]
        public string? LastName { get; set; }

        [StringLength(500)]
        [Unicode(false)]
        public string Email { get; set; } = null!;


        [StringLength(500), DataType(DataType.Url)]
        public string? ProfilePictureUrl { get; set; }

        [StringLength(1000), DataType(DataType.MultilineText)]
        public string? Bio { get; set; }

        [StringLength(500), DataType(DataType.Url)]
        public string? LinkedInProfileUrl { get; set; }

        [StringLength(50), DataType(DataType.Text)]
        [Unicode(false)]
        public string? Position { get; set; }

        [StringLength(15)]
        [Unicode(false)]
        public string PhoneNumber { get; set; } = null!;

        [StringLength(50)]
        public string Password { get; set; } = null!;

        public virtual ICollection<QXIUserRole> UserRoles { get; set; } = [];
    }
}
