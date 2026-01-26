using Core.DTOs;
using Data.Models;
using Data.Models.Identity;
using Mapster;

namespace Infrastructure
{
    public static class MapsterConfig
    {
        public static void RegisterMappings()
        {
            // Jobs
            TypeAdapterConfig<JobPost, JobPostDTO>.NewConfig().PreserveReference(true)
                .Map(dest => dest.SkillIds, source => source.JobPostSkills.Select(x => x.SkillId))
                .Map(dest => dest.Skills, source => source.JobPostSkills.Select(x => x.Skill));
            TypeAdapterConfig<JobApplication, JobApplicationDTO>.NewConfig().PreserveReference(true);

            // Identity
            TypeAdapterConfig<QXIUser, QXIUserDTO>.NewConfig().PreserveReference(true)
                .Map(dest => dest.Roles, source => source.UserRoles.Select(x => x.Role))
                .Map(dest => dest.SkillIds, source => source.ApplicantSkills.Select(x => x.SkillId))
                .Map(dest => dest.Skills, source => source.ApplicantSkills.Select(x => x.Skill))
                .Map(dest => dest.OnlineProfiles, source => source.OnlineProfiles);
            TypeAdapterConfig<QXIRole, QXIRoleDTO>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<Skill, SkillDTO>.NewConfig().PreserveReference(true);

            // Applicants
            TypeAdapterConfig<ApplicantProfile, ApplicantProfileDto>.NewConfig().PreserveReference(true)
                .Map(dest => dest.FirstName, source => source.User.FirstName)
                .Map(dest => dest.LastName, source => source.User.LastName)
                .Map(dest => dest.Email, source => source.User.Email)
                .Map(dest => dest.PhoneNumber, source => source.User.PhoneNumber)
                .Map(dest => dest.IsPublic, source => source.User.IsPublic)
                .Map(dest => dest.SkillIds, source => source.User.ApplicantSkills.Select(x => x.SkillId))
                .Map(dest => dest.Skills, source => source.User.ApplicantSkills.Select(x => x.Skill))
                .Map(dest => dest.OnlineProfiles, source => source.User.OnlineProfiles);
            TypeAdapterConfig<ApplicantEmployment, ApplicantEmploymentDto>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<ApplicantEducation, ApplicantEducationDto>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<ApplicantProject, ApplicantProjectDto>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<ApplicantOnlineProfile, ApplicantOnlineProfileDto>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<ApplicantCertification, ApplicantCertificationDto>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<ApplicantLanguage, ApplicantLanguageDto>.NewConfig().PreserveReference(true);

            TypeAdapterConfig<ApplicantEmploymentDto, ApplicantEmployment>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<ApplicantEducationDto, ApplicantEducation>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<ApplicantProjectDto, ApplicantProject>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<ApplicantOnlineProfileDto, ApplicantOnlineProfile>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<ApplicantCertificationDto, ApplicantCertification>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<ApplicantLanguageDto, ApplicantLanguage>.NewConfig().PreserveReference(true);

            // Media
            TypeAdapterConfig<ImageCategory, ImageCategoryDTO>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<GallaryImage, GallaryImageDTO>.NewConfig().PreserveReference(true);

            // Clients
            TypeAdapterConfig<Client, ClientDTO>.NewConfig().PreserveReference(true);
        }
    }
}
