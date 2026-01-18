using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Core.Enums;

namespace Data.Models.Identity
{
    [Table("Roles")]
    public class QXIRole : EntityBase
    {
        [Key]
        public int Id { get; set; }

        [StringLength(50)]
        [Unicode(false)]
        public string RoleName { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        public virtual ICollection<QXIUserRole> UserRoles { get; set; } = new List<QXIUserRole>();
    }
}
