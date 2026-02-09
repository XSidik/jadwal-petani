using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace JadwalPetani.Models;

public class ScheduleTask
{
    public int Id { get; set; }
    [Required]
    public string? TaskName { get; set; }
    public string? Description { get; set; }
    [Required]
    public DateTime ScheduledDate { get; set; }
    public bool IsCompleted { get; set; } = false;
    public string? GoogleCalendarEventId { get; set; }
    public int PlantingScheduleId { get; set; }

    [JsonIgnore]
    public PlantingSchedule? PlantingSchedule { get; set; }
}

public class GoogleEventResponse
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }

    [JsonPropertyName("summary")]
    public string? Summary { get; set; }

    [JsonPropertyName("htmlLink")]
    public string? HtmlLink { get; set; }
}
