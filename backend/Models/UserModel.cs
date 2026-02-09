using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace JadwalPetani.Models;

public class User
{
    public int Id { get; set; }
    [Required]
    [EmailAddress]
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string? GoogleId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public ICollection<PlantingSchedule>? PlantingSchedules { get; set; }
}
