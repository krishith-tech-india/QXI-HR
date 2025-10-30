using System;

namespace Core.DTOs.Common;

public class AuthRequestDto
{
    public required string UsernameOrEmail { get; set; }
    public required string Password { get; set; }
}
