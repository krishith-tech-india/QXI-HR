using System;

namespace Core.DTOs.Common;

public class AuthRespDto
{
    public required string Token { get; set; }
    public required string Role { get; set; }
}
