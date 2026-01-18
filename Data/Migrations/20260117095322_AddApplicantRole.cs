using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddApplicantRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                INSERT INTO "Roles" ("RoleName","Description","IsActive","CreatedAt","UpdatedAt")
                SELECT 'Applicant','Applicant',true, NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM "Roles" WHERE "RoleName" = 'Applicant');
            """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DELETE FROM "Roles"
                WHERE "RoleName" = 'Applicant';
            """);
        }
    }
}
