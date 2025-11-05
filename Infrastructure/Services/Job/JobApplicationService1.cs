using Amazon.S3;
using Amazon.S3.Model;
using Core.DTOs;
using Core.Helpers;
using Data.Models;
using Data.Reopsitories;
using Mapster;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.Services
{
    public class JobApplicationService : IJobApplicationService
    {
        private readonly IRepository<JobApplication> _jobApplicationRepo;
        private readonly IRepository<JobPost> _jobPostRepo;
        private readonly IAmazonS3 _s3Client;
        private readonly R2Settings _r2Settings;
        public JobApplicationService(
                IRepository<JobApplication> repo,
                IAmazonS3 s3Client,
                R2Settings r2Settings,
                IRepository<JobPost> jobPostRepo
            )
        {
            _jobApplicationRepo = repo;
             _s3Client = s3Client;
            _r2Settings = r2Settings;
            _jobPostRepo = jobPostRepo;
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
    }
}