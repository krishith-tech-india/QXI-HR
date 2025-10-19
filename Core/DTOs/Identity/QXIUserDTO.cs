namespace Core.DTOs
{
    public class QXIUserDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string? Bio { get; set; }
        public string? LinkedInProfileUrl { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public string Position { get; set; } = null!;
        public string ProfilePictureUrl { get; set; } = null!;
        public ICollection<QXIUserRoleDTO>? UserRoles { get; set; }
    }

    public class QXIUserRoleDTO
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
    }
}