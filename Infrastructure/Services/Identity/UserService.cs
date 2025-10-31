using System.Linq.Expressions;
using Core.DTOs;
using Core.DTOs.Common;
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
        private readonly IRepository<QXIUser> _repo;
        public UserService(IRepository<QXIUser> repo) => _repo = repo;

        public async Task<QXIUserDTO> CreateAsync(QXIUserDTO dto)
        {
            var e = dto.Adapt<QXIUser>();
            _repo.Insert(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<QXIUserDTO>();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return false;
            _repo.Delete(e);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<QXIUserDTO>> GetAllAsync()
        {
            var list = await _repo.GetAll(false).ToListAsync();
            return list.Adapt<IEnumerable<QXIUserDTO>>();
        }

        public async Task<QXIUserDTO?> GetByIdAsync(int id)
        {
            var e = await _repo.Query(u => u.Id == id, false).Include(u => u.UserRoles).FirstOrDefaultAsync();
            return e?.Adapt<QXIUserDTO>();
        }

        public async Task<QXIUserDTO?> UpdateAsync(int id, QXIUserDTO dto)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return null;
            dto.Adapt(e);
            _repo.Update(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<QXIUserDTO>();
        }

        public async Task<QXIUserDTO?> AuthenticateUser(AuthRequestDto auth)
        {
            var user = await _repo.Query(u => u.Email.Equals(auth.UsernameOrEmail) && u.Password.Equals(auth.Password), true)
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
                Expression<Func<QXIUser, bool>> searchExpr = ja => EF.Functions.Like(ja.FirstName, requestParams.SearchKeyword)
                                                                   || EF.Functions.Like(ja.LastName, requestParams.SearchKeyword)
                                                                   || EF.Functions.Like(ja.Email, requestParams.SearchKeyword)
                                                                   || EF.Functions.Like(ja.Position, requestParams.SearchKeyword)
                                                                   || EF.Functions.Like(ja.PhoneNumber, requestParams.SearchKeyword)
                                                                   || EF.Functions.Like(ja.LinkedInProfileUrl, requestParams.SearchKeyword)
                                                                   || EF.Functions.Like(ja.Bio, requestParams.SearchKeyword);

                filter = filter == null ? searchExpr : PredicateBuilder.And(filter, searchExpr);
            }


            if (!string.IsNullOrWhiteSpace(requestParams.SortBy))
            {
                sort = PredicateBuilder.BuildSortExpression<QXIUser>(requestParams.SortBy);
            }

            (var total, var query) = await _repo.PagedQueryAsync(filter, sort, requestParams.Page, requestParams.PageSize);

            var list = await query.Adapt<IQueryable<QXIUserDTO>>().ToListAsync();

            return PagedResponse<QXIUserDTO>.Success(list, total, requestParams, StatusCodes.Status200OK);

        }
    }

}