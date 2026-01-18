using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSkills : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Skills",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", unicode: false, maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Skills", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ApplicantSkills",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    SkillId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicantSkills", x => new { x.UserId, x.SkillId });
                    table.ForeignKey(
                        name: "FK_ApplicantSkills_Skills_SkillId",
                        column: x => x.SkillId,
                        principalTable: "Skills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicantSkills_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "JobPostSkills",
                columns: table => new
                {
                    JobPostId = table.Column<int>(type: "integer", nullable: false),
                    SkillId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobPostSkills", x => new { x.JobPostId, x.SkillId });
                    table.ForeignKey(
                        name: "FK_JobPostSkills_JobPosts_JobPostId",
                        column: x => x.JobPostId,
                        principalTable: "JobPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobPostSkills_Skills_SkillId",
                        column: x => x.SkillId,
                        principalTable: "Skills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantSkills_IsActive",
                table: "ApplicantSkills",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantSkills_SkillId",
                table: "ApplicantSkills",
                column: "SkillId");

            migrationBuilder.CreateIndex(
                name: "IX_JobPostSkills_IsActive",
                table: "JobPostSkills",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_JobPostSkills_SkillId",
                table: "JobPostSkills",
                column: "SkillId");

            migrationBuilder.CreateIndex(
                name: "IX_Skills_IsActive",
                table: "Skills",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "UQ_Skills_Name",
                table: "Skills",
                column: "Name",
                unique: true,
                filter: "\"IsActive\" = true");

            migrationBuilder.Sql("""
                INSERT INTO "Skills" ("Name","Description","IsActive","CreatedAt","UpdatedAt")
                SELECT 'Communication', NULL, true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "Skills" WHERE "Name" = 'Communication' AND "IsActive" = true);
                INSERT INTO "Skills" ("Name","Description","IsActive","CreatedAt","UpdatedAt")
                SELECT 'Recruitment', NULL, true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "Skills" WHERE "Name" = 'Recruitment' AND "IsActive" = true);
                INSERT INTO "Skills" ("Name","Description","IsActive","CreatedAt","UpdatedAt")
                SELECT 'Talent Acquisition', NULL, true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "Skills" WHERE "Name" = 'Talent Acquisition' AND "IsActive" = true);
                INSERT INTO "Skills" ("Name","Description","IsActive","CreatedAt","UpdatedAt")
                SELECT 'Interviewing', NULL, true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "Skills" WHERE "Name" = 'Interviewing' AND "IsActive" = true);
                INSERT INTO "Skills" ("Name","Description","IsActive","CreatedAt","UpdatedAt")
                SELECT 'HR Policies', NULL, true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "Skills" WHERE "Name" = 'HR Policies' AND "IsActive" = true);
                INSERT INTO "Skills" ("Name","Description","IsActive","CreatedAt","UpdatedAt")
                SELECT 'Payroll', NULL, true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "Skills" WHERE "Name" = 'Payroll' AND "IsActive" = true);
                INSERT INTO "Skills" ("Name","Description","IsActive","CreatedAt","UpdatedAt")
                SELECT 'Employee Relations', NULL, true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "Skills" WHERE "Name" = 'Employee Relations' AND "IsActive" = true);
                INSERT INTO "Skills" ("Name","Description","IsActive","CreatedAt","UpdatedAt")
                SELECT 'Java', NULL, true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "Skills" WHERE "Name" = 'Java' AND "IsActive" = true);
                INSERT INTO "Skills" ("Name","Description","IsActive","CreatedAt","UpdatedAt")
                SELECT 'JavaScript', NULL, true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "Skills" WHERE "Name" = 'JavaScript' AND "IsActive" = true);
                INSERT INTO "Skills" ("Name","Description","IsActive","CreatedAt","UpdatedAt")
                SELECT 'React', NULL, true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "Skills" WHERE "Name" = 'React' AND "IsActive" = true);
                INSERT INTO "Skills" ("Name","Description","IsActive","CreatedAt","UpdatedAt")
                SELECT 'SQL', NULL, true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "Skills" WHERE "Name" = 'SQL' AND "IsActive" = true);
                INSERT INTO "Skills" ("Name","Description","IsActive","CreatedAt","UpdatedAt")
                SELECT 'Excel', NULL, true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "Skills" WHERE "Name" = 'Excel' AND "IsActive" = true);
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicantSkills");

            migrationBuilder.DropTable(
                name: "JobPostSkills");

            migrationBuilder.DropTable(
                name: "Skills");
        }
    }
}
