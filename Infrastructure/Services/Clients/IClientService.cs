using Core.DTOs;

namespace Infrastructure.Services;

public interface IClientService : IEntityCrudService<ClientDTO, int>
{
    Task<ResumePresignedUrlDto> GetUploadUrl(string filename);
}
