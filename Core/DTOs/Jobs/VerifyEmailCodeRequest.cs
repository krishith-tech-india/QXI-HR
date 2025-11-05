using System.ComponentModel.DataAnnotations;

namespace Core.DTOs
{
    public class VerifyEmailCodeRequest
    {
        [Required]
        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string VerificationCode { get; set; } = null!;
    }
}