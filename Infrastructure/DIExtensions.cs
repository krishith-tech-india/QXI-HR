using Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure
{
    public static class DIExtensions
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            // Register Mapster mappings
            MapsterConfig.RegisterMappings();

            services.AddScoped<IJobPostService, JobPostService>();
            services.AddScoped<IJobApplicationService, JobApplicationService>();
            services.AddScoped<IImageCategoryService, ImageCategoryService>();
            services.AddScoped<IGallaryImageService, GallaryImageService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            return services;
        }
    }
}
