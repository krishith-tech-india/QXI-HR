
using Core.Enums;
using Newtonsoft.Json;

namespace Core.DTOs
{
    public class QXIRoleDTO
    {
        public int Id { get; set; }
        public string RoleName { get; set; } = null!;
        public string Description { get; set; } = null!;

        [JsonIgnore]
        public Roles Role => Enum.Parse<Roles>(RoleName, true);
    }
}