using Core.DTOs;
using Data.Models;
using Data.Reopsitories;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class JobPostService : IJobPostService
    {
        private readonly IRepository<JobPost> _repo;
        public JobPostService(IRepository<JobPost> repo) => _repo = repo;

        public async Task<JobPostDTO> CreateAsync(JobPostDTO dto)
        {
            var entity = dto.Adapt<JobPost>();
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

        public async Task<IEnumerable<JobPostDTO>> GetAllAsync()
        {
            var list = await _repo.GetAll(false).ToListAsync();
            return list.Adapt<IEnumerable<JobPostDTO>>();
        }

        public async Task<JobPostDTO?> GetByIdAsync(int id)
        {
            var e = await _repo.Query(j => j.Id == id, false).Include(j => j.Applications).FirstOrDefaultAsync();
            return e?.Adapt<JobPostDTO>();
        }

        public async Task<JobPostDTO?> UpdateAsync(int id, JobPostDTO dto)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return null;
            dto.Adapt(e);
            _repo.Update(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<JobPostDTO>();
        }
    }
}