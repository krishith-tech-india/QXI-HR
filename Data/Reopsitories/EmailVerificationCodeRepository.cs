using Data.DbContexts;
using Data.Models;

namespace Data.Reopsitories
{
    public class EmailVerificationCodeRepository : Repository<EmailVerificationCode>
    {
        public EmailVerificationCodeRepository(QXIDbContext dbContext) : base(dbContext)
        {
        }
    }
}
