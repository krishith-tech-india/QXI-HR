using Core.DTOs;

namespace Infrastructure.Services
{
    public interface IUserService : IEntityCrudService<QXIUserDTO, int>
    {
        Task<QXIUserDTO?> AuthenticateUser(AuthRequestDto auth);
        Task<bool> EmailOrPhoneExistsAsync(string email, string phoneNumber);
        Task<QXIUserDTO?> GetByEmailAsync(string email);
    }
}
