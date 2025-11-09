using System;

namespace Core.DTOs;

public class MailContactMessageDto
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PhoneNo { get; set; } = null!;
    public string Comapny { get; set; } = null!;
    public string Subject { get; set; } = null!;
    public string Message { get; set; } = null!;
}
