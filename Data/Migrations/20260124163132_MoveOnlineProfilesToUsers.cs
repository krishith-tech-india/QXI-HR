using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class MoveOnlineProfilesToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicantOnlineProfiles_ApplicantProfiles_UserId",
                table: "ApplicantOnlineProfiles");

            migrationBuilder.Sql(
                """
                INSERT INTO "ApplicantOnlineProfiles" ("UserId", "Platform", "Url", "CreatedAt", "UpdatedAt", "IsActive")
                SELECT u."Id", 'LinkedIn', u."LinkedInProfileUrl", NOW(), NOW(), TRUE
                FROM "Users" u
                WHERE u."LinkedInProfileUrl" IS NOT NULL
                  AND u."LinkedInProfileUrl" <> ''
                  AND NOT EXISTS (
                      SELECT 1
                      FROM "ApplicantOnlineProfiles" p
                      WHERE p."UserId" = u."Id"
                        AND LOWER(p."Platform") = 'linkedin'
                  );
                """
            );

            migrationBuilder.DropColumn(
                name: "LinkedInProfileUrl",
                table: "Users");

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicantOnlineProfiles_Users_UserId",
                table: "ApplicantOnlineProfiles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApplicantOnlineProfiles_Users_UserId",
                table: "ApplicantOnlineProfiles");

            migrationBuilder.AddColumn<string>(
                name: "LinkedInProfileUrl",
                table: "Users",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ApplicantOnlineProfiles_ApplicantProfiles_UserId",
                table: "ApplicantOnlineProfiles",
                column: "UserId",
                principalTable: "ApplicantProfiles",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
