using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;


namespace Data.DbContexts;

public class QXIDbContextFactory : IDesignTimeDbContextFactory<QXIDbContext>
    {
        public QXIDbContext CreateDbContext(string[] args)
        {
            // Build configuration to read appsettings.json
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory()) // EF CLI current folder
                .AddJsonFile("appsettings.json")
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<QXIDbContext>();
            
            // Read connection string from configuration
            var connectionString = configuration.GetConnectionString("PostgreSQLConnection");
            optionsBuilder.UseNpgsql(connectionString);

            return new QXIDbContext(optionsBuilder.Options);
        }
    }
