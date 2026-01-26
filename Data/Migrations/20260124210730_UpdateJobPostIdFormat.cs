using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateJobPostIdFormat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobApplications_JobPosts_JobPostId",
                table: "JobApplications");

            migrationBuilder.DropForeignKey(
                name: "FK_JobPostSkills_JobPosts_JobPostId",
                table: "JobPostSkills");

            migrationBuilder.DropPrimaryKey(
                name: "PK_JobPosts",
                table: "JobPosts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_JobPostSkills",
                table: "JobPostSkills");

            migrationBuilder.DropIndex(
                name: "IX_JobApplications_JobPostId",
                table: "JobApplications");

            migrationBuilder.AddColumn<string>(
                name: "IdNew",
                table: "JobPosts",
                type: "character varying(20)",
                unicode: false,
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JobPostIdNew",
                table: "JobApplications",
                type: "character varying(20)",
                unicode: false,
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JobPostIdNew",
                table: "JobPostSkills",
                type: "character varying(20)",
                unicode: false,
                maxLength: 20,
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE "JobPosts"
                SET "IdNew" = 'QXIJB-' || lpad("Id"::text, 3, '0');
                """
            );

            migrationBuilder.Sql(
                """
                UPDATE "JobApplications" a
                SET "JobPostIdNew" = jp."IdNew"
                FROM "JobPosts" jp
                WHERE a."JobPostId" = jp."Id";
                """
            );

            migrationBuilder.Sql(
                """
                UPDATE "JobPostSkills" jps
                SET "JobPostIdNew" = jp."IdNew"
                FROM "JobPosts" jp
                WHERE jps."JobPostId" = jp."Id";
                """
            );

            migrationBuilder.DropColumn(
                name: "JobPostId",
                table: "JobApplications");

            migrationBuilder.DropColumn(
                name: "JobPostId",
                table: "JobPostSkills");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "JobPosts");

            migrationBuilder.RenameColumn(
                name: "IdNew",
                table: "JobPosts",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "JobPostIdNew",
                table: "JobApplications",
                newName: "JobPostId");

            migrationBuilder.RenameColumn(
                name: "JobPostIdNew",
                table: "JobPostSkills",
                newName: "JobPostId");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "JobPosts",
                type: "character varying(20)",
                unicode: false,
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldUnicode: false,
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "JobPostId",
                table: "JobPostSkills",
                type: "character varying(20)",
                unicode: false,
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldUnicode: false,
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "JobPostId",
                table: "JobApplications",
                type: "character varying(20)",
                unicode: false,
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldUnicode: false,
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "JobCode",
                table: "JobPosts");

            migrationBuilder.Sql(
                """
                CREATE SEQUENCE IF NOT EXISTS "JobPostIdSequence";
                """
            );

            migrationBuilder.Sql(
                """
                SELECT setval('"JobPostIdSequence"', COALESCE((
                    SELECT MAX(NULLIF(regexp_replace("Id", '[^0-9]', '', 'g'), '')::int)
                    FROM "JobPosts"
                ), 0) + 1, false);
                """
            );

            migrationBuilder.Sql(
                """
                ALTER TABLE "JobPosts"
                ALTER COLUMN "Id"
                SET DEFAULT ('QXIJB-' || lpad(nextval('"JobPostIdSequence"')::text, 3, '0'));
                """
            );

            migrationBuilder.AddPrimaryKey(
                name: "PK_JobPosts",
                table: "JobPosts",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_JobPostSkills",
                table: "JobPostSkills",
                columns: new[] { "JobPostId", "SkillId" });

            migrationBuilder.CreateIndex(
                name: "IX_JobApplications_JobPostId",
                table: "JobApplications",
                column: "JobPostId");

            migrationBuilder.AddForeignKey(
                name: "FK_JobApplications_JobPosts_JobPostId",
                table: "JobApplications",
                column: "JobPostId",
                principalTable: "JobPosts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_JobPostSkills_JobPosts_JobPostId",
                table: "JobPostSkills",
                column: "JobPostId",
                principalTable: "JobPosts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobApplications_JobPosts_JobPostId",
                table: "JobApplications");

            migrationBuilder.DropForeignKey(
                name: "FK_JobPostSkills_JobPosts_JobPostId",
                table: "JobPostSkills");

            migrationBuilder.DropPrimaryKey(
                name: "PK_JobPosts",
                table: "JobPosts");

            migrationBuilder.DropPrimaryKey(
                name: "PK_JobPostSkills",
                table: "JobPostSkills");

            migrationBuilder.DropIndex(
                name: "IX_JobApplications_JobPostId",
                table: "JobApplications");

            migrationBuilder.AddColumn<int>(
                name: "IdOld",
                table: "JobPosts",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "JobPostIdOld",
                table: "JobApplications",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "JobPostIdOld",
                table: "JobPostSkills",
                type: "integer",
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE "JobPosts"
                SET "IdOld" = NULLIF(regexp_replace("Id", '[^0-9]', '', 'g'), '')::int;
                """
            );

            migrationBuilder.Sql(
                """
                UPDATE "JobApplications" a
                SET "JobPostIdOld" = jp."IdOld"
                FROM "JobPosts" jp
                WHERE a."JobPostId" = jp."Id";
                """
            );

            migrationBuilder.Sql(
                """
                UPDATE "JobPostSkills" jps
                SET "JobPostIdOld" = jp."IdOld"
                FROM "JobPosts" jp
                WHERE jps."JobPostId" = jp."Id";
                """
            );

            migrationBuilder.DropColumn(
                name: "JobPostId",
                table: "JobApplications");

            migrationBuilder.DropColumn(
                name: "JobPostId",
                table: "JobPostSkills");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "JobPosts");

            migrationBuilder.RenameColumn(
                name: "IdOld",
                table: "JobPosts",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "JobPostIdOld",
                table: "JobApplications",
                newName: "JobPostId");

            migrationBuilder.RenameColumn(
                name: "JobPostIdOld",
                table: "JobPostSkills",
                newName: "JobPostId");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "JobPosts",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "JobPostId",
                table: "JobPostSkills",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "JobPostId",
                table: "JobApplications",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "JobCode",
                table: "JobPosts",
                type: "character varying(100)",
                unicode: false,
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql(
                """
                DROP SEQUENCE IF EXISTS "JobPostIdSequence";
                """
            );

            migrationBuilder.Sql(
                """
                ALTER TABLE "JobPosts"
                ALTER COLUMN "Id"
                ADD GENERATED BY DEFAULT AS IDENTITY;
                """
            );

            migrationBuilder.AddPrimaryKey(
                name: "PK_JobPosts",
                table: "JobPosts",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_JobPostSkills",
                table: "JobPostSkills",
                columns: new[] { "JobPostId", "SkillId" });

            migrationBuilder.CreateIndex(
                name: "IX_JobApplications_JobPostId",
                table: "JobApplications",
                column: "JobPostId");

            migrationBuilder.AddForeignKey(
                name: "FK_JobApplications_JobPosts_JobPostId",
                table: "JobApplications",
                column: "JobPostId",
                principalTable: "JobPosts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_JobPostSkills_JobPosts_JobPostId",
                table: "JobPostSkills",
                column: "JobPostId",
                principalTable: "JobPosts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
