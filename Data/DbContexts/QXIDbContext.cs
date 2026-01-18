using System.Linq.Expressions;
using System.Reflection.Metadata;
using Data.Models;
using Data.Models.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Data.DbContexts
{
    public class QXIDbContext(DbContextOptions<QXIDbContext> options) : DbContext(options)
    {

        public virtual DbSet<QXIUser> Users { get; set; }

        public virtual DbSet<QXIRole> Roles { get; set; }

        public virtual DbSet<QXIUserRole> UserRoles { get; set; }

        public virtual DbSet<JobPost> JobPosts { get; set; }

        public virtual DbSet<EmailVerificationCode> EmailVerificationCodes { get; set; }

        public virtual DbSet<GallaryImage> GallaryImages { get; set; }

        public virtual DbSet<ImageCategory> ImageCategories { get; set; }

        public virtual DbSet<JobApplication> JobApplications { get; set; }

        public virtual DbSet<Client> Clients { get; set; }
        public virtual DbSet<Skill> Skills { get; set; }
        public virtual DbSet<JobPostSkill> JobPostSkills { get; set; }
        public virtual DbSet<ApplicantSkill> ApplicantSkills { get; set; }
        public virtual DbSet<ApplicantProfile> ApplicantProfiles { get; set; }
        public virtual DbSet<ApplicantEmployment> ApplicantEmployments { get; set; }
        public virtual DbSet<ApplicantEducation> ApplicantEducations { get; set; }
        public virtual DbSet<ApplicantProject> ApplicantProjects { get; set; }
        public virtual DbSet<ApplicantOnlineProfile> ApplicantOnlineProfiles { get; set; }
        public virtual DbSet<ApplicantCertification> ApplicantCertifications { get; set; }
        public virtual DbSet<ApplicantLanguage> ApplicantLanguages { get; set; }

        public override int SaveChanges()
        {
            HandleDefaultFieldChanges();

            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            HandleDefaultFieldChanges();

            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Model.GetEntityTypes()
                .Where(t => typeof(EntityBase).IsAssignableFrom(t.ClrType))
                .ToList()
                .ForEach(entityType =>
                {
                    var parameter = Expression.Parameter(entityType.ClrType, "x");
                    var filter = Expression.Lambda(
                        Expression.Equal(
                            Expression.Property(parameter, nameof(EntityBase.IsActive)),
                            Expression.Constant(true)
                        ),
                        parameter
                    );

                    modelBuilder.Entity(entityType.ClrType).HasIndex("IsActive").HasDatabaseName($"IX_{entityType.GetTableName()}_IsActive");

                    modelBuilder.Entity(entityType.ClrType).HasQueryFilter(filter);
                });

            string isActiveFilter = "\"IsActive\" = true";


            modelBuilder.Entity<QXIUser>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasMany(x => x.UserRoles)
                      .WithOne(ur => ur.User)
                      .HasForeignKey(ur => ur.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasMany(x => x.ApplicantSkills)
                      .WithOne(ua => ua.User)
                      .HasForeignKey(ua => ua.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.Email).IsUnique(true).HasDatabaseName("UQ_Users_Email").HasFilter(isActiveFilter);
                entity.HasIndex(e => e.PhoneNumber).IsUnique(true).HasDatabaseName("UQ_Users_PhoneNumber").HasFilter(isActiveFilter);
            });

            modelBuilder.Entity<QXIRole>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasMany(x => x.UserRoles)
                      .WithOne(ur => ur.Role)
                      .HasForeignKey(ur => ur.RoleId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.RoleName).IsUnique(true).HasDatabaseName("UQ_Roles_RoleName").HasFilter(isActiveFilter);
            });

            modelBuilder.Entity<QXIUserRole>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.RoleId });
                entity.HasOne(ur => ur.User)
                      .WithMany(u => u.UserRoles)
                      .HasForeignKey(ur => ur.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(ur => ur.Role)
                      .WithMany(r => r.UserRoles)
                      .HasForeignKey(ur => ur.RoleId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ImageCategory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasMany(e => e.Images)
                      .WithOne(navigationExpression: e => e.Category)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<GallaryImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Category)
                      .WithMany()
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<JobPost>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasMany(jp => jp.Applications)
                    .WithOne(ja => ja.JobPost)
                    .HasForeignKey(ja => ja.JobPostId)
                    .OnDelete(DeleteBehavior.Cascade);
                entity.HasMany(jp => jp.JobPostSkills)
                    .WithOne(jps => jps.JobPost)
                    .HasForeignKey(jps => jps.JobPostId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<JobApplication>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.ApplicantUser)
                      .WithMany(u => u.JobApplications)
                      .HasForeignKey(e => e.ApplicantUserId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<EmailVerificationCode>(entity =>
            {
                entity.HasKey(e => e.Id);
                // create unique index on Email for active records
                entity.HasIndex(e => e.Email).IsUnique(true).HasDatabaseName("UQ_EmailVerificationCodes_Email").HasFilter(isActiveFilter);
            });

            modelBuilder.Entity<Client>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            modelBuilder.Entity<Skill>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique(true).HasDatabaseName("UQ_Skills_Name").HasFilter(isActiveFilter);
            });

            modelBuilder.Entity<JobPostSkill>(entity =>
            {
                entity.HasKey(e => new { e.JobPostId, e.SkillId });
                entity.HasOne(e => e.JobPost)
                      .WithMany(j => j.JobPostSkills)
                      .HasForeignKey(e => e.JobPostId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Skill)
                      .WithMany(s => s.JobPostSkills)
                      .HasForeignKey(e => e.SkillId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ApplicantSkill>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.SkillId });
                entity.HasOne(e => e.User)
                      .WithMany(u => u.ApplicantSkills)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Skill)
                      .WithMany(s => s.ApplicantSkills)
                      .HasForeignKey(e => e.SkillId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ApplicantProfile>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.HasOne(e => e.User)
                      .WithOne(u => u.ApplicantProfile)
                      .HasForeignKey<ApplicantProfile>(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ApplicantEmployment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Profile)
                      .WithMany(p => p.Employments)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ApplicantEducation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Profile)
                      .WithMany(p => p.Educations)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ApplicantProject>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Profile)
                      .WithMany(p => p.Projects)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ApplicantOnlineProfile>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Profile)
                      .WithMany(p => p.OnlineProfiles)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ApplicantCertification>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Profile)
                      .WithMany(p => p.Certifications)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ApplicantLanguage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Profile)
                      .WithMany(p => p.Languages)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            base.OnModelCreating(modelBuilder);
        }

        private void HandleDefaultFieldChanges()
        {
            if (ChangeTracker.HasChanges())
            {
                var entries = ChangeTracker.Entries<EntityBase>();
                var currentTime = DateTime.UtcNow;

                foreach (var entry in entries)
                {
                    // TODO: Hnadle CreatedBy and UpdatedBy fields when implementing authentication
                    switch (entry.State)
                    {
                        case EntityState.Added:
                            entry.Entity.CreatedAt = currentTime;
                            entry.Entity.UpdatedAt = currentTime;
                            break;
                        case EntityState.Modified:
                            entry.Entity.UpdatedAt = currentTime;
                            break;
                        case EntityState.Deleted:
                            entry.Entity.IsActive = false;
                            entry.Entity.UpdatedAt = currentTime;
                            entry.State = EntityState.Modified;
                            break;
                        case EntityState.Detached:
                            break;
                        case EntityState.Unchanged:
                            break;
                        default:
                            break;
                    }
                }
            }
        }

    }
}
