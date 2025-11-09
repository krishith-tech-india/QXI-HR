namespace Core.DTOs
{
    public class QXIUserDTO
    {
        public int Id { get; set; }
        public string? Email { get; set; }
        public string FirstName { get; set; } = null!;
        public string? LastName { get; set; }
        public string? Bio { get; set; }
        public string? LinkedInProfileUrl { get; set; }
        public string PhoneNumber { get; set; } = null!;
        public string? Position { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public string? Password { get; set; }
        public bool IsActive { get; set; }
        public ICollection<int>? RoleIds { get; set; }
        public ICollection<QXIRoleDTO>? Roles { get; set; }
    }
}