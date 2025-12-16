using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models;

[Table("Clients")]
public class Client : EntityBase
{
    [Key]
    public int Id { get; set; }

    [StringLength(200)]
    public string? Name { get; set; }

    [Required]
    [StringLength(500)]
    public string LogoUrl { get; set; } = null!;
}
