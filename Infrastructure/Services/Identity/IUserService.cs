using Core.DTOs;
using Core.DTOs.Common;

namespace Infrastructure.Services
{
    public interface IUserService : IEntityCrudService<QXIUserDTO>
    {
        Task<QXIUserDTO?> AuthenticateUser(AuthRequestDto auth);
    }
}