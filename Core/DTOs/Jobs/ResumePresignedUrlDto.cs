using System;

namespace Core.DTOs;

public class ResumePresignedUrlDto
{
    public string uploadUrl { get; set; } = null!;
    public string fileUrl { get; set; } = null!;
}
