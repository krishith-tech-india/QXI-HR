using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    public partial class RemoveApplicantCertificationCredentialFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CredentialId",
                table: "ApplicantCertifications");

            migrationBuilder.DropColumn(
                name: "CredentialUrl",
                table: "ApplicantCertifications");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CredentialId",
                table: "ApplicantCertifications",
                type: "character varying(200)",
                unicode: false,
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CredentialUrl",
                table: "ApplicantCertifications",
                type: "character varying(500)",
                unicode: false,
                maxLength: 500,
                nullable: true);
        }
    }
}
