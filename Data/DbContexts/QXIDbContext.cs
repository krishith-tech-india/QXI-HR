﻿using Data.Models;
using Data.Models.Identity;
using Microsoft.EntityFrameworkCore;

namespace Data.DbContexts
{
    public class QXIDbContext(DbContextOptions<QXIDbContext> options) : DbContext(options)
    {

        public virtual DbSet<QXIUser> Users { get; set; }

        public virtual DbSet<QXIRole> Roles { get; set; }

        public virtual DbSet<QXIUserRole> UserRoles { get; set; }

        public virtual DbSet<JobPost> JobPosts { get; set; }

        public virtual DbSet<GallaryImage> GallaryImages { get; set; }

        public virtual DbSet<ImageCategory> ImageCategories { get; set; }

        public virtual DbSet<JobApplication> JobApplications { get; set; }

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
            modelBuilder.Entity<QXIUser>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasMany(x => x.UserRoles)
                      .WithOne(ur => ur.User)
                      .HasForeignKey(ur => ur.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<QXIRole>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasMany(x => x.UserRoles)
                      .WithOne(ur => ur.Role)
                      .HasForeignKey(ur => ur.RoleId)
                      .OnDelete(DeleteBehavior.Cascade);
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
                entity.HasMany(e => e.Applications)
                      .WithOne(navigationExpression: e => e.JobPost)
                      .HasForeignKey(e => e.JobPostId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<JobApplication>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.JobPost)
                      .WithMany()
                      .HasForeignKey(e => e.JobPostId)
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
