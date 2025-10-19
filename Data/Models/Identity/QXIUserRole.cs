using Data.Models.Identity;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;


namespace Data.Models
{
    [Table("UserRoles")]
    [PrimaryKey(nameof(UserId), nameof(RoleId))]
    public class QXIUserRole : EntityBase
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }

        public virtual QXIRole Role { get; set; }
        public virtual QXIUser User { get; set; }
    }
}
