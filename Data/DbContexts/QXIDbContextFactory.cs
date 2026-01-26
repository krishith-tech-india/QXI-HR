using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;


namespace Data.DbContexts;

public class QXIDbContextFactory : IDesignTimeDbContextFactory<QXIDbContext>
    {
        public QXIDbContext CreateDbContext(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";

            // Build configuration to read appsettings.json (and appsettings.{Environment}.json if present)
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory()) // EF CLI current folder
                .AddJsonFile("appsettings.json")
                .AddJsonFile($"appsettings.{environment}.json", optional: true)
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<QXIDbContext>();

            // Read connection string from configuration
            var connectionStringName = environment.Equals("Development", StringComparison.OrdinalIgnoreCase)
                ? "PostgreSQLLocalConnection"
                : "PostgreSQLConnection";
            var connectionString = configuration.GetConnectionString(connectionStringName);
            optionsBuilder.UseNpgsql(connectionString);

            return new QXIDbContext(optionsBuilder.Options);
        }
    }
