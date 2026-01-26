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
    public class JobPostService : IJobPostService
    {
        private readonly IRepository<JobPost> _repo;
        private readonly IRepository<Skill> _skillRepo;

        public JobPostService(
            IRepository<JobPost> repo,
            IRepository<Skill> skillRepo)
        {
            _repo = repo;
            _skillRepo = skillRepo;
        }

        public async Task<JobPostDTO> CreateAsync(JobPostDTO dto)
        {
            var entity = dto.Adapt<JobPost>();
            entity.JobCode = null!;
            entity.IsActive = true;
            var skillIds = NormalizeSkillIds(dto.SkillIds);
            if (skillIds.Count > 0)
            {
                var existingSkillIds = await GetExistingSkillIdsAsync(skillIds);
                entity.JobPostSkills = existingSkillIds.Select(id => new JobPostSkill { SkillId = id }).ToList();
                entity.Skils = await GetSkillNameListAsync(existingSkillIds);
            }
            _repo.Insert(entity);
            await _repo.SaveChangesAsync();
            return entity.Adapt<JobPostDTO>();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return false;
            _repo.Delete(e);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<PagedResponse<JobPostDTO>> GetAllAsync(RequestParams requestParams)
        {
            Expression<Func<JobPost, object>> sort = x => x.Id; // Default sort
            var (includeInactive, filtersWithoutInactive) = ExtractIncludeInactiveFilter(requestParams.Filters);
            var (skillIds, remainingFilters) = ExtractSkillFilters(filtersWithoutInactive);
            Expression<Func<JobPost, bool>> filter = PredicateBuilder.BuildFilterExpression<JobPost>(remainingFilters);
            if (skillIds.Count > 0)
            {
                Expression<Func<JobPost, bool>> skillExpr = jp => jp.JobPostSkills.Any(jps => skillIds.Contains(jps.SkillId));
                filter = filter == null ? skillExpr : PredicateBuilder.And(filter, skillExpr);
            }
            if (!string.IsNullOrWhiteSpace(requestParams.SearchKeyword))
            {
                requestParams.SearchKeyword = requestParams.SearchKeyword.Trim().ToLikeFilterString(Operator.Contains);
                Expression<Func<JobPost, bool>> searchExpr = ja => EF.Functions.ILike(ja.CompanyName, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.Skils, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.Description, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.Title, requestParams.SearchKeyword)
                                                                   || EF.Functions.ILike(ja.Location, requestParams.SearchKeyword);

                filter = filter == null ? searchExpr : PredicateBuilder.And(filter, searchExpr);
            }


            if (!string.IsNullOrWhiteSpace(requestParams.SortBy))
            {
                sort = PredicateBuilder.BuildSortExpression<JobPost>(requestParams.SortBy);
                if (requestParams.SortBy.Equals(nameof(EntityBase.IsActive), StringComparison.OrdinalIgnoreCase))
                {
                    requestParams.IsDescending = true;
                }
            }

            IQueryable<JobPost> query = _repo.GetAll(true);
            if (includeInactive)
            {
                query = query.IgnoreQueryFilters();
            }

            if (filter != null)
            {
                query = query.Where(filter);
            }

            query = requestParams.IsDescending
                ? query.OrderByDescending(sort)
                : query.OrderBy(sort);

            var total = await query.CountAsync();
            query = query.Skip((requestParams.Page - 1) * requestParams.PageSize).Take(requestParams.PageSize);
            query = query.Include(j => j.JobPostSkills).ThenInclude(jps => jps.Skill);

            var list = await query.ToListAsync();
            var dtos = list.Adapt<List<JobPostDTO>>();
            foreach (var dto in dtos)
            {
                dto.CompanyName = null;
            }

            return PagedResponse<JobPostDTO>.Success(dtos, total, requestParams, StatusCodes.Status200OK);

        }

        public async Task<JobPostDTO?> GetByIdAsync(int id)
        {
            return await GetByIdAsync(id, false);
        }

        public async Task<JobPostDTO?> GetByIdAsync(int id, bool includeInactive)
        {
            IQueryable<JobPost> query = _repo.GetAll(false);
            if (includeInactive)
            {
                query = query.IgnoreQueryFilters();
            }

            var e = await query
                .Where(j => j.Id == id)
                .Include(j => j.Applications)
                .Include(j => j.JobPostSkills)
                .ThenInclude(jps => jps.Skill)
                .FirstOrDefaultAsync();

            var dto = e?.Adapt<JobPostDTO>();
            if (dto != null)
            {
                dto.CompanyName = null;
            }
            return dto;
        }

        public async Task<JobPostDTO?> UpdateAsync(int id, JobPostDTO dto)
        {
            var e = await _repo.Query(j => j.Id == id, false)
                .Include(j => j.JobPostSkills)
                .FirstOrDefaultAsync();
            if (e == null) return null;
            e.Title = dto.Title;
            e.Description = dto.Description;
            e.CompanyName = dto.CompanyName;
            e.Location = dto.Location;
            e.Salary = dto.Salary;
            e.Experience = dto.Experience;
            e.RecruiterWhatsAppNumber = dto.RecruiterWhatsAppNumber;

            if (dto.SkillIds != null)
            {
                var skillIds = NormalizeSkillIds(dto.SkillIds);
                var existingSkillIds = await GetExistingSkillIdsAsync(skillIds);
                var desiredIds = new HashSet<int>(existingSkillIds);
                var toRemove = e.JobPostSkills.Where(jps => !desiredIds.Contains(jps.SkillId)).ToList();
                foreach (var item in toRemove)
                {
                    e.JobPostSkills.Remove(item);
                }

                var currentIds = e.JobPostSkills.Select(jps => jps.SkillId).ToHashSet();
                foreach (var skillId in desiredIds)
                {
                    if (!currentIds.Contains(skillId))
                    {
                        e.JobPostSkills.Add(new JobPostSkill { JobPostId = e.Id, SkillId = skillId });
                    }
                }

                e.Skils = desiredIds.Count > 0 ? await GetSkillNameListAsync(existingSkillIds) : string.Empty;
            }
            _repo.Update(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<JobPostDTO>();
        }

        private static List<int> NormalizeSkillIds(ICollection<int>? skillIds)
        {
            return skillIds?
                .Where(id => id > 0)
                .Distinct()
                .ToList() ?? new List<int>();
        }

        private async Task<string> GetSkillNameListAsync(List<int> skillIds)
        {
            var names = await _skillRepo
                .Query(skill => skillIds.Contains(skill.Id))
                .Select(skill => skill.Name)
                .ToListAsync();

            return string.Join(", ", names);
        }

        private async Task<List<int>> GetExistingSkillIdsAsync(List<int> skillIds)
        {
            return await _skillRepo
                .Query(skill => skillIds.Contains(skill.Id))
                .Select(skill => skill.Id)
                .ToListAsync();
        }

        private static (List<int> skillIds, List<CommonFilterParams>? remainingFilters) ExtractSkillFilters(List<CommonFilterParams>? filters)
        {
            if (filters == null || filters.Count == 0)
            {
                return (new List<int>(), filters);
            }

            var skillFilters = filters
                .Where(f => f.FieldName != null && f.FieldName.Equals("skillId", StringComparison.OrdinalIgnoreCase))
                .ToList();

            if (skillFilters.Count == 0)
            {
                return (new List<int>(), filters);
            }

            var remaining = filters.Except(skillFilters).ToList();
            var skillIds = new List<int>();

            foreach (var filter in skillFilters)
            {
                if (filter.Value == null) continue;
                if (filter.Value is System.Text.Json.JsonElement jsonElement)
                {
                    if (jsonElement.ValueKind == System.Text.Json.JsonValueKind.Array)
                    {
                        foreach (var item in jsonElement.EnumerateArray())
                        {
                            if (item.TryGetInt32(out var id)) skillIds.Add(id);
                        }
                    }
                    else if (jsonElement.ValueKind == System.Text.Json.JsonValueKind.Number && jsonElement.TryGetInt32(out var id))
                    {
                        skillIds.Add(id);
                    }
                    else if (jsonElement.ValueKind == System.Text.Json.JsonValueKind.String)
                    {
                        skillIds.AddRange(ParseSkillIds(jsonElement.GetString()));
                    }
                    continue;
                }

                if (int.TryParse(filter.Value.ToString(), out var singleId))
                {
                    skillIds.Add(singleId);
                    continue;
                }

                skillIds.AddRange(ParseSkillIds(filter.Value.ToString()));
            }

            return (skillIds.Distinct().ToList(), remaining);
        }

        private static (bool includeInactive, List<CommonFilterParams>? remainingFilters) ExtractIncludeInactiveFilter(List<CommonFilterParams>? filters)
        {
            if (filters == null || filters.Count == 0)
            {
                return (false, filters);
            }

            var includeFilters = filters
                .Where(f =>
                    f.FieldName != null &&
                    f.FieldName.Equals("includeInactive", StringComparison.OrdinalIgnoreCase))
                .ToList();

            if (includeFilters.Count == 0)
            {
                return (false, filters);
            }

            var includeInactive = false;
            foreach (var includeFilter in includeFilters)
            {
                if (includeFilter.Value is bool boolValue)
                {
                    includeInactive = includeInactive || boolValue;
                    continue;
                }

                if (includeFilter.Value != null &&
                    bool.TryParse(includeFilter.Value.ToString(), out var parsed))
                {
                    includeInactive = includeInactive || parsed;
                }
            }

            var remaining = filters
                .Where(f =>
                    f.FieldName == null ||
                    !f.FieldName.Equals("includeInactive", StringComparison.OrdinalIgnoreCase))
                .ToList();

            return (includeInactive, remaining);
        }

        private static IEnumerable<int> ParseSkillIds(string? raw)
        {
            if (string.IsNullOrWhiteSpace(raw)) return Array.Empty<int>();
            return raw.Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(value => int.TryParse(value.Trim(), out var id) ? id : 0)
                .Where(id => id > 0);
        }
    }
}
