using System.Text;
using System.Text.Json;
using JadwalPetani.Models;
using JadwalPetani.Data;
using Microsoft.EntityFrameworkCore;

namespace JadwalPetani.Services;
public interface IScheduleService
{
    Task<PlantingSchedule> CreateScheduleAsync(int userId, string plantName, DateTime plantingDate);
    Task<List<ScheduleViewModel>> GetUserSchedulesAsync(int userId);
    Task<ScheduleViewModel> GetScheduleByIdAsync(int scheduleId);
    Task<EditTaskViewModel> GetTaskByIdAsync(int taskId);
    Task<bool> UpdateTaskAsync(EditTaskViewModel model);
    Task<bool> UpdateEventIdAsync(int taskId, string eventId);
    Task<bool> DeleteScheduleAsync(int scheduleId);
    IAsyncEnumerable<string> GenerateScheduleStreamAsync(string plantName, DateTime plantingDate);
}

public class ScheduleService : IScheduleService
{
    private readonly ApplicationDbContext _context;
    private readonly IGeminiService _geminiService;

    public ScheduleService(ApplicationDbContext context, IGeminiService geminiService)
    {
        _context = context;
        _geminiService = geminiService;
    }

    public async Task<PlantingSchedule> CreateScheduleAsync(int userId, string plantName, DateTime plantingDate)
    {
        var tasks = await _geminiService.GenerateScheduleAsync(plantName, plantingDate);

        var schedule = new PlantingSchedule
        {
            PlantName = plantName,
            PlantingDate = plantingDate,
            UserId = userId,
            Tasks = tasks
        };

        _context.PlantingSchedules.Add(schedule);
        await _context.SaveChangesAsync();

        return schedule;
    }

    public async Task<List<ScheduleViewModel>> GetUserSchedulesAsync(int userId)
    {
        var schedules = await _context.PlantingSchedules
            .Include(s => s.Tasks)
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        return schedules.Select(s => new ScheduleViewModel
        {
            ScheduleId = s.Id,
            PlantName = s.PlantName,
            PlantingDate = s.PlantingDate,
            Tasks = s.Tasks!.Select(t => new TaskViewModel
            {
                Id = t.Id,
                TaskName = t.TaskName,
                Description = t.Description,
                ScheduledDate = t.ScheduledDate,
                IsCompleted = t.IsCompleted
            }).OrderBy(t => t.ScheduledDate).ToList()
        }).ToList();
    }

    public async Task<ScheduleViewModel> GetScheduleByIdAsync(int scheduleId)
    {
        var schedule = await _context.PlantingSchedules
            .Include(s => s.Tasks)
            .FirstOrDefaultAsync(s => s.Id == scheduleId);

        if (schedule == null) return null!;

        return new ScheduleViewModel
        {
            ScheduleId = schedule.Id,
            PlantName = schedule.PlantName,
            PlantingDate = schedule.PlantingDate,
            Tasks = schedule.Tasks!.Select(t => new TaskViewModel
            {
                Id = t.Id,
                TaskName = t.TaskName,
                Description = t.Description,
                ScheduledDate = t.ScheduledDate,
                IsCompleted = t.IsCompleted
            }).OrderBy(t => t.ScheduledDate).ToList()
        };
    }

    public async Task<EditTaskViewModel> GetTaskByIdAsync(int taskId)
    {
        var task = await _context.ScheduleTasks.FindAsync(taskId);
        if (task == null) return null!;

        return new EditTaskViewModel
        {
            Id = task.Id,
            TaskName = task.TaskName,
            Description = task.Description,
            ScheduledDate = task.ScheduledDate,
            IsCompleted = task.IsCompleted
        };
    }

    public async Task<bool> UpdateTaskAsync(EditTaskViewModel model)
    {
        var task = await _context.ScheduleTasks.FindAsync(model.Id);
        if (task == null) return false;

        task.TaskName = model.TaskName;
        task.Description = model.Description;
        task.ScheduledDate = model.ScheduledDate;
        task.IsCompleted = model.IsCompleted;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateEventIdAsync(int taskId, string eventId)
    {
        var task = await _context.ScheduleTasks.FindAsync(taskId);
        if (task == null) return false;

        task.GoogleCalendarEventId = eventId;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteScheduleAsync(int scheduleId)
    {
        var schedule = await _context.PlantingSchedules.FindAsync(scheduleId);
        if (schedule == null) return false;

        _context.PlantingSchedules.Remove(schedule);
        await _context.SaveChangesAsync();
        return true;
    }

    public IAsyncEnumerable<string> GenerateScheduleStreamAsync(string plantName, DateTime plantingDate)
    {
        return _geminiService.GenerateScheduleStreamAsync(plantName, plantingDate);
    }
}
