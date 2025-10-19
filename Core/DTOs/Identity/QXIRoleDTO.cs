
namespace Core.DTOs
{
    public class QXIRoleDTO
    {
        public int Id { get; set; }
        public string RoleName { get; set; } = null!;
        public string Description { get; set; } = null!;
        public ICollection<QXIUserRoleDTO>? UserRoles { get; set; }
    }
}