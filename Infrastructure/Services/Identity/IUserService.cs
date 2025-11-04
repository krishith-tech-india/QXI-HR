using Core.DTOs;

namespace Infrastructure.Services
{
    public interface IUserService : IEntityCrudService<QXIUserDTO>
    {
        Task<QXIUserDTO?> AuthenticateUser(AuthRequestDto auth);
    }
}