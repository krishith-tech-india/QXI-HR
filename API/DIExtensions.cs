using Core.DTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Amazon.S3;
using Amazon.Runtime;

namespace API
{
    public static class DIExtensions
    {
        public static void AddCoreDependencies(this IServiceCollection services, IConfiguration configuration, string corsPolicy)
        {

            services.AddHttpContextAccessor();
            AppSettings? appSettings = configuration.GetSection("AppSettings").Get<AppSettings>();

            services.AddJWT(configuration);
            services.AddR2Settings(configuration);

            // Bind EmailSettings from configuration and register for DI
            var emailSettings = configuration.GetSection("EmailSettings").Get<EmailSettings>();
            if (emailSettings != null)
            {
                services.AddSingleton(emailSettings);
            }

            object value1 = services.AddHttpContextAccessor();

            object value = services.AddCors(options =>
            {
                options.AddPolicy(corsPolicy, policy =>
                {
                    if (appSettings!.ClientList.Contains("*"))
                    {
                        // Allow all origins (for development/testing)
                        policy.AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .WithExposedHeaders("Content-Disposition");
                    }
                    else
                    {
                        // Allow only the configured origins
                        policy.WithOrigins(appSettings!.ClientList.ToArray())
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .WithExposedHeaders("Content-Disposition");
                    }
                });

            });
        }

        public static void AddJWT(this IServiceCollection services, IConfiguration configuration)
        {
            AppSettings? appSettings = configuration.GetSection("AppSettings").Get<AppSettings>();
            byte[] key = Encoding.ASCII.GetBytes(appSettings!.SecurityKey!);

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = appSettings.APIUrl!,
                    ValidAudiences = appSettings!.ClientList!.Append(appSettings.APIUrl!).ToArray(),
                    ClockSkew = TimeSpan.Zero,
                };
            });
        }

        public static void AddR2Settings(this IServiceCollection services, IConfiguration configuration)
        {
            // Bind R2 settings
            R2Settings? r2Settings = configuration.GetSection("CloudflareR2").Get<R2Settings>();
            if (r2Settings == null)
                throw new Exception("CloudflareR2 section missing in appsettings.json");

            // Configure R2 endpoint
            var awsConfig = new AmazonS3Config
            {
                ServiceURL = r2Settings.ServiceUrl,
                ForcePathStyle = true,
                AuthenticationRegion = "auto" 
            };

            var creds = new BasicAWSCredentials(r2Settings.AccessKeyId, r2Settings.SecretAccessKey);
            var s3Client = new AmazonS3Client(creds, awsConfig);

            // Register for dependency injection
            services.AddSingleton<IAmazonS3>(s3Client);
            services.AddSingleton(r2Settings); // so you can inject R2Settings later if needed
        } 
    }
}
