﻿using Core.DTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace API
{
    public static class DIExtensions
    {
        public static void AddCoreDependencies(this IServiceCollection services, IConfiguration configuration, string corsPolicy)
        {
            AppSettings? appSettings = configuration.GetSection("AppSettings").Get<AppSettings>();

            services.AddJWT(configuration);

            object value1 = services.AddHttpContextAccessor();

            object value = services.AddCors(options =>
            {
                options.AddPolicy(name: corsPolicy,
                                  policy =>
                                  {
                                      policy.WithOrigins(appSettings!.ClientList)
                                      .AllowAnyHeader()
                                      .AllowAnyMethod()
                                      .WithExposedHeaders("Content-Disposition");
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
                    ValidAlgorithms = new string[] { SecurityAlgorithms.Aes256CbcHmacSha512 },
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = appSettings.APIUrl!,
                    ValidAudiences = appSettings!.ClientList!.Append(appSettings.APIUrl),
                    ClockSkew = TimeSpan.Zero,
                };
            });
        }
    }
}
