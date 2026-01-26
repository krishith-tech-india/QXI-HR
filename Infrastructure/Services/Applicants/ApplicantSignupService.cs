using Core.DTOs;
using Core.Enums;
using Data.DbContexts;
using Data.Models;
using Data.Models.Identity;
using Data.Reopsitories;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class ApplicantSignupService : IApplicantSignupService
    {
        private readonly QXIDbContext _dbContext;
        private readonly IRepository<QXIUserRole> _userRoleRepo;
        private readonly IRepository<QXIRole> _roleRepo;
        private readonly IRepository<ApplicantProfile> _profileRepo;
        private readonly IRepository<ApplicantEmployment> _employmentRepo;
        private readonly IRepository<ApplicantEducation> _educationRepo;
        private readonly IRepository<ApplicantProject> _projectRepo;
        private readonly IRepository<ApplicantCertification> _certificationRepo;
        private readonly IRepository<ApplicantLanguage> _languageRepo;
        private readonly IRepository<ApplicantOnlineProfile> _onlineProfileRepo;
        private readonly IJobApplicationService _verificationService;

        public ApplicantSignupService(
            QXIDbContext dbContext,
            IRepository<QXIUserRole> userRoleRepo,
            IRepository<QXIRole> roleRepo,
            IRepository<ApplicantProfile> profileRepo,
            IRepository<ApplicantEmployment> employmentRepo,
            IRepository<ApplicantEducation> educationRepo,
            IRepository<ApplicantProject> projectRepo,
            IRepository<ApplicantCertification> certificationRepo,
            IRepository<ApplicantLanguage> languageRepo,
            IRepository<ApplicantOnlineProfile> onlineProfileRepo,
            IJobApplicationService verificationService)
        {
            _dbContext = dbContext;
            _userRoleRepo = userRoleRepo;
            _roleRepo = roleRepo;
            _profileRepo = profileRepo;
            _employmentRepo = employmentRepo;
            _educationRepo = educationRepo;
            _projectRepo = projectRepo;
            _certificationRepo = certificationRepo;
            _languageRepo = languageRepo;
            _onlineProfileRepo = onlineProfileRepo;
            _verificationService = verificationService;
        }

        public async Task StartAsync(ApplicantSignupStartDto dto)
        {
            var email = dto.Email.Trim();
            var phone = dto.PhoneNumber.Trim();

            var existsActive = await _dbContext.Users
                .IgnoreQueryFilters()
                .AnyAsync(u => u.IsActive && EF.Functions.ILike(u.Email, email));

            if (existsActive)
            {
                throw new InvalidOperationException("Email or phone number already exists.");
            }
        }

        public async Task<ApplicantSignupSessionDto?> VerifyAsync(VerifyEmailCodeRequest request)
        {
            var email = request.Email.Trim();
            var isValid = await _verificationService.VerifyEmailCodeAsync(email, request.VerificationCode);
            if (!isValid)
            {
                return null;
            }

            var user = await _dbContext.Users.IgnoreQueryFilters()
                .FirstOrDefaultAsync(u => EF.Functions.ILike(u.Email, email));

            var currentStep = await ResolveCurrentStepAsync(user?.Id);

            return new ApplicantSignupSessionDto
            {
                Email = email,
                PhoneNumber = user?.PhoneNumber ?? string.Empty,
                CurrentStep = currentStep,
                UserId = user?.Id ?? 0
            };
        }

        public async Task<ApplicantSignupDraftDto?> GetDraftAsync(string email, string verificationCode)
        {
            var normalizedEmail = email.Trim();
            var isValid = await _verificationService.VerifyEmailCodeAsync(normalizedEmail, verificationCode);
            if (!isValid)
            {
                return null;
            }

            var user = await _dbContext.Users.IgnoreQueryFilters()
                .Include(u => u.ApplicantSkills)
                .FirstOrDefaultAsync(u => EF.Functions.ILike(u.Email, normalizedEmail));

            if (user == null)
            {
                return null;
            }

            var profile = await _dbContext.ApplicantProfiles
                .Include(p => p.Employments)
                .Include(p => p.Educations)
                .Include(p => p.Projects)
                .Include(p => p.Certifications)
                .Include(p => p.Languages)
                .FirstOrDefaultAsync(p => p.UserId == user.Id);

            var currentStep = await ResolveCurrentStepAsync(user.Id);
            var onlineProfiles = await _dbContext.ApplicantOnlineProfiles
                .Where(p => p.UserId == user.Id)
                .ToListAsync();

            return new ApplicantSignupDraftDto
            {
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                CurrentStep = currentStep,
                IsEmailVerified = true,
                UserId = user.Id,
                FirstName = user.FirstName,
                MiddleName = profile?.MiddleName,
                LastName = user.LastName,
                DateOfBirth = profile?.DateOfBirth,
                ProfileImageUrl = profile?.ProfileImageUrl,
                ProfileHeadline = profile?.ProfileHeadline,
                ProfileSummary = profile?.ProfileSummary,
                PortfolioUrl = profile?.PortfolioUrl,
                ResumeUrl = profile?.ResumeUrl,
                AddressLine1 = profile?.AddressLine1,
                AddressLine2 = profile?.AddressLine2,
                City = profile?.City,
                State = profile?.State,
                Country = profile?.Country,
                PostalCode = profile?.PostalCode,
                SkillIds = user.ApplicantSkills?.Select(s => s.SkillId).ToList(),
                Employments = profile?.Employments?.Adapt<List<ApplicantEmploymentDto>>(),
                Educations = profile?.Educations?.Adapt<List<ApplicantEducationDto>>(),
                Projects = profile?.Projects?.Adapt<List<ApplicantProjectDto>>(),
                Certifications = profile?.Certifications?.Adapt<List<ApplicantCertificationDto>>(),
                Languages = profile?.Languages?.Adapt<List<ApplicantLanguageDto>>(),
                OnlineProfiles = onlineProfiles.Adapt<List<ApplicantOnlineProfileDto>>(),
            };
        }

        public async Task<ApplicantSignupDraftDto> SaveStep2Async(ApplicantSignupStep2Dto dto)
        {
            var normalizedEmail = dto.Email.Trim();
            await EnsureVerifiedAsync(normalizedEmail, dto.VerificationCode);

            var (user, profile) = await GetOrCreateProfileAsync(normalizedEmail, dto.PhoneNumber);

            user.FirstName = string.IsNullOrWhiteSpace(dto.FirstName) ? user.FirstName : dto.FirstName;
            user.LastName = dto.LastName;
            if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
            {
                user.PhoneNumber = dto.PhoneNumber;
            }

            profile.MiddleName = dto.MiddleName;
            profile.DateOfBirth = dto.DateOfBirth;
            profile.ProfileImageUrl = dto.ProfileImageUrl;
            profile.SignupStep = Math.Max(profile.SignupStep, 2);

            await _dbContext.SaveChangesAsync();

            return await GetDraftAsync(normalizedEmail, dto.VerificationCode) ?? new ApplicantSignupDraftDto();
        }

        public async Task<ApplicantSignupDraftDto> SaveStep3Async(ApplicantSignupStep3Dto dto)
        {
            var normalizedEmail = dto.Email.Trim();
            await EnsureVerifiedAsync(normalizedEmail, dto.VerificationCode);

            var (user, profile) = await GetOrCreateProfileAsync(normalizedEmail, null);

            profile.ProfileHeadline = dto.ProfileHeadline;
            profile.ProfileSummary = dto.ProfileSummary;
            profile.PortfolioUrl = dto.PortfolioUrl;
            profile.ResumeUrl = dto.ResumeUrl;
            profile.SignupStep = Math.Max(profile.SignupStep, 3);

            if (dto.SkillIds != null)
            {
                var normalizedSkillIds = dto.SkillIds
                    .Where(id => id > 0)
                    .Distinct()
                    .ToList();

                user.ApplicantSkills ??= new List<ApplicantSkill>();

                var existingSkills = user.ApplicantSkills.ToList();
                foreach (var existing in existingSkills)
                {
                    if (!normalizedSkillIds.Contains(existing.SkillId))
                    {
                        user.ApplicantSkills.Remove(existing);
                    }
                }

                foreach (var skillId in normalizedSkillIds)
                {
                    var current = user.ApplicantSkills.FirstOrDefault(s => s.SkillId == skillId);
                    if (current == null)
                    {
                        user.ApplicantSkills.Add(new ApplicantSkill
                        {
                            UserId = user.Id,
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

            await _dbContext.SaveChangesAsync();

            return await GetDraftAsync(normalizedEmail, dto.VerificationCode) ?? new ApplicantSignupDraftDto();
        }

        public async Task<ApplicantSignupDraftDto> SaveStep4Async(ApplicantSignupStep4Dto dto)
        {
            var normalizedEmail = dto.Email.Trim();
            await EnsureVerifiedAsync(normalizedEmail, dto.VerificationCode);

            var (user, profile) = await GetOrCreateProfileAsync(normalizedEmail, null);

            var employments = await _employmentRepo.Query(e => e.UserId == user.Id, false).ToListAsync();
            if (employments.Count > 0)
            {
                _employmentRepo.DeleteRange(employments);
            }

            var educations = await _educationRepo.Query(e => e.UserId == user.Id, false).ToListAsync();
            if (educations.Count > 0)
            {
                _educationRepo.DeleteRange(educations);
            }

            profile.Employments = (dto.Employments ?? new List<ApplicantEmploymentDto>())
                .Select(x => x.Adapt<ApplicantEmployment>())
                .Select(x =>
                {
                    x.Id = 0;
                    x.UserId = user.Id;
                    return x;
                })
                .ToList();

            profile.Educations = (dto.Educations ?? new List<ApplicantEducationDto>())
                .Select(x => x.Adapt<ApplicantEducation>())
                .Select(x =>
                {
                    x.Id = 0;
                    x.UserId = user.Id;
                    return x;
                })
                .ToList();

            profile.SignupStep = Math.Max(profile.SignupStep, 4);

            await _dbContext.SaveChangesAsync();

            return await GetDraftAsync(normalizedEmail, dto.VerificationCode) ?? new ApplicantSignupDraftDto();
        }

        public async Task<ApplicantSignupDraftDto> SaveStep5Async(ApplicantSignupStep5Dto dto)
        {
            var normalizedEmail = dto.Email.Trim();
            await EnsureVerifiedAsync(normalizedEmail, dto.VerificationCode);

            var (user, profile) = await GetOrCreateProfileAsync(normalizedEmail, null);

            if (string.IsNullOrWhiteSpace(dto.Password))
            {
                throw new InvalidOperationException("Password is required to complete signup.");
            }

            user.Password = dto.Password;
            user.IsActive = true;

            profile.AddressLine1 = dto.AddressLine1;
            profile.AddressLine2 = dto.AddressLine2;
            profile.City = dto.City;
            profile.State = dto.State;
            profile.Country = dto.Country;
            profile.PostalCode = dto.PostalCode;
            profile.SignupStep = Math.Max(profile.SignupStep, 5);

            var projects = await _projectRepo.Query(e => e.UserId == user.Id, false).ToListAsync();
            if (projects.Count > 0)
            {
                _projectRepo.DeleteRange(projects);
            }

            var certifications = await _certificationRepo.Query(e => e.UserId == user.Id, false).ToListAsync();
            if (certifications.Count > 0)
            {
                _certificationRepo.DeleteRange(certifications);
            }

            var languages = await _languageRepo.Query(e => e.UserId == user.Id, false).ToListAsync();
            if (languages.Count > 0)
            {
                _languageRepo.DeleteRange(languages);
            }

            var onlineProfiles = await _onlineProfileRepo.Query(e => e.UserId == user.Id, false).ToListAsync();
            if (onlineProfiles.Count > 0)
            {
                _onlineProfileRepo.DeleteRange(onlineProfiles);
            }

            profile.Projects = (dto.Projects ?? new List<ApplicantProjectDto>())
                .Select(x => x.Adapt<ApplicantProject>())
                .Select(x =>
                {
                    x.Id = 0;
                    x.UserId = user.Id;
                    return x;
                })
                .ToList();

            profile.Certifications = (dto.Certifications ?? new List<ApplicantCertificationDto>())
                .Select(x => x.Adapt<ApplicantCertification>())
                .Select(x =>
                {
                    x.Id = 0;
                    x.UserId = user.Id;
                    return x;
                })
                .ToList();

            profile.Languages = (dto.Languages ?? new List<ApplicantLanguageDto>())
                .Select(x => x.Adapt<ApplicantLanguage>())
                .Select(x =>
                {
                    x.Id = 0;
                    x.UserId = user.Id;
                    return x;
                })
                .ToList();

            var sanitizedProfiles = (dto.OnlineProfiles ?? new List<ApplicantOnlineProfileDto>())
                .Where(p => !string.IsNullOrWhiteSpace(p.Platform) && !string.IsNullOrWhiteSpace(p.Url))
                .Select(x => new ApplicantOnlineProfile
                {
                    UserId = user.Id,
                    Platform = x.Platform.Trim(),
                    Url = x.Url.Trim()
                })
                .ToList();

            if (sanitizedProfiles.Count > 0)
            {
                _onlineProfileRepo.InsertRange(sanitizedProfiles);
            }

            // Repository deletes clear change tracker, so reattach updated entities
            _dbContext.Users.Update(user);
            _dbContext.ApplicantProfiles.Update(profile);

            await _dbContext.SaveChangesAsync();

            return await GetDraftAsync(normalizedEmail, dto.VerificationCode) ?? new ApplicantSignupDraftDto();
        }

        private async Task EnsureVerifiedAsync(string email, string verificationCode)
        {
            var isValid = await _verificationService.VerifyEmailCodeAsync(email, verificationCode);
            if (!isValid)
            {
                throw new InvalidOperationException("Invalid verification code.");
            }
        }

        private async Task<(QXIUser user, ApplicantProfile profile)> GetOrCreateProfileAsync(string email, string? phoneNumber)
        {
            var user = await _dbContext.Users.IgnoreQueryFilters()
                .Include(u => u.ApplicantSkills)
                .Include(u => u.UserRoles)
                .FirstOrDefaultAsync(u => EF.Functions.ILike(u.Email, email));

            var applicantRole = await _roleRepo.Query(r => r.RoleName == Roles.Applicant.ToString(), true)
                .FirstOrDefaultAsync();
            if (applicantRole == null)
            {
                throw new InvalidOperationException("Applicant role not found.");
            }

            if (user == null)
            {
                user = new QXIUser
                {
                    FirstName = "Applicant",
                    LastName = null,
                    Email = email,
                    PhoneNumber = phoneNumber ?? string.Empty,
                    Password = Guid.NewGuid().ToString("N"),
                    IsPublic = true,
                    IsActive = false
                };

                _dbContext.Users.Add(user);
                await _dbContext.SaveChangesAsync();

                var userRole = new QXIUserRole
                {
                    UserId = user.Id,
                    RoleId = applicantRole.Id,
                    IsActive = true
                };

                _userRoleRepo.Insert(userRole);
                await _userRoleRepo.SaveChangesAsync();

                if (string.IsNullOrWhiteSpace(user.UserCode))
                {
                    user.UserCode = await UserCodeGenerator.NextCodeAsync(_dbContext, new[] { applicantRole.RoleName });
                    _dbContext.Users.Update(user);
                    await _dbContext.SaveChangesAsync();
                }
            }
            else
            {
                var existingApplicantRole = user.UserRoles.FirstOrDefault(ur => ur.RoleId == applicantRole.Id);
                if (existingApplicantRole == null)
                {
                    var userRole = new QXIUserRole
                    {
                        UserId = user.Id,
                        RoleId = applicantRole.Id,
                        IsActive = true
                    };
                    _userRoleRepo.Insert(userRole);
                    await _userRoleRepo.SaveChangesAsync();
                }
                else if (!existingApplicantRole.IsActive)
                {
                    existingApplicantRole.IsActive = true;
                    _userRoleRepo.Update(existingApplicantRole);
                    await _userRoleRepo.SaveChangesAsync();
                }
            }

            var profile = await _dbContext.ApplicantProfiles
                .Include(p => p.Employments)
                .Include(p => p.Educations)
                .Include(p => p.Projects)
                .Include(p => p.Certifications)
                .Include(p => p.Languages)
                .FirstOrDefaultAsync(p => p.UserId == user.Id);

            if (profile == null)
            {
                profile = new ApplicantProfile
                {
                    UserId = user.Id,
                    ProfileHeadline = "Pending",
                    SignupStep = 1
                };

                _profileRepo.Insert(profile);
                await _profileRepo.SaveChangesAsync();
            }

            return (user, profile);
        }

        private async Task<int> ResolveCurrentStepAsync(int? userId)
        {
            if (!userId.HasValue)
            {
                return 1;
            }

            var profile = await _dbContext.ApplicantProfiles
                .FirstOrDefaultAsync(p => p.UserId == userId.Value);

            if (profile == null)
            {
                return 2;
            }

            return Math.Clamp(profile.SignupStep, 1, 5);
        }
    }
}
