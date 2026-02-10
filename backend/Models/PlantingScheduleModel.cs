using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace JadwalPetani.Models;

public class PlantingSchedule
{
    public int Id { get; set; }
    [Required]
    public string? PlantName { get; set; }
    [Required]
    public DateTime PlantingDate { get; set; }
    public int UserId { get; set; }

    [JsonIgnore]
    public User? User { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<ScheduleTask>? Tasks { get; set; }
}
