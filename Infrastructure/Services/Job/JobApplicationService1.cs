using Amazon.S3;
using Amazon.S3.Model;
using Core.DTOs;
using Core.Helpers;
using Data.Models;
using Data.Reopsitories;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Linq.Expressions;

namespace Infrastructure.Services
{
    public class JobApplicationService : IJobApplicationService
    {
        private readonly IRepository<JobApplication> _jobApplicationRepo;
        private readonly IRepository<JobPost> _jobPostRepo;
        private readonly IRepository<ApplicantProfile> _applicantProfileRepo;
        private readonly IAmazonS3 _s3Client;
        private readonly R2Settings _r2Settings;
    private readonly IRepository<EmailVerificationCode> _emailVerificationRepo;
    private readonly Core.DTOs.EmailSettings _emailSettings;
    private readonly Microsoft.Extensions.Logging.ILogger<JobApplicationService> _logger;
        public JobApplicationService(
                IRepository<JobApplication> repo,
                IAmazonS3 s3Client,
                R2Settings r2Settings,
                IRepository<JobPost> jobPostRepo,
                IRepository<ApplicantProfile> applicantProfileRepo,
                IRepository<EmailVerificationCode> emailVerificationRepo,
                Core.DTOs.EmailSettings emailSettings,
                Microsoft.Extensions.Logging.ILogger<JobApplicationService> logger
            )
        {
            _jobApplicationRepo = repo;
             _s3Client = s3Client;
            _r2Settings = r2Settings;
            _jobPostRepo = jobPostRepo;
            _applicantProfileRepo = applicantProfileRepo;
            _emailVerificationRepo = emailVerificationRepo;
            _emailSettings = emailSettings;
            _logger = logger;
        } 

        public async Task<JobApplicationDTO> CreateAsync(JobApplicationDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.ResumeUrl) && dto.ApplicantUserId.HasValue)
            {
                dto.ResumeUrl = await _applicantProfileRepo
                    .Query(p => p.UserId == dto.ApplicantUserId.Value, true)
                    .Select(p => p.ResumeUrl)
                    .FirstOrDefaultAsync();
            }

            var entity = dto.Adapt<JobApplication>();
            entity.JobPost = null!;
            _jobApplicationRepo.Insert(entity);
            await _jobApplicationRepo.SaveChangesAsync();
            return entity.Adapt<JobApplicationDTO>();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _jobApplicationRepo.GetByIdAsync(id);
            if (e == null) return false;
            _jobApplicationRepo.Delete(e);
            await _jobApplicationRepo.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResponse<JobApplicationDTO>> GetAllAsync(RequestParams requestParams)
        {
            Expression<Func<JobApplication, object>> sort = x => x.Id; // Default sort
            Expression<Func<JobApplication, bool>> filter = PredicateBuilder.BuildFilterExpression<JobApplication>(requestParams.Filters);
            if(!string.IsNullOrWhiteSpace(requestParams.SearchKeyword))
            {
                var searchKeyword = requestParams.SearchKeyword.Trim().ToLikeFilterString(Operator.Contains);
                requestParams.SearchKeyword = searchKeyword;
                Expression<Func<JobApplication, bool>> searchExpr = ja => EF.Functions.ILike(ja.ApplicantName ?? string.Empty, searchKeyword) 
                || EF.Functions.ILike(ja.ApplicantEmail ?? string.Empty, searchKeyword);

                filter = filter == null ? searchExpr : PredicateBuilder.And(filter, searchExpr);
            }


            if (!string.IsNullOrWhiteSpace(requestParams.SortBy))
            {
                sort = PredicateBuilder.BuildSortExpression<JobApplication>(requestParams.SortBy);
            }

            (var total, var query) = await _jobApplicationRepo.PagedQueryAsync(filter, sort, requestParams.Page, requestParams.PageSize, requestParams.IsDescending);
                
            var list = await query.ToListAsync();

            return PagedResponse<JobApplicationDTO>.Success(list.Adapt<List<JobApplicationDTO>>(), total, requestParams, StatusCodes.Status200OK);
        }

        public async Task<JobApplicationDTO?> GetByIdAsync(int id)
        {
            var e = await _jobApplicationRepo.Query(a => a.Id == id, false).Include(a => a.JobPost).FirstOrDefaultAsync();
            return e?.Adapt<JobApplicationDTO>();
        }

        public async Task<JobApplicationDTO?> UpdateAsync(int id, JobApplicationDTO dto)
        {
            var e = await _jobApplicationRepo.GetByIdAsync(id);
            if (e == null) return null;
            dto.Adapt(e);
            _jobApplicationRepo.Update(e);
            await _jobApplicationRepo.SaveChangesAsync();
            return e.Adapt<JobApplicationDTO>();
        }

        public async Task<IEnumerable<JobApplicationDTO>> GetByJobPostIdAsync(int jobPostId)
        {
            return await GetByJobPostIdAsync(jobPostId, false);
        }

        public async Task<IEnumerable<JobApplicationDTO>> GetByJobPostIdAsync(int jobPostId, bool includeInactive)
        {
            IQueryable<JobApplication> query = _jobApplicationRepo.GetAll(true);
            if (includeInactive)
            {
                query = query.IgnoreQueryFilters();
            }

            var list = await query
                .Where(a => a.JobPostId == jobPostId)
                .Include(a => a.JobPost)
                .ToListAsync();

            return list.Select(a => new JobApplicationDTO
            {
                Id = a.Id,
                ApplicantName = a.ApplicantName,
                ApplicantEmail = a.ApplicantEmail,
                ApplicantPhoneNumber = a.ApplicantPhoneNumber,
                ResumeUrl = a.ResumeUrl,
                CoverLetterUrl = a.CoverLetterUrl,
                JobPostId = a.JobPostId,
                ApplicantUserId = a.ApplicantUserId,
                JobPostTitle = a.JobPost?.Title,
                JobPostCompanyName = a.JobPost?.CompanyName,
                JobPostLocation = a.JobPost?.Location
            });
        }

        public async Task<IEnumerable<JobApplicationDTO>> GetByApplicantUserIdAsync(int userId)
        {
            var list = await _jobApplicationRepo
                .Query(a => a.ApplicantUserId == userId, true)
                .Include(a => a.JobPost)
                .OrderByDescending(a => a.Id)
                .ToListAsync();

            return list.Select(a => new JobApplicationDTO
            {
                Id = a.Id,
                ApplicantName = a.ApplicantName,
                ApplicantEmail = a.ApplicantEmail,
                ApplicantPhoneNumber = a.ApplicantPhoneNumber,
                ResumeUrl = a.ResumeUrl,
                CoverLetterUrl = a.CoverLetterUrl,
                JobPostId = a.JobPostId,
                ApplicantUserId = a.ApplicantUserId,
                JobPostTitle = a.JobPost?.Title,
                JobPostCompanyName = a.JobPost?.CompanyName,
                JobPostLocation = a.JobPost?.Location
            });
        }

        public async Task<ResumePresignedUrlDto> GetUploadUrl(string filename)
        {
            if (string.IsNullOrEmpty(filename))
                throw new Exception("Filename is required.");

            var key = $"{Guid.NewGuid()}_{filename}";
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _r2Settings.BucketName,
                Key = key,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(_r2Settings.PreSignedUrlExpiryInMinutes),
            };

            var url = await _s3Client.GetPreSignedURLAsync(request);
            var fileAccessUrl = $"{_r2Settings.CustomDomain}/{key}";

            return new ResumePresignedUrlDto
            {
                uploadUrl = url,
                fileUrl = fileAccessUrl
            };
        }

        public async Task<bool> CheckApplicationExist(JobApplicationDTO dto)
        {
            if (dto.ApplicantUserId.HasValue)
            {
                return await _jobApplicationRepo
                    .Query(x => x.JobPostId == dto.JobPostId && x.ApplicantUserId == dto.ApplicantUserId)
                    .AnyAsync();
            }

            return await _jobApplicationRepo
                        .Query(x => x.JobPostId == dto.JobPostId && (x.ApplicantEmail == dto.ApplicantEmail || x.ApplicantPhoneNumber == dto.ApplicantPhoneNumber))
                        .AnyAsync();
        }

        public async Task<bool> SendVerificationCodeAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return false;

            // generate a 6-digit code
            var rng = new Random();
            var code = rng.Next(100000, 999999).ToString();

            var trimmedEmail = email.Trim();

            // If a record already exists for this email, update the verification code. Otherwise insert new.
            var existing = await _emailVerificationRepo.Query(x => x.Email == trimmedEmail, false).FirstOrDefaultAsync();
            if (existing != null)
            {
                existing.VerificationCode = code;
                _emailVerificationRepo.Update(existing);
                await _emailVerificationRepo.SaveChangesAsync();
            }
            else
            {
                var entity = new EmailVerificationCode
                {
                    Email = trimmedEmail,
                    VerificationCode = code
                };

                _emailVerificationRepo.Insert(entity);
                await _emailVerificationRepo.SaveChangesAsync();
                existing = entity;
            }

            // attempt to send email if settings are available
            try
            {
                if (!string.IsNullOrWhiteSpace(_emailSettings?.SmtpHost))
                {
                    using var smtp = new System.Net.Mail.SmtpClient(_emailSettings.SmtpHost, _emailSettings.SmtpPort);
                    smtp.EnableSsl = _emailSettings.EnableSsl;
                    if (!string.IsNullOrWhiteSpace(_emailSettings.SmtpUser))
                    {
                        smtp.Credentials = new System.Net.NetworkCredential(_emailSettings.SmtpUser, _emailSettings.SmtpPass);
                    }

                    var fromAddress = !string.IsNullOrWhiteSpace(_emailSettings?.FromEmail) ? _emailSettings.FromEmail : _emailSettings?.SmtpUser;
                    var fromName = _emailSettings?.FromName ?? string.Empty;

                    if (string.IsNullOrWhiteSpace(fromAddress))
                    {
                        // fallback to a safe noreply address to avoid MailMessage throwing
                        fromAddress = "noreply@localhost";
                    }

                    var subject = "Your QXI HR verification code";
                    var htmlBody = $@"
<!doctype html>
<html lang=""en"">
  <head>
    <meta charset=""utf-8"" />
    <meta name=""viewport"" content=""width=device-width, initial-scale=1"" />
    <title>{subject}</title>
  </head>
  <body style=""margin:0;padding:0;background-color:#f4f6fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;"">
    <table role=""presentation"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""background-color:#f4f6fb;padding:24px 0;"">
      <tr>
        <td align=""center"">
          <table role=""presentation"" cellpadding=""0"" cellspacing=""0"" width=""600"" style=""max-width:600px;background:#ffffff;border-radius:16px;box-shadow:0 10px 30px rgba(15,23,42,0.08);overflow:hidden;"">
            <tr>
              <td style=""padding:24px 28px 0 28px;"">
                <img src=""https://qxi-applicant-docs.qxihr.com/9e28b840-49ef-4f18-b91c-bbe506bba1f5_qxi.png"" alt=""QXI HR"" width=""120"" style=""display:block;border:0;outline:none;"" />
              </td>
            </tr>
            <tr>
              <td style=""padding:16px 28px 0 28px;"">
                <h1 style=""margin:0;font-size:22px;font-weight:700;color:#0f172a;"">Verify your email</h1>
                <p style=""margin:12px 0 0 0;font-size:14px;line-height:22px;color:#475569;"">
                  Use the verification code below to continue your QXI HR signup. This code is valid for a limited time.
                </p>
              </td>
            </tr>
            <tr>
              <td style=""padding:20px 28px;"">
                <div style=""background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;text-align:center;"">
                  <span style=""display:block;font-size:28px;letter-spacing:6px;font-weight:700;color:#0f172a;"">{code}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style=""padding:0 28px 24px 28px;"">
                <p style=""margin:0;font-size:12px;line-height:18px;color:#64748b;"">
                  If you didn’t request this email, you can safely ignore it.
                </p>
              </td>
            </tr>
          </table>
          <p style=""margin:16px 0 0 0;font-size:11px;color:#94a3b8;"">
            © {DateTime.UtcNow.Year} QXI HR (OPC) PRIVATE LIMITED
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>";

                    var mail = new System.Net.Mail.MailMessage()
                    {
                        From = new System.Net.Mail.MailAddress(fromAddress, fromName),
                        Subject = subject,
                        Body = htmlBody,
                        IsBodyHtml = true
                    };
                    mail.To.Add(email);

                    await smtp.SendMailAsync(mail);
                    _logger?.LogInformation("Verification email sent to {Email}", email);
                }

                return true;
            }
            catch (Exception ex)
            {
                // log the exception so we can see why sending failed
                _logger?.LogError(ex, "Failed to send verification email to {Email}", email);
                // email send failed, but verification saved to DB - return false to indicate send failed
                return false;
            }
        }

        public async Task<bool> VerifyEmailCodeAsync(string email, string verificationCode)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(verificationCode))
                return false;

            var trimmedEmail = email.Trim();

            // Find active verification record for this email
            var verification = await _emailVerificationRepo
                .Query(x => x.Email == trimmedEmail && x.IsActive, false)
                .FirstOrDefaultAsync();

            if (verification == null)
                return false;

            // Compare the codes (case-sensitive)
            return verification.VerificationCode == verificationCode;
        }
        
        public async Task<bool> SendEMailContactMessage(MailContactMessageDto messageDto)
        {

            // attempt to send email if settings are available
            try
            {
                if (!string.IsNullOrWhiteSpace(_emailSettings?.SmtpHost))
                {
                    using var smtp = new System.Net.Mail.SmtpClient(_emailSettings.SmtpHost, _emailSettings.SmtpPort);
                    smtp.EnableSsl = _emailSettings.EnableSsl;
                    if (!string.IsNullOrWhiteSpace(_emailSettings.SmtpUser))
                    {
                        smtp.Credentials = new System.Net.NetworkCredential(_emailSettings.SmtpUser, _emailSettings.SmtpPass);
                    }

                    var fromAddress = !string.IsNullOrWhiteSpace(_emailSettings?.FromEmail) ? _emailSettings.FromEmail : _emailSettings?.SmtpUser;
                    var fromName = _emailSettings?.FromName ?? string.Empty;

                    if (string.IsNullOrWhiteSpace(fromAddress))
                    {
                        // fallback to a safe noreply address to avoid MailMessage throwing
                        fromAddress = "noreply@localhost";
                    }

                    var mail = new System.Net.Mail.MailMessage()
                    {
                        From = new System.Net.Mail.MailAddress(fromAddress, fromName),
                        Subject = $"UPDATE : Get {messageDto.Subject} message from website",
                        Body = $"Name: {messageDto.Name}\n" +
                               $"Customer Email: {messageDto.Email}\n" +
                               $"PhoneNo: {messageDto.PhoneNo}\n" +
                               $"Company: {messageDto.Comapny}\n\n" +
                               $"Message:\n{messageDto.Message}",
                        IsBodyHtml = false
                    };
                    mail.To.Add(fromAddress);

                    await smtp.SendMailAsync(mail);
                    _logger?.LogInformation("Verification email sent to {Email}", fromAddress);
                }

                return true;
            }
            catch (Exception ex)
            {
                // log the exception so we can see why sending failed
                _logger?.LogError(ex, "Failed to send contact email by {Email}", messageDto.Email);
                // email send failed, but verification saved to DB - return false to indicate send failed
                return false;
            }
        }
    }
}
