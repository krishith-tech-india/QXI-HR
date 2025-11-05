using System;

namespace Core.DTOs;

public class R2Settings
{
    public string AccessKeyId { get; set; } = string.Empty;
    public string SecretAccessKey { get; set; } = string.Empty;
    public string ServiceUrl { get; set; } = string.Empty;
    public string BucketName { get; set; } = string.Empty;
    public string CustomDomain { get; set; } = string.Empty;
    public int PreSignedUrlExpiryInMinutes { get; set; }
}
