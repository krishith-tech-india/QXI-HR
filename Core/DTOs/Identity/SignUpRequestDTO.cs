using System.ComponentModel.DataAnnotations;

namespace Core.DTOs.Identity
{
    public class SignUpRequestDTO
    {
        [MaxLength(200, ErrorMessage = $"{nameof(FullName)} Must be a non empty string less than 200 characters long.")]
        public string? FullName { get; set; } = null!;

        [MaxLength(100, ErrorMessage = $"{nameof(FirstName)} should less than 100 characters long.")]
        public string? FirstName { get; set; } = null!;

        [MaxLength(100, ErrorMessage = $"{nameof(LastName)} should less than 100 characters long.")]
        public string? LastName { get; set; } = null!;

        [Required(ErrorMessage = $"{nameof(Position)} can not be empty."),]
        [MaxLength(50, ErrorMessage = $"{nameof(Position)} should be less than 50 characters long.")]
        public string Position { get; set; } = null!;

        [Required(ErrorMessage = $"{nameof(Position)} can not be empty."),]
        [MaxLength(50, ErrorMessage = $"{nameof(Position)} should be less than 50 characters long.")]
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? ProfilePictureUrl { get; set; }
        public string? Bio { get; set; }
        public string? LinkedInProfileUrl { get; set; }
    }
}
