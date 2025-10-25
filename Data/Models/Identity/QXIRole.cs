using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models.Identity
{
    [Table("Roles")]
    [Index(nameof(RoleName), IsUnique = true, Name = "UQ_Roles_RoleName")]
    public class QXIRole : EntityBase
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50)]
        [Unicode(false)]
        public string RoleName { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        public virtual ICollection<QXIUserRole> UserRoles { get; set; } = new List<QXIUserRole>();
    }
}
