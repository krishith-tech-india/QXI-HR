using System.Linq.Expressions;
using Core.DTOs;
using Core.Helpers;
using Data.Models;
using Data.Reopsitories;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository<QXIUser> _userRepo;
        private readonly IRepository<QXIUserRole> _userRoleRepo;
        public UserService(
                            IRepository<QXIUser> userRepo,
                            IRepository<QXIUserRole> userRoleRepo
                            )
        {
            _userRepo = userRepo;
            _userRoleRepo = userRoleRepo;
        }

        public async Task<QXIUserDTO> CreateAsync(QXIUserDTO dto)
        {
            var e = dto.Adapt<QXIUser>();
            e.UserRoles = dto.RoleIds!.Select(x => new QXIUserRole { RoleId = x, IsActive = true}).ToList();
            _userRepo.Insert(e);
            await _userRepo.SaveChangesAsync();
            return e.Adapt<QXIUserDTO>();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _userRepo.GetByIdAsync(id);
            if (e == null) return false;
            _userRepo.Delete(e);
            await _userRepo.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<QXIUserDTO>> GetAllAsync()
        {

            var list = await _userRepo.GetAll(false)
                    .Select(u => new QXIUserDTO
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Bio = u.Bio,
                        LinkedInProfileUrl = u.LinkedInProfileUrl,
                        PhoneNumber = u.PhoneNumber,
                        Position = u.Position,
                        ProfilePictureUrl = u.ProfilePictureUrl,
                        Email = u.Email,
                        Password = "********"   // masked value
                    })
                    .ToListAsync();
            return list.Adapt<IEnumerable<QXIUserDTO>>();
        }

        public async Task<QXIUserDTO?> GetByIdAsync(int id)
        {
            var e = await _userRepo.Query(u => u.Id == id, false)
                        .Include(u => u.UserRoles)
                        .Select(u => new QXIUserDTO
                        {
                            Id = u.Id,
                            FirstName = u.FirstName,
                            LastName = u.LastName,
                            Bio = u.Bio,
                            LinkedInProfileUrl = u.LinkedInProfileUrl,
                            PhoneNumber = u.PhoneNumber,
                            Position = u.Position,
                            ProfilePictureUrl = u.ProfilePictureUrl,
                            Email = u.Email,
                            Password = "********",  // masked value
                            Roles = u.UserRoles!.Where(ur => ur.IsActive).Select(ur => new QXIRoleDTO
                            {
                                Id = ur.Role!.Id,
                                RoleName = ur.Role.RoleName,
                                Description = ur.Role.Description
                            }).ToList()
                        })
                        .FirstOrDefaultAsync();
            return e?.Adapt<QXIUserDTO>();
        }

        public async Task<QXIUserDTO?> UpdateAsync(int id, QXIUserDTO dto)
        {
            var e = await _userRepo.GetByIdAsync(id);
            if (e == null) return null;
            // Keep existing password if none provided or empty
            if (string.IsNullOrWhiteSpace(dto.Password))
                dto.Password = e.Password;

            e.FirstName = dto.FirstName;
            e.LastName = dto.LastName;
            e.ProfilePictureUrl = dto.ProfilePictureUrl;
            e.Bio = dto.Bio;
            e.LinkedInProfileUrl = dto.LinkedInProfileUrl;
            e.Position = dto.Position;
            e.PhoneNumber = dto.PhoneNumber;
            e.Password = dto.Password!;
            
            _userRepo.Update(e);
            await _userRepo.SaveChangesAsync();
            
            // hide password before returning
            var result = e.Adapt<QXIUserDTO>();
            result.Password = "********";

            return result;
        }

        public async Task<QXIUserDTO?> AuthenticateUser(AuthRequestDto auth)
        {
            var user = await _userRepo.Query(u => u.Email.Equals(auth.UsernameOrEmail) && u.Password.Equals(auth.Password), true)
                                  .Include(u => u.UserRoles)
                                  .ThenInclude(ur => ur.Role)
                                  .FirstOrDefaultAsync();
            return user?.Adapt<QXIUserDTO>();
        }

        public async Task<PagedResponse<QXIUserDTO>> GetAllAsync(RequestParams requestParams)
        {
            Expression<Func<QXIUser, object>> sort = x => x.Id; // Default sort
            Expression<Func<QXIUser, bool>> filter = PredicateBuilder.BuildFilterExpression<QXIUser>(requestParams.Filters);
            if (!string.IsNullOrWhiteSpace(requestParams.SearchKeyword))
            {
                requestParams.SearchKeyword = requestParams.SearchKeyword.Trim().ToLikeFilterString(Operator.Contains);
                Expression<Func<QXIUser, bool>> searchExpr = ja => EF.Functions.ILike(ja.FirstName, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.LastName, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.Email, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.Position, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.PhoneNumber, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.LinkedInProfileUrl, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.Bio, requestParams.SearchKeyword);

                filter = filter == null ? searchExpr : PredicateBuilder.And(filter, searchExpr);
            }


            if (!string.IsNullOrWhiteSpace(requestParams.SortBy))
            {
                sort = PredicateBuilder.BuildSortExpression<QXIUser>(requestParams.SortBy);
            }

            (var total, var query) = await _userRepo.PagedQueryAsync(filter, sort, requestParams.Page, requestParams.PageSize, requestParams.IsDescending);

            var list = await query.ToListAsync();

            return PagedResponse<QXIUserDTO>.Success(list.Adapt<List<QXIUserDTO>>(), total, requestParams, StatusCodes.Status200OK);

        }
    }

}