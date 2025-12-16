using Core.DTOs;

namespace Infrastructure.Services;

public interface IClientService : IEntityCrudService<ClientDTO>
{
    Task<ResumePresignedUrlDto> GetUploadUrl(string filename);
}
