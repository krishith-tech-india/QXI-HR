using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    [Table("JobPosts")]
    public class JobPost : EntityBase
    {
        [Key]
        public int Id { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string Title { get; set; }

        [Unicode(false)]
        public string Description { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string CompanyName { get; set; }

        [StringLength(100)]
        [Unicode(false)]
        public string Location { get; set; }

        [Unicode(false)]
        public string Skils { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string Salary { get; set; }

        [StringLength(200)]
        [Unicode(false)]
        public string Experience { get; set; }

        public virtual ICollection<JobApplication> Applications { get; set; } = [];
    }
}
