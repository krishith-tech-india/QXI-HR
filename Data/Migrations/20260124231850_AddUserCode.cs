using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserCode",
                table: "Users",
                type: "character varying(100)",
                unicode: false,
                maxLength: 100,
                nullable: true);

            migrationBuilder.Sql(
                """
                CREATE SEQUENCE IF NOT EXISTS "UserCodeAdminSequence";
                CREATE SEQUENCE IF NOT EXISTS "UserCodeStaffSequence";
                CREATE SEQUENCE IF NOT EXISTS "UserCodeUserSequence";
                """
            );

            migrationBuilder.Sql(
                """
                WITH role_priority AS (
                    SELECT u."Id",
                           CASE
                               WHEN EXISTS (
                                   SELECT 1
                                   FROM "UserRoles" ur
                                   JOIN "Roles" r ON r."Id" = ur."RoleId"
                                   WHERE ur."UserId" = u."Id"
                                     AND ur."IsActive" = TRUE
                                     AND r."RoleName" = 'Admin'
                               ) THEN 'QXIADM'
                               WHEN EXISTS (
                                   SELECT 1
                                   FROM "UserRoles" ur
                                   JOIN "Roles" r ON r."Id" = ur."RoleId"
                                   WHERE ur."UserId" = u."Id"
                                     AND ur."IsActive" = TRUE
                                     AND r."RoleName" = 'Staff'
                               ) THEN 'QXIEMP'
                               ELSE 'QXIUSR'
                           END AS prefix
                    FROM "Users" u
                ), numbered AS (
                    SELECT "Id",
                           prefix,
                           row_number() OVER (PARTITION BY prefix ORDER BY "Id") AS rn
                    FROM role_priority
                )
                UPDATE "Users" u
                SET "UserCode" = n.prefix || '-' || lpad(n.rn::text, 3, '0')
                FROM numbered n
                WHERE u."Id" = n."Id";
                """
            );

            migrationBuilder.Sql(
                """
                SELECT setval('"UserCodeAdminSequence"', COALESCE((
                    SELECT MAX(NULLIF(regexp_replace("UserCode", '[^0-9]', '', 'g'), '')::int)
                    FROM "Users"
                    WHERE "UserCode" LIKE 'QXIADM-%'
                ), 0) + 1, false);
                """
            );

            migrationBuilder.Sql(
                """
                SELECT setval('"UserCodeStaffSequence"', COALESCE((
                    SELECT MAX(NULLIF(regexp_replace("UserCode", '[^0-9]', '', 'g'), '')::int)
                    FROM "Users"
                    WHERE "UserCode" LIKE 'QXIEMP-%'
                ), 0) + 1, false);
                """
            );

            migrationBuilder.Sql(
                """
                SELECT setval('"UserCodeUserSequence"', COALESCE((
                    SELECT MAX(NULLIF(regexp_replace("UserCode", '[^0-9]', '', 'g'), '')::int)
                    FROM "Users"
                    WHERE "UserCode" LIKE 'QXIUSR-%'
                ), 0) + 1, false);
                """
            );

            migrationBuilder.AlterColumn<string>(
                name: "UserCode",
                table: "Users",
                type: "character varying(100)",
                unicode: false,
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldUnicode: false,
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "UQ_Users_UserCode",
                table: "Users",
                column: "UserCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UQ_Users_UserCode",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserCode",
                table: "Users");

            migrationBuilder.Sql(
                """
                DROP SEQUENCE IF EXISTS "UserCodeAdminSequence";
                DROP SEQUENCE IF EXISTS "UserCodeStaffSequence";
                DROP SEQUENCE IF EXISTS "UserCodeUserSequence";
                """
            );
        }
    }
}
