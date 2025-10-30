using Core.DTOs;
using Data.Models;
using Data.Reopsitories;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services
{
    public class JobApplicationService : IJobApplicationService
    {
        private readonly IRepository<JobApplication> _repo;
        public JobApplicationService(IRepository<JobApplication> repo) => _repo = repo;

        public async Task<JobApplicationDTO> CreateAsync(JobApplicationDTO dto)
        {
            var entity = dto.Adapt<JobApplication>();
            _repo.Insert(entity);
            await _repo.SaveChangesAsync();
            return entity.Adapt<JobApplicationDTO>();
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return false;
            _repo.Delete(e);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<JobApplicationDTO>> GetAllAsync()
        {
            var list = await _repo.GetAll(true).ToListAsync();
            return list.Adapt<IEnumerable<JobApplicationDTO>>();
        }

        public async Task<JobApplicationDTO?> GetByIdAsync(int id)
        {
            var e = await _repo.Query(a => a.Id == id, false).Include(a => a.JobPost).FirstOrDefaultAsync();
            return e?.Adapt<JobApplicationDTO>();
        }

        public async Task<JobApplicationDTO?> UpdateAsync(int id, JobApplicationDTO dto)
        {
            var e = await _repo.GetByIdAsync(id);
            if (e == null) return null;
            dto.Adapt(e);
            _repo.Update(e);
            await _repo.SaveChangesAsync();
            return e.Adapt<JobApplicationDTO>();
        }

        public async Task<IEnumerable<JobApplicationDTO>> GetByJobPostIdAsync(int jobPostId)
        {
            var list = await _repo.Query(a => a.JobPostId == jobPostId, true).ToListAsync();
            return list.Adapt<IEnumerable<JobApplicationDTO>>();
        }
    }
}