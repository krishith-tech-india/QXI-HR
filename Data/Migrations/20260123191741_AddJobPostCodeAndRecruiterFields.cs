using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJobPostCodeAndRecruiterFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CompanyName",
                table: "JobPosts",
                type: "character varying(200)",
                unicode: false,
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldUnicode: false,
                oldMaxLength: 200);

            migrationBuilder.AddColumn<string>(
                name: "JobCode",
                table: "JobPosts",
                type: "character varying(100)",
                unicode: false,
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RecruiterWhatsAppNumber",
                table: "JobPosts",
                type: "character varying(50)",
                unicode: false,
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JobCode",
                table: "JobPosts");

            migrationBuilder.DropColumn(
                name: "RecruiterWhatsAppNumber",
                table: "JobPosts");

            migrationBuilder.AlterColumn<string>(
                name: "CompanyName",
                table: "JobPosts",
                type: "character varying(200)",
                unicode: false,
                maxLength: 200,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldUnicode: false,
                oldMaxLength: 200,
                oldNullable: true);
        }
    }
}
