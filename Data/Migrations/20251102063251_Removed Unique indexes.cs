using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class RemovedUniqueindexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UQ_Users_Email",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "UQ_Users_PhoneNumber",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "UQ_Roles_RoleName",
                table: "Roles");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "GallaryImages",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "GallaryImages",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "GallaryImages",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "GallaryImages",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "GallaryImages",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_IsActive",
                table: "Users",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_IsActive",
                table: "UserRoles",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_IsActive",
                table: "Roles",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_JobPosts_IsActive",
                table: "JobPosts",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_JobApplications_IsActive",
                table: "JobApplications",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_ImageCategories_IsActive",
                table: "ImageCategories",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_GallaryImages_IsActive",
                table: "GallaryImages",
                column: "IsActive");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_IsActive",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_UserRoles_IsActive",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_Roles_IsActive",
                table: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_JobPosts_IsActive",
                table: "JobPosts");

            migrationBuilder.DropIndex(
                name: "IX_JobApplications_IsActive",
                table: "JobApplications");

            migrationBuilder.DropIndex(
                name: "IX_ImageCategories_IsActive",
                table: "ImageCategories");

            migrationBuilder.DropIndex(
                name: "IX_GallaryImages_IsActive",
                table: "GallaryImages");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "GallaryImages");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "GallaryImages");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "GallaryImages");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "GallaryImages");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "GallaryImages");

            migrationBuilder.CreateIndex(
                name: "UQ_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_Users_PhoneNumber",
                table: "Users",
                column: "PhoneNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "UQ_Roles_RoleName",
                table: "Roles",
                column: "RoleName",
                unique: true);
        }
    }
}
