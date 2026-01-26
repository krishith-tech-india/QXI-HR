using System.Linq.Expressions;
using Core.DTOs;
using Core.Enums;
using Core.Helpers;
using Data.Models;
using Data.Models.Identity;
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
        private readonly IRepository<ApplicantOnlineProfile> _onlineProfileRepo;
        private readonly IRepository<QXIRole> _roleRepo;
        private readonly Data.DbContexts.QXIDbContext _dbContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        private bool IsAdminOrStaff =>
            _httpContextAccessor.HttpContext?.User?.IsInRole(Roles.Admin.ToString()) == true ||
            _httpContextAccessor.HttpContext?.User?.IsInRole(Roles.Staff.ToString()) == true;

        public UserService(
                            IRepository<QXIUser> userRepo,
                            IRepository<QXIUserRole> userRoleRepo,
                            IRepository<ApplicantOnlineProfile> onlineProfileRepo,
                            IRepository<QXIRole> roleRepo,
                            Data.DbContexts.QXIDbContext dbContext,
                            IHttpContextAccessor httpContextAccessor
                            )
        {
            _userRepo = userRepo;
            _userRoleRepo = userRoleRepo;
            _onlineProfileRepo = onlineProfileRepo;
            _roleRepo = roleRepo;
            _dbContext = dbContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<QXIUserDTO> CreateAsync(QXIUserDTO dto)
        {
            var e = dto.Adapt<QXIUser>();
            e.IsPublic = dto.IsPublic;
            e.UserRoles = dto.RoleIds!.Select(x => new QXIUserRole { RoleId = x, IsActive = true}).ToList();
            if (dto.SkillIds != null && dto.SkillIds.Count > 0)
            {
                e.ApplicantSkills = dto.SkillIds.Select(skillId => new ApplicantSkill { SkillId = skillId, IsActive = true }).ToList();
            }
            _userRepo.Insert(e);
            await _userRepo.SaveChangesAsync();
            if (string.IsNullOrWhiteSpace(e.UserCode))
            {
                var roleNames = await _roleRepo
                    .Query(r => dto.RoleIds!.Contains(r.Id), true)
                    .Select(r => r.RoleName)
                    .ToListAsync();
                e.UserCode = await UserCodeGenerator.NextCodeAsync(_dbContext, roleNames);
                _userRepo.Update(e);
                await _userRepo.SaveChangesAsync();
            }
            await UpsertOnlineProfilesAsync(e.Id, dto.OnlineProfiles);
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

            var query = _userRepo.GetAll(false);

            if (!IsAdminOrStaff)
            {
                query = query.Where(u =>
                    u.IsPublic &&
                    u.UserRoles.Any(ur =>
                        ur.Role.RoleName == Roles.Admin.ToString() ||
                        ur.Role.RoleName == Roles.Staff.ToString()));
            }

            var list = await query
                    .Select(u => new QXIUserDTO
                    {
                        Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Bio = u.Bio,
                        PhoneNumber = u.PhoneNumber,
                        Position = u.Position,
                        ProfilePictureUrl = u.ProfilePictureUrl,
                        UserCode = u.UserCode,
                        Email = u.Email,
                        Password = "********",   // masked value
                        IsPublic = u.IsPublic,
                        OnlineProfiles = u.OnlineProfiles.Select(p => new ApplicantOnlineProfileDto
                        {
                            Id = p.Id,
                            Platform = p.Platform,
                            Url = p.Url
                        }).ToList()
                    })
                    .ToListAsync();
            return list.Adapt<IEnumerable<QXIUserDTO>>();
        }

        public async Task<QXIUserDTO?> GetByIdAsync(int id)
        {
            var e = await _userRepo.Query(u => u.Id == id, false)
                        .Include(u => u.UserRoles)
                        .Include(u => u.ApplicantSkills)
                        .ThenInclude(ua => ua.Skill)
                        .Select(u => new QXIUserDTO
                        {
                            Id = u.Id,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        Bio = u.Bio,
                        PhoneNumber = u.PhoneNumber,
                        Position = u.Position,
                        ProfilePictureUrl = u.ProfilePictureUrl,
                        Email = u.Email,
                        UserCode = u.UserCode,
                        Password = "********",  // masked value
                        IsPublic = u.IsPublic,
                        OnlineProfiles = u.OnlineProfiles.Select(p => new ApplicantOnlineProfileDto
                        {
                            Id = p.Id,
                            Platform = p.Platform,
                            Url = p.Url
                        }).ToList(),
                        Roles = u.UserRoles!.Where(ur => ur.IsActive).Select(ur => new QXIRoleDTO
                        {
                            Id = ur.Role!.Id,
                            RoleName = ur.Role.RoleName,
                            Description = ur.Role.Description
                        }).ToList(),
                            Skills = u.ApplicantSkills!.Where(ua => ua.IsActive).Select(ua => new SkillDTO
                            {
                                Id = ua.Skill.Id,
                                Name = ua.Skill.Name,
                                Description = ua.Skill.Description,
                                IsActive = ua.Skill.IsActive
                            }).ToList()
                        })
                        .FirstOrDefaultAsync();
            if (e != null && !IsAdminOrStaff && e.IsPublic == false)
            {
                return null;
            }
            return e?.Adapt<QXIUserDTO>();
        }

        public async Task<QXIUserDTO?> UpdateAsync(int id, QXIUserDTO dto)
        {
            var e = await _dbContext.Users
                .IgnoreQueryFilters()
                .Include(u => u.ApplicantSkills)
                .Include(u => u.UserRoles)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (e == null) return null;
            // Keep existing password if none provided or empty
            if (string.IsNullOrWhiteSpace(dto.Password))
                dto.Password = e.Password;

            e.FirstName = dto.FirstName;
            e.LastName = dto.LastName;
            e.ProfilePictureUrl = dto.ProfilePictureUrl;
            e.Bio = dto.Bio;
            e.Position = dto.Position;
            e.PhoneNumber = dto.PhoneNumber;
            e.Password = dto.Password!;
            e.IsPublic = dto.IsPublic;

            if (dto.RoleIds != null)
            {
                var normalizedRoleIds = dto.RoleIds
                    .Where(roleId => roleId > 0)
                    .Distinct()
                    .ToList();

                e.UserRoles ??= new List<QXIUserRole>();

                // Deactivate all current roles first (single-role model)
                foreach (var role in e.UserRoles)
                {
                    role.IsActive = false;
                }

                foreach (var roleId in normalizedRoleIds)
                {
                    var current = e.UserRoles.FirstOrDefault(r => r.RoleId == roleId);
                    if (current == null)
                    {
                        e.UserRoles.Add(new QXIUserRole
                        {
                            UserId = e.Id,
                            RoleId = roleId,
                            IsActive = true
                        });
                    }
                    else
                    {
                        current.IsActive = true;
                    }
                }

                if (normalizedRoleIds.Count > 0)
                {
                    var roleNames = await _roleRepo
                        .Query(r => normalizedRoleIds.Contains(r.Id), true)
                        .Select(r => r.RoleName)
                        .ToListAsync();

                    var expectedPrefix = roleNames.Any(name => name.Equals(Roles.Admin.ToString(), StringComparison.OrdinalIgnoreCase))
                        ? "QXIADM"
                        : roleNames.Any(name => name.Equals(Roles.Staff.ToString(), StringComparison.OrdinalIgnoreCase))
                            ? "QXIEMP"
                            : "QXIUSR";

                    var currentPrefix = e.UserCode?.Split('-', 2).FirstOrDefault();
                    if (string.IsNullOrWhiteSpace(currentPrefix) || !currentPrefix.Equals(expectedPrefix, StringComparison.OrdinalIgnoreCase))
                    {
                        e.UserCode = await UserCodeGenerator.NextCodeAsync(_dbContext, roleNames);
                    }
                }
            }

            if (dto.SkillIds != null)
            {
                var normalizedSkillIds = dto.SkillIds
                    .Where(skillId => skillId > 0)
                    .Distinct()
                    .ToList();

                var existingSkills = e.ApplicantSkills.ToList();
                foreach (var existing in existingSkills)
                {
                    if (!normalizedSkillIds.Contains(existing.SkillId))
                    {
                        e.ApplicantSkills.Remove(existing);
                    }
                }

                foreach (var skillId in normalizedSkillIds)
                {
                    var current = e.ApplicantSkills.FirstOrDefault(s => s.SkillId == skillId);
                    if (current == null)
                    {
                        e.ApplicantSkills.Add(new ApplicantSkill
                        {
                            UserId = e.Id,
                            SkillId = skillId,
                            IsActive = true
                        });
                    }
                    else
                    {
                        current.IsActive = true;
                    }
                }
            }
            
            _userRepo.Update(e);
            await _userRepo.SaveChangesAsync();
            await UpsertOnlineProfilesAsync(e.Id, dto.OnlineProfiles);
            
            // hide password before returning
            var result = e.Adapt<QXIUserDTO>();
            result.Password = "********";

            return result;
        }

        public async Task<QXIUserDTO?> AuthenticateUser(AuthRequestDto auth)
        {
            var user = await _userRepo.Query(
                                        u => EF.Functions.ILike(u.Email, auth.UsernameOrEmail)
                                          && u.Password.Equals(auth.Password),
                                        true)
                                  .Include(u => u.UserRoles)
                                  .ThenInclude(ur => ur.Role)
                                  .FirstOrDefaultAsync();
            return user?.Adapt<QXIUserDTO>();
        }

        public async Task<bool> EmailOrPhoneExistsAsync(string email, string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(email) && string.IsNullOrWhiteSpace(phoneNumber))
            {
                return false;
            }

            var query = _userRepo.GetAll(true);

            if (!string.IsNullOrWhiteSpace(email) && !string.IsNullOrWhiteSpace(phoneNumber))
            {
                return await query.AnyAsync(u =>
                    EF.Functions.ILike(u.Email, email) || u.PhoneNumber == phoneNumber);
            }

            if (!string.IsNullOrWhiteSpace(email))
            {
                return await query.AnyAsync(u => EF.Functions.ILike(u.Email, email));
            }

            return await query.AnyAsync(u => u.PhoneNumber == phoneNumber);
        }

        public async Task<QXIUserDTO?> GetByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return null;
            }

            var normalized = email.Trim();

            var user = await _userRepo.Query(u => EF.Functions.ILike(u.Email, normalized), false)
                .Select(u => new QXIUserDTO
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    UserCode = u.UserCode,
                    IsPublic = u.IsPublic
                })
                .FirstOrDefaultAsync();

            return user;
        }

        public async Task<PagedResponse<QXIUserDTO>> GetAllAsync(RequestParams requestParams)
        {
            Expression<Func<QXIUser, object>> sort = x => x.Id; // Default sort
            var roleFilters = requestParams.Filters?
                .Where(f => f.FieldName != null &&
                            (f.FieldName.Equals("RoleName", StringComparison.OrdinalIgnoreCase) ||
                             f.FieldName.Equals("Role", StringComparison.OrdinalIgnoreCase)))
                .ToList();

            var remainingFilters = requestParams.Filters?
                .Except(roleFilters ?? new List<CommonFilterParams>())
                .ToList();

            Expression<Func<QXIUser, bool>> filter = PredicateBuilder.BuildFilterExpression<QXIUser>(remainingFilters);

            if (roleFilters != null && roleFilters.Count > 0)
            {
                Expression<Func<QXIUser, bool>>? roleExpr = null;
                foreach (var roleFilter in roleFilters)
                {
                    var roleValue = roleFilter.Value?.ToString();
                    if (string.IsNullOrWhiteSpace(roleValue))
                    {
                        continue;
                    }

                    var roleOperator = Operators.GetValue(roleFilter.Operator ?? "contains");
                    var rolePattern = roleValue.ToLikeFilterString(roleOperator);

                    Expression<Func<QXIUser, bool>> currentExpr = user =>
                        user.UserRoles.Any(ur =>
                            ur.IsActive &&
                            EF.Functions.ILike(ur.Role.RoleName, rolePattern));

                    if (roleExpr == null)
                    {
                        roleExpr = currentExpr;
                    }
                    else if (roleFilter.Condition?.Equals("or", StringComparison.OrdinalIgnoreCase) ?? false)
                    {
                        roleExpr = PredicateBuilder.Or(roleExpr, currentExpr);
                    }
                    else
                    {
                        roleExpr = PredicateBuilder.And(roleExpr, currentExpr);
                    }
                }

                if (roleExpr != null)
                {
                    filter = PredicateBuilder.And(filter, roleExpr);
                }
            }
            if (!string.IsNullOrWhiteSpace(requestParams.SearchKeyword))
            {
                var searchKeyword = requestParams.SearchKeyword.Trim().ToLikeFilterString(Operator.Contains);
                requestParams.SearchKeyword = searchKeyword;
                Expression<Func<QXIUser, bool>> searchExpr = ja => EF.Functions.ILike(ja.FirstName, searchKeyword)
                                                                   || EF.Functions.ILike(ja.LastName ?? string.Empty, searchKeyword)
                                                                   || EF.Functions.ILike(ja.Email, searchKeyword)
                                                                   || EF.Functions.ILike(ja.Position ?? string.Empty, searchKeyword)
                                                                   || EF.Functions.ILike(ja.PhoneNumber, searchKeyword)
                                                                   || EF.Functions.ILike(ja.Bio ?? string.Empty, searchKeyword)
                                                                   || ja.OnlineProfiles.Any(p =>
                                                                       EF.Functions.ILike(p.Platform, searchKeyword)
                                                                       || EF.Functions.ILike(p.Url, searchKeyword));

                filter = filter == null ? searchExpr : PredicateBuilder.And(filter, searchExpr);
            }

            if (!IsAdminOrStaff)
            {
                Expression<Func<QXIUser, bool>> visibilityFilter = u =>
                    u.IsPublic &&
                    u.UserRoles.Any(ur =>
                        ur.Role.RoleName == Roles.Admin.ToString() ||
                        ur.Role.RoleName == Roles.Staff.ToString());
                filter = filter == null ? visibilityFilter : PredicateBuilder.And(filter, visibilityFilter);
            }

            if (!string.IsNullOrWhiteSpace(requestParams.SortBy))
            {
                sort = PredicateBuilder.BuildSortExpression<QXIUser>(requestParams.SortBy);
            }

            (var total, var query) = await _userRepo.PagedQueryAsync(filter, sort, requestParams.Page, requestParams.PageSize, requestParams.IsDescending);

            var list = await query
                .Include(u => u.OnlineProfiles)
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .ToListAsync();

            return PagedResponse<QXIUserDTO>.Success(list.Adapt<List<QXIUserDTO>>(), total, requestParams, StatusCodes.Status200OK);

        }

        private async Task UpsertOnlineProfilesAsync(int userId, ICollection<ApplicantOnlineProfileDto>? onlineProfiles)
        {
            if (onlineProfiles == null)
            {
                return;
            }

            var existing = await _onlineProfileRepo.Query(p => p.UserId == userId, false).ToListAsync();
            if (existing.Count > 0)
            {
                _onlineProfileRepo.DeleteRange(existing);
            }

            var sanitized = onlineProfiles
                .Where(p => !string.IsNullOrWhiteSpace(p.Platform) && !string.IsNullOrWhiteSpace(p.Url))
                .Select(p => new ApplicantOnlineProfile
                {
                    UserId = userId,
                    Platform = p.Platform.Trim(),
                    Url = p.Url.Trim()
                })
                .ToList();

            if (sanitized.Count > 0)
            {
                _onlineProfileRepo.InsertRange(sanitized);
            }

            await _onlineProfileRepo.SaveChangesAsync();
        }
    }

}
