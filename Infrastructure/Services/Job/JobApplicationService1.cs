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
                IRepository<EmailVerificationCode> emailVerificationRepo,
                Core.DTOs.EmailSettings emailSettings,
                Microsoft.Extensions.Logging.ILogger<JobApplicationService> logger
            )
        {
            _jobApplicationRepo = repo;
             _s3Client = s3Client;
            _r2Settings = r2Settings;
            _jobPostRepo = jobPostRepo;
            _emailVerificationRepo = emailVerificationRepo;
            _emailSettings = emailSettings;
            _logger = logger;
        } 

        public async Task<JobApplicationDTO> CreateAsync(JobApplicationDTO dto)
        {        
            var entity = dto.Adapt<JobApplication>();
            entity.JobPost = null;
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
                requestParams.SearchKeyword = requestParams.SearchKeyword.Trim().ToLikeFilterString(Operator.Contains);
                Expression<Func<JobApplication, bool>> searchExpr = ja => EF.Functions.ILike(ja.ApplicantName, requestParams.SearchKeyword) 
                || EF.Functions.ILike(ja.ApplicantEmail, requestParams.SearchKeyword);

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
            var list = await _jobApplicationRepo.Query(a => a.JobPostId == jobPostId, true).ToListAsync();
            return list.Adapt<IEnumerable<JobApplicationDTO>>();
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

                    var mail = new System.Net.Mail.MailMessage()
                    {
                        From = new System.Net.Mail.MailAddress(fromAddress, fromName),
                        Subject = "Your verification code",
                        Body = $"Your verification code is: {code}",
                        IsBodyHtml = false
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