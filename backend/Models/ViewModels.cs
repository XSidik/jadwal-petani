using System.ComponentModel.DataAnnotations;
namespace JadwalPetani.Models;

// View Models
public class CreateScheduleViewModel
{
    [Required(ErrorMessage = "Plant name is required")]
    public string? PlantName { get; set; }
    [Required(ErrorMessage = "Planting date is required")]
    [DataType(DataType.Date)]
    public DateTime PlantingDate { get; set; }
}

public class ScheduleViewModel
{
    public int ScheduleId { get; set; }
    public string? PlantName { get; set; }
    public DateTime PlantingDate { get; set; }
    public List<TaskViewModel>? Tasks { get; set; }
}

public class TaskViewModel
{
    public int Id { get; set; }
    public string? EventId { get; set; }
    public string? TaskName { get; set; }
    public string? Description { get; set; }
    public DateTime ScheduledDate { get; set; }
    public bool IsCompleted { get; set; }
}

public class EditTaskViewModel
{
    public int Id { get; set; }
    [Required]
    public string? TaskName { get; set; }
    public string? Description { get; set; }
    [Required]
    public DateTime ScheduledDate { get; set; }
    public bool IsCompleted { get; set; }
}
