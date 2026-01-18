using Amazon.S3;
using Amazon.S3.Model;
using Core.DTOs;
using Core.Enums;
using Data.Models;
using Data.Reopsitories;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class ApplicantProfileService : IApplicantProfileService
    {
        private readonly IRepository<ApplicantProfile> _profileRepo;
        private readonly IRepository<ApplicantEmployment> _employmentRepo;
        private readonly IRepository<ApplicantEducation> _educationRepo;
        private readonly IRepository<ApplicantProject> _projectRepo;
        private readonly IRepository<ApplicantOnlineProfile> _onlineProfileRepo;
        private readonly IRepository<ApplicantCertification> _certificationRepo;
        private readonly IRepository<ApplicantLanguage> _languageRepo;
        private readonly IRepository<QXIUser> _userRepo;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IAmazonS3 _s3Client;
        private readonly R2Settings _r2Settings;

        private bool IsAdminOrStaff =>
            _httpContextAccessor.HttpContext?.User?.IsInRole(Roles.Admin.ToString()) == true ||
            _httpContextAccessor.HttpContext?.User?.IsInRole(Roles.Staff.ToString()) == true;

        public ApplicantProfileService(
            IRepository<ApplicantProfile> profileRepo,
            IRepository<ApplicantEmployment> employmentRepo,
            IRepository<ApplicantEducation> educationRepo,
            IRepository<ApplicantProject> projectRepo,
            IRepository<ApplicantOnlineProfile> onlineProfileRepo,
            IRepository<ApplicantCertification> certificationRepo,
            IRepository<ApplicantLanguage> languageRepo,
            IRepository<QXIUser> userRepo,
            IHttpContextAccessor httpContextAccessor,
            IAmazonS3 s3Client,
            R2Settings r2Settings)
        {
            _profileRepo = profileRepo;
            _employmentRepo = employmentRepo;
            _educationRepo = educationRepo;
            _projectRepo = projectRepo;
            _onlineProfileRepo = onlineProfileRepo;
            _certificationRepo = certificationRepo;
            _languageRepo = languageRepo;
            _userRepo = userRepo;
            _httpContextAccessor = httpContextAccessor;
            _s3Client = s3Client;
            _r2Settings = r2Settings;
        }

        public async Task<ApplicantProfileDto?> GetByUserIdAsync(int userId)
        {
            var profile = await BuildProfileQuery(userId).FirstOrDefaultAsync();
            if (profile == null)
            {
                return null;
            }

            if (!IsAdminOrStaff && profile.User?.IsPublic == false)
            {
                return null;
            }

            return profile.Adapt<ApplicantProfileDto>();
        }

        public async Task<ApplicantProfileDto?> GetByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return null;
            }

            var normalized = email.Trim();
            var user = await _userRepo.Query(u => EF.Functions.ILike(u.Email, normalized), false)
                .Select(u => new { u.Id })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return null;
            }

            return await GetByUserIdAsync(user.Id);
        }

        public async Task<ApplicantProfileDto> UpsertAsync(int userId, ApplicantProfileUpsertDto dto)
        {
            var profile = await _profileRepo.Query(p => p.UserId == userId, false)
                .Include(p => p.Employments)
                .Include(p => p.Educations)
                .Include(p => p.Projects)
                .Include(p => p.OnlineProfiles)
                .Include(p => p.Certifications)
                .Include(p => p.Languages)
                .FirstOrDefaultAsync();

            if (profile == null)
            {
                profile = new ApplicantProfile { UserId = userId };
                ApplyProfileData(profile, userId, dto);
                _profileRepo.Insert(profile);
            }
            else
            {
                await ClearExistingCollections(userId);
                ApplyProfileData(profile, userId, dto);
                _profileRepo.Update(profile);
            }

            await _profileRepo.SaveChangesAsync();

            var updated = await BuildProfileQuery(userId).FirstOrDefaultAsync();
            return updated!.Adapt<ApplicantProfileDto>();
        }

        public async Task<ResumePresignedUrlDto> GetUploadUrl(string filename, string category)
        {
            if (string.IsNullOrWhiteSpace(filename))
            {
                throw new Exception("Filename is required.");
            }

            var prefix = ResolveUploadPrefix(category);
            var key = $"{prefix}/{Guid.NewGuid()}_{filename}";

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _r2Settings.BucketName,
                Key = key,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(_r2Settings.PreSignedUrlExpiryInMinutes),
            };

            var url = await _s3Client.GetPreSignedURLAsync(request);
            var fileAccessUrl = $"{_r2Settings.CustomDomain}/{key}";

            return new ResumePresignedUrlDto
            {
                uploadUrl = url,
                fileUrl = fileAccessUrl
            };
        }

        private IQueryable<ApplicantProfile> BuildProfileQuery(int userId)
        {
            return _profileRepo.Query(p => p.UserId == userId, false)
                .Include(p => p.User)
                    .ThenInclude(u => u.ApplicantSkills)
                        .ThenInclude(us => us.Skill)
                .Include(p => p.Employments)
                .Include(p => p.Educations)
                .Include(p => p.Projects)
                .Include(p => p.OnlineProfiles)
                .Include(p => p.Certifications)
                .Include(p => p.Languages);
        }

        private static string ResolveUploadPrefix(string category)
        {
            if (string.IsNullOrWhiteSpace(category))
            {
                return "applicant-files";
            }

            switch (category.Trim().ToLowerInvariant())
            {
                case "profile":
                case "profile-image":
                case "image":
                    return "applicant-profile-images";
                case "resume":
                    return "applicant-resumes";
                default:
                    return "applicant-files";
            }
        }

        private async Task ClearExistingCollections(int userId)
        {
            var employments = await _employmentRepo.Query(e => e.UserId == userId, false).ToListAsync();
            if (employments.Count > 0)
            {
                _employmentRepo.DeleteRange(employments);
            }

            var educations = await _educationRepo.Query(e => e.UserId == userId, false).ToListAsync();
            if (educations.Count > 0)
            {
                _educationRepo.DeleteRange(educations);
            }

            var projects = await _projectRepo.Query(e => e.UserId == userId, false).ToListAsync();
            if (projects.Count > 0)
            {
                _projectRepo.DeleteRange(projects);
            }

            var onlineProfiles = await _onlineProfileRepo.Query(e => e.UserId == userId, false).ToListAsync();
            if (onlineProfiles.Count > 0)
            {
                _onlineProfileRepo.DeleteRange(onlineProfiles);
            }

            var certifications = await _certificationRepo.Query(e => e.UserId == userId, false).ToListAsync();
            if (certifications.Count > 0)
            {
                _certificationRepo.DeleteRange(certifications);
            }

            var languages = await _languageRepo.Query(e => e.UserId == userId, false).ToListAsync();
            if (languages.Count > 0)
            {
                _languageRepo.DeleteRange(languages);
            }
        }

        private static void ApplyProfileData(ApplicantProfile profile, int userId, ApplicantProfileUpsertDto dto)
        {
            profile.ProfileHeadline = dto.ProfileHeadline;
            profile.ProfileSummary = dto.ProfileSummary;
            profile.PortfolioUrl = dto.PortfolioUrl;
            profile.ResumeUrl = dto.ResumeUrl;
            profile.ProfileImageUrl = dto.ProfileImageUrl;
            profile.MiddleName = dto.MiddleName;
            profile.DateOfBirth = dto.DateOfBirth;
            profile.AddressLine1 = dto.AddressLine1;
            profile.AddressLine2 = dto.AddressLine2;
            profile.City = dto.City;
            profile.State = dto.State;
            profile.Country = dto.Country;
            profile.PostalCode = dto.PostalCode;

            profile.Employments = (dto.Employments ?? new List<ApplicantEmploymentDto>())
                .Select(x => x.Adapt<ApplicantEmployment>())
                .Select(x => { x.Id = 0; x.UserId = userId; return x; })
                .ToList();

            profile.Educations = (dto.Educations ?? new List<ApplicantEducationDto>())
                .Select(x => x.Adapt<ApplicantEducation>())
                .Select(x => { x.Id = 0; x.UserId = userId; return x; })
                .ToList();

            profile.Projects = (dto.Projects ?? new List<ApplicantProjectDto>())
                .Select(x => x.Adapt<ApplicantProject>())
                .Select(x => { x.Id = 0; x.UserId = userId; return x; })
                .ToList();

            profile.OnlineProfiles = (dto.OnlineProfiles ?? new List<ApplicantOnlineProfileDto>())
                .Select(x => x.Adapt<ApplicantOnlineProfile>())
                .Select(x => { x.Id = 0; x.UserId = userId; return x; })
                .ToList();

            profile.Certifications = (dto.Certifications ?? new List<ApplicantCertificationDto>())
                .Select(x => x.Adapt<ApplicantCertification>())
                .Select(x => { x.Id = 0; x.UserId = userId; return x; })
                .ToList();

            profile.Languages = (dto.Languages ?? new List<ApplicantLanguageDto>())
                .Select(x => x.Adapt<ApplicantLanguage>())
                .Select(x => { x.Id = 0; x.UserId = userId; return x; })
                .ToList();
        }
    }
}
