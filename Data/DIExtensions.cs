using Data.DbContexts;
using Data.Reopsitories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;


namespace Data
{
    public static class DIExtensions
    {
        public static void AddQXIDbContext(this IServiceCollection services, string connectionString)
        {
            if (services is null) throw new ArgumentNullException(nameof(services));
            if (string.IsNullOrWhiteSpace(connectionString)) throw new ArgumentException("Connection string must be provided.", nameof(connectionString));

            services.AddDbContext<QXIDbContext>(options =>
                options.UseNpgsql(connectionString));
        }

        public static void AddRepositories(this IServiceCollection services)
        {
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        }
    }
}
