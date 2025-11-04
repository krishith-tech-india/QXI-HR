using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ImageCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "JobPosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "text", unicode: false, nullable: false),
                    CompanyName = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: false),
                    Location = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: false),
                    Skils = table.Column<string>(type: "text", unicode: false, nullable: false),
                    Salary = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: false),
                    Experience = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobPosts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleName = table.Column<string>(type: "character varying(50)", unicode: false, maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FirstName = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: true),
                    Email = table.Column<string>(type: "character varying(500)", unicode: false, maxLength: 500, nullable: false),
                    ProfilePictureUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Bio = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    LinkedInProfileUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Position = table.Column<string>(type: "character varying(50)", unicode: false, maxLength: 50, nullable: true),
                    PhoneNumber = table.Column<string>(type: "character varying(15)", unicode: false, maxLength: 15, nullable: false),
                    Password = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "GallaryImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: true),
                    Description = table.Column<string>(type: "text", unicode: false, nullable: true),
                    ImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: true),
                    ImageCategoryId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GallaryImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GallaryImages_ImageCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "ImageCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GallaryImages_ImageCategories_ImageCategoryId",
                        column: x => x.ImageCategoryId,
                        principalTable: "ImageCategories",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "JobApplications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ApplicantName = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: true),
                    ApplicantEmail = table.Column<string>(type: "character varying(500)", unicode: false, maxLength: 500, nullable: true),
                    ApplicantPhoneNumber = table.Column<string>(type: "character varying(15)", unicode: false, maxLength: 15, nullable: true),
                    ResumeUrl = table.Column<string>(type: "character varying(500)", unicode: false, maxLength: 500, nullable: true),
                    CoverLetterUrl = table.Column<string>(type: "character varying(500)", unicode: false, maxLength: 500, nullable: true),
                    JobPostId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobApplications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_JobApplications_JobPosts_JobPostId",
                        column: x => x.JobPostId,
                        principalTable: "JobPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GallaryImages_CategoryId",
                table: "GallaryImages",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_GallaryImages_ImageCategoryId",
                table: "GallaryImages",
                column: "ImageCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_GallaryImages_IsActive",
                table: "GallaryImages",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ImageCategories_IsActive",
                table: "ImageCategories",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_JobApplications_IsActive",
                table: "JobApplications",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_JobApplications_JobPostId",
                table: "JobApplications",
                column: "JobPostId");

            migrationBuilder.CreateIndex(
                name: "IX_JobPosts_IsActive",
                table: "JobPosts",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_IsActive",
                table: "Roles",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "UQ_Roles_RoleName",
                table: "Roles",
                column: "RoleName",
                unique: true,
                filter: "\"IsActive\" = true");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_IsActive",
                table: "UserRoles",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_IsActive",
                table: "Users",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "UQ_Users_Email",
                table: "Users",
                column: "Email",
                unique: true,
                filter: "\"IsActive\" = true");

            migrationBuilder.CreateIndex(
                name: "UQ_Users_PhoneNumber",
                table: "Users",
                column: "PhoneNumber",
                unique: true,
                filter: "\"IsActive\" = true");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GallaryImages");

            migrationBuilder.DropTable(
                name: "JobApplications");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "ImageCategories");

            migrationBuilder.DropTable(
                name: "JobPosts");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
