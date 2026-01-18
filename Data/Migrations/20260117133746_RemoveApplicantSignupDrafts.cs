using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveApplicantSignupDrafts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicantSignupDrafts");

            migrationBuilder.AddColumn<int>(
                name: "SignupStep",
                table: "ApplicantProfiles",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SignupStep",
                table: "ApplicantProfiles");

            migrationBuilder.CreateTable(
                name: "ApplicantSignupDrafts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CurrentStep = table.Column<int>(type: "integer", nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", unicode: false, maxLength: 200, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsEmailVerified = table.Column<bool>(type: "boolean", nullable: false),
                    PhoneNumber = table.Column<string>(type: "character varying(15)", unicode: false, maxLength: 15, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    UserId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicantSignupDrafts", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicantSignupDrafts_IsActive",
                table: "ApplicantSignupDrafts",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "UQ_ApplicantSignupDrafts_Email",
                table: "ApplicantSignupDrafts",
                column: "Email",
                unique: true,
                filter: "\"IsActive\" = true");
        }
    }
}
