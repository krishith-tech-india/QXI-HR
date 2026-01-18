using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicantProfiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ApplicantProfiles",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    ProfileHeadline = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: false),
                    ProfileSummary = table.Column<string>(type: "character varying(2000)", unicode: false, maxLength: 2000, nullable: true),
                    PortfolioUrl = table.Column<string>(type: "character varying(500)", unicode: false, maxLength: 500, nullable: true),
                    ResumeUrl = table.Column<string>(type: "character varying(500)", unicode: false, maxLength: 500, nullable: true),
                    ProfileImageUrl = table.Column<string>(type: "character varying(500)", unicode: false, maxLength: 500, nullable: true),
                    MiddleName = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: true),
                    DateOfBirth = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AddressLine1 = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: true),
                    AddressLine2 = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: true),
                    City = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: true),
                    State = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: true),
                    Country = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: true),
                    PostalCode = table.Column<string>(type: "character varying(20)", unicode: false, maxLength: 20, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicantProfiles", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_ApplicantProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicantCertifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: false),
                    Issuer = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: true),
                    IssueDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ExpiryDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CredentialId = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: true),
                    CredentialUrl = table.Column<string>(type: "character varying(500)", unicode: false, maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicantCertifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicantCertifications_ApplicantProfiles_UserId",
                        column: x => x.UserId,
                        principalTable: "ApplicantProfiles",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicantEducations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Institution = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: false),
                    Degree = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: true),
                    FieldOfStudy = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: true),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Grade = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: true),
                    Description = table.Column<string>(type: "character varying(2000)", unicode: false, maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicantEducations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicantEducations_ApplicantProfiles_UserId",
                        column: x => x.UserId,
                        principalTable: "ApplicantProfiles",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicantEmployments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    CompanyName = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsCurrent = table.Column<bool>(type: "boolean", nullable: false),
                    Location = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: true),
                    Description = table.Column<string>(type: "character varying(2000)", unicode: false, maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicantEmployments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicantEmployments_ApplicantProfiles_UserId",
                        column: x => x.UserId,
                        principalTable: "ApplicantProfiles",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicantLanguages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    LanguageName = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: false),
                    Proficiency = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicantLanguages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicantLanguages_ApplicantProfiles_UserId",
                        column: x => x.UserId,
                        principalTable: "ApplicantProfiles",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicantOnlineProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Platform = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: false),
                    Url = table.Column<string>(type: "character varying(500)", unicode: false, maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicantOnlineProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicantOnlineProfiles_ApplicantProfiles_UserId",
                        column: x => x.UserId,
                        principalTable: "ApplicantProfiles",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ApplicantProjects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(2000)", unicode: false, maxLength: 2000, nullable: true),
                    TechStack = table.Column<string>(type: "character varying(500)", unicode: false, maxLength: 500, nullable: true),
                    ProjectUrl = table.Column<string>(type: "character varying(500)", unicode: false, maxLength: 500, nullable: true),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicantProjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ApplicantProjects_ApplicantProfiles_UserId",
                        column: x => x.UserId,
                        principalTable: "ApplicantProfiles",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantCertifications_IsActive",
                table: "ApplicantCertifications",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantCertifications_UserId",
                table: "ApplicantCertifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantEducations_IsActive",
                table: "ApplicantEducations",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantEducations_UserId",
                table: "ApplicantEducations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantEmployments_IsActive",
                table: "ApplicantEmployments",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantEmployments_UserId",
                table: "ApplicantEmployments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantLanguages_IsActive",
                table: "ApplicantLanguages",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantLanguages_UserId",
                table: "ApplicantLanguages",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantOnlineProfiles_IsActive",
                table: "ApplicantOnlineProfiles",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantOnlineProfiles_UserId",
                table: "ApplicantOnlineProfiles",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantProfiles_IsActive",
                table: "ApplicantProfiles",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantProjects_IsActive",
                table: "ApplicantProjects",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantProjects_UserId",
                table: "ApplicantProjects",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicantCertifications");

            migrationBuilder.DropTable(
                name: "ApplicantEducations");

            migrationBuilder.DropTable(
                name: "ApplicantEmployments");

            migrationBuilder.DropTable(
                name: "ApplicantLanguages");

            migrationBuilder.DropTable(
                name: "ApplicantOnlineProfiles");

            migrationBuilder.DropTable(
                name: "ApplicantProjects");

            migrationBuilder.DropTable(
                name: "ApplicantProfiles");
        }
    }
}
