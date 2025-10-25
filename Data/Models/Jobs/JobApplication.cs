using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    [Table("JobApplications")]
    [Index(nameof(JobPostId), Name = "IX_JobApplications_JobPostId")]
    public class JobApplication : EntityBase
    {
        [Key]
        public int Id { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string? ApplicantName { get; set; }

        [StringLength(500)]
        [Unicode(false)]
        public string? ApplicantEmail { get; set; }

        [StringLength(15)]
        [Unicode(false)]
        public string? ApplicantPhoneNumber { get; set; }

        [StringLength(500)]
        [Unicode(false)]
        public string? ResumeUrl { get; set; }

        [StringLength(500)]
        [Unicode(false)]
        public string? CoverLetterUrl { get; set; }

        public int JobPostId { get; set; }
        public virtual JobPost JobPost { get; set; }
    }
}
