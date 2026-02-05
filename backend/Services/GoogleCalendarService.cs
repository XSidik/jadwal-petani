using System.Text;
using System.Text.Json;
using JadwalPetani.Models;
using JadwalPetani.Data;
using Microsoft.EntityFrameworkCore;

namespace JadwalPetani.Services;
public interface IGoogleCalendarService
{
    Task<bool> ExportToCalendarAsync(string accessToken, ScheduleViewModel schedule);
    Task<bool> DeleteFromCalendarAsync(string accessToken, int scheduleId);
}

public class GoogleCalendarService : IGoogleCalendarService
{
    private readonly HttpClient _httpClient;
    private readonly IScheduleService _scheduleService;
    private readonly ApplicationDbContext _context;

    public GoogleCalendarService(HttpClient httpClient, IScheduleService scheduleService, ApplicationDbContext context)
    {
        _httpClient = httpClient;
        _scheduleService = scheduleService;
        _context = context;
    }

    public async Task<bool> ExportToCalendarAsync(string accessToken, ScheduleViewModel schedule)
    {
        try
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            foreach (var task in schedule.Tasks!)
            {
                var calendarEvent = new
                {
                    summary = $"{schedule.PlantName} - {task.TaskName}",
                    description = task.Description,
                    start = new
                    {
                        date = task.ScheduledDate.ToString("yyyy-MM-dd")
                    },
                    end = new
                    {
                        date = task.ScheduledDate.ToString("yyyy-MM-dd")
                    }
                };

                var json = JsonSerializer.Serialize(calendarEvent);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(
                    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
                    content
                );

                if (response.IsSuccessStatusCode)
                {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    var createdEvent = JsonSerializer.Deserialize<GoogleEventResponse>(responseBody);

                    var googleEventId = createdEvent?.Id;

                    if (googleEventId != null)
                        await _scheduleService.UpdateEventIdAsync(task.Id, googleEventId);
                }
                else
                {
                    return false;
                }
            }

            return true;
        }
        catch
        {
            return false;
        }
    }

    public async Task<bool> DeleteFromCalendarAsync(string accessToken, int scheduleId)
    {
        try
        {
            var tasks = await _context.ScheduleTasks.Where(t => t.PlantingScheduleId == scheduleId).ToListAsync();
            foreach (var task in tasks.Where(t => !string.IsNullOrEmpty(t.GoogleCalendarEventId)))
            {
                _httpClient.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

                var response = await _httpClient.DeleteAsync(
                    $"https://www.googleapis.com/calendar/v3/calendars/primary/events/{task.GoogleCalendarEventId}"
                );

                if (!response.IsSuccessStatusCode)
                {
                    return false;
                }
            }

            return true;
        }
        catch
        {
            return false;
        }
    }
}
