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
            TypeAdapterConfig<JobPost, JobPostDTO>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<JobApplication, JobApplicationDTO>.NewConfig().PreserveReference(true);

            // Identity
            TypeAdapterConfig<QXIUser, QXIUserDTO>.NewConfig().PreserveReference(true)
                .Map(dest => dest.Roles, source => source.UserRoles.Select(x => x.Role));
            TypeAdapterConfig<QXIRole, QXIRoleDTO>.NewConfig().PreserveReference(true);

            // Media
            TypeAdapterConfig<ImageCategory, ImageCategoryDTO>.NewConfig().PreserveReference(true);
            TypeAdapterConfig<GallaryImage, GallaryImageDTO>.NewConfig().PreserveReference(true);
        }
    }
}