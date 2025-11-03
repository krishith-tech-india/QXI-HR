using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace Data.Models
{
    public class EntityBase
    {

        [DataType(DataType.DateTime)]
        public DateTime? CreatedAt { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime? UpdatedAt { get; set; }

        [MaxLength(500), DataType(DataType.EmailAddress)]
        public string? CreatedBy { get; set; }

        [MaxLength(500), DataType(DataType.EmailAddress)]
        public string? UpdatedBy { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
