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

namespace Infrastructure.Services;

public class ClientService : IClientService
{
    private readonly IRepository<Client> _repo;
    private readonly IAmazonS3 _s3Client;
    private readonly R2Settings _r2Settings;

    public ClientService(IRepository<Client> repo, IAmazonS3 s3Client, R2Settings r2Settings)
    {
        _repo = repo;
        _s3Client = s3Client;
        _r2Settings = r2Settings;
    }

    public async Task<ClientDTO> CreateAsync(ClientDTO dto)
    {
        var entity = dto.Adapt<Client>();
        _repo.Insert(entity);
        await _repo.SaveChangesAsync();
        return entity.Adapt<ClientDTO>();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var e = await _repo.GetByIdAsync(id);
        if (e == null) return false;
        _repo.Delete(e);
        await _repo.SaveChangesAsync();
        return true;
    }

    public async Task<PagedResponse<ClientDTO>> GetAllAsync(RequestParams requestParams)
    {
        Expression<Func<Client, bool>> filter = PredicateBuilder.BuildFilterExpression<Client>(requestParams.Filters);
        if (!string.IsNullOrWhiteSpace(requestParams.SearchKeyword))
        {
            requestParams.SearchKeyword = requestParams.SearchKeyword.Trim().ToLikeFilterString(Operator.Contains);
            Expression<Func<Client, bool>> searchExpr = c => EF.Functions.ILike(c.Name!, requestParams.SearchKeyword)
                                                           || EF.Functions.ILike(c.LogoUrl, requestParams.SearchKeyword);

            filter = PredicateBuilder.And(filter, searchExpr);
        }

        var sort = PredicateBuilder.BuildSortExpression<Client>(string.IsNullOrWhiteSpace(requestParams.SortBy) ? nameof(Client.Id) : requestParams.SortBy);

        var result = await _repo.PagedQueryAsync(filter, sort, requestParams.Page, requestParams.PageSize, requestParams.IsDescending);
        var (total, query) = result;
        var list = await query.ToListAsync();
        return PagedResponse<ClientDTO>.Success(list.Adapt<List<ClientDTO>>(), total, requestParams, StatusCodes.Status200OK);
    }

    public async Task<ClientDTO?> GetByIdAsync(int id)
    {
        var e = await _repo.GetByIdAsync(id);
        return e?.Adapt<ClientDTO>();
    }

    public async Task<ClientDTO?> UpdateAsync(int id, ClientDTO dto)
    {
        var e = await _repo.GetByIdAsync(id);
        if (e == null) return null;
        dto.Adapt(e);
        _repo.Update(e);
        await _repo.SaveChangesAsync();
        return e.Adapt<ClientDTO>();
    }

        public async Task<ResumePresignedUrlDto> GetUploadUrl(string filename)
        {
            if (string.IsNullOrEmpty(filename))
                throw new Exception("Filename is required.");

        var bucketBase = _r2Settings.CustomDomain;
        if (!bucketBase.StartsWith("http", StringComparison.OrdinalIgnoreCase))
        {
            bucketBase = $"https://{bucketBase}";
        }

        var key = $"{Guid.NewGuid()}_{filename}";
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _r2Settings.BucketName,
            Key = key,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(_r2Settings.PreSignedUrlExpiryInMinutes),
        };

        var url = await _s3Client.GetPreSignedURLAsync(request);
        var fileAccessUrl = $"{bucketBase.TrimEnd('/')}/{key}";

        return new ResumePresignedUrlDto
        {
            uploadUrl = url,
            fileUrl = fileAccessUrl
        };
    }
}
