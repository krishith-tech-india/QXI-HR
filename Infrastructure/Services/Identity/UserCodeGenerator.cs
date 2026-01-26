using Core.Enums;
using Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    internal static class UserCodeGenerator
    {
        private const string AdminPrefix = "QXIADM";
        private const string StaffPrefix = "QXIEMP";
        private const string UserPrefix = "QXIUSR";

        private const string AdminSequence = "UserCodeAdminSequence";
        private const string StaffSequence = "UserCodeStaffSequence";
        private const string UserSequence = "UserCodeUserSequence";

        internal static async Task<string> NextCodeAsync(QXIDbContext dbContext, IEnumerable<string> roleNames, CancellationToken cancellationToken = default)
        {
            var prefix = ResolvePrefix(roleNames);
            var sequence = ResolveSequence(prefix);
            var nextValue = await NextSequenceValueAsync(dbContext, sequence, cancellationToken);
            return $"{prefix}-{nextValue:000}";
        }

        private static string ResolvePrefix(IEnumerable<string> roleNames)
        {
            var roles = new HashSet<string>(roleNames ?? Array.Empty<string>(), StringComparer.OrdinalIgnoreCase);
            if (roles.Contains(Roles.Admin.ToString()))
            {
                return AdminPrefix;
            }

            if (roles.Contains(Roles.Staff.ToString()))
            {
                return StaffPrefix;
            }

            return UserPrefix;
        }

        private static string ResolveSequence(string prefix)
        {
            return prefix switch
            {
                AdminPrefix => AdminSequence,
                StaffPrefix => StaffSequence,
                _ => UserSequence
            };
        }

        private static async Task<long> NextSequenceValueAsync(QXIDbContext dbContext, string sequenceName, CancellationToken cancellationToken)
        {
            var connection = dbContext.Database.GetDbConnection();
            var shouldClose = false;
            if (connection.State != System.Data.ConnectionState.Open)
            {
                await connection.OpenAsync(cancellationToken);
                shouldClose = true;
            }

            await using var command = connection.CreateCommand();
            command.CommandText = $@"SELECT nextval('""{sequenceName}""'::regclass)";
            object? result;
            try
            {
                result = await command.ExecuteScalarAsync(cancellationToken);
            }
            catch (Npgsql.PostgresException ex) when (ex.SqlState == "42P01")
            {
                await using var createCommand = connection.CreateCommand();
                createCommand.CommandText = $@"CREATE SEQUENCE IF NOT EXISTS ""{sequenceName}"" START 1";
                await createCommand.ExecuteNonQueryAsync(cancellationToken);
                result = await command.ExecuteScalarAsync(cancellationToken);
            }
            if (shouldClose)
            {
                await connection.CloseAsync();
            }
            return result is long value ? value : Convert.ToInt64(result);
        }
    }
}
