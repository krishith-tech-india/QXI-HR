using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    [Table("ApplicantProfiles")]
    public class ApplicantProfile : EntityBase
    {
        [Key]
        public int UserId { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string ProfileHeadline { get; set; } = null!;

        [StringLength(2000)]
        [Unicode(false)]
        public string? ProfileSummary { get; set; }

        [StringLength(500), DataType(DataType.Url)]
        [Unicode(false)]
        public string? PortfolioUrl { get; set; }

        [StringLength(500), DataType(DataType.Url)]
        [Unicode(false)]
        public string? ResumeUrl { get; set; }

        [StringLength(500), DataType(DataType.Url)]
        [Unicode(false)]
        public string? ProfileImageUrl { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string? MiddleName { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string? AddressLine1 { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string? AddressLine2 { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string? City { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string? State { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string? Country { get; set; }

        [StringLength(20)]
        [Unicode(false)]
        public string? PostalCode { get; set; }

        public virtual QXIUser User { get; set; } = null!;
        public virtual ICollection<ApplicantEmployment> Employments { get; set; } = new List<ApplicantEmployment>();
        public virtual ICollection<ApplicantEducation> Educations { get; set; } = new List<ApplicantEducation>();
        public virtual ICollection<ApplicantProject> Projects { get; set; } = new List<ApplicantProject>();
        public virtual ICollection<ApplicantCertification> Certifications { get; set; } = new List<ApplicantCertification>();
        public virtual ICollection<ApplicantLanguage> Languages { get; set; } = new List<ApplicantLanguage>();

        public int SignupStep { get; set; } = 1;
    }
}
