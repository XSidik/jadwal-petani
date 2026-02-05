using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using JadwalPetani.Data;
using JadwalPetani.Models;
using JadwalPetani.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace JadwalPetani.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ScheduleController : ControllerBase
{
    private const string InvalidRequestDataMessage = "Invalid request data.";
    private readonly IScheduleService _scheduleService;
    private readonly IGoogleCalendarService _calendarService;

    public ScheduleController(IScheduleService scheduleService, IGoogleCalendarService calendarService)
    {
        _scheduleService = scheduleService;
        _calendarService = calendarService;
    }

    private int GetUserId()
    {
        return HttpContext.Session.GetInt32("UserId") ?? 0;
    }

    [HttpGet]
    public async Task<ActionResult<List<ScheduleViewModel>>> Index()
    {
        var userId = GetUserId();
        if (userId == 0)
        {
            return Unauthorized();
        }

        var schedules = await _scheduleService.GetUserSchedulesAsync(userId);
        return Ok(schedules);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateScheduleViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = GetUserId();
        if (userId == 0)
        {
            return Unauthorized();
        }

        try
        {
            var schedule = await _scheduleService.CreateScheduleAsync(userId, model.PlantName!, model.PlantingDate);
            return CreatedAtAction(nameof(Details), new { id = schedule.Id }, schedule);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error creating schedule: " + ex.Message });
        }
    }

    [HttpPost("create-stream")]
    public async IAsyncEnumerable<string> CreateStream(CreateScheduleViewModel model)
    {
        var userId = GetUserId();
        if (userId == 0)
        {
            yield break;
        }

        await foreach (var chunk in _scheduleService.GenerateScheduleStreamAsync(model.PlantName!, model.PlantingDate))
        {
            yield return chunk;
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ScheduleViewModel>> Details(int id)
    {
        var schedule = await _scheduleService.GetScheduleByIdAsync(id);
        if (schedule == null)
        {
            return NotFound();
        }

        return Ok(schedule);
    }

    [HttpGet("task/{id}")]
    public async Task<ActionResult<EditTaskViewModel>> GetTask(int id)
    {
        var task = await _scheduleService.GetTaskByIdAsync(id);
        if (task == null)
        {
            return NotFound();
        }

        return Ok(task);
    }

    [HttpPut("task/{id}")]
    public async Task<IActionResult> EditTask(int id, EditTaskViewModel model)
    {
        if (id != model.Id || !ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _scheduleService.UpdateTaskAsync(model);
        if (result)
        {
            return Ok(new { message = "Task updated successfully!" });
        }

        return BadRequest(new { message = "Error updating task" });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var accessToken = await HttpContext.GetTokenAsync("access_token");
        if (string.IsNullOrEmpty(accessToken))
        {
            return Unauthorized(new { message = "Not authenticated with Google" });
        }

        var result = await _calendarService.DeleteFromCalendarAsync(accessToken, id);
        if (!result)
        {
            return BadRequest(new { message = "Error deleting from Google Calendar" });
        }

        var deleteResult = await _scheduleService.DeleteScheduleAsync(id);
        if (deleteResult)
        {
            return Ok(new { message = "Schedule deleted successfully!" });
        }

        return BadRequest(new { message = "Error deleting schedule" });
    }

    [HttpPost("{id}/export")]
    public async Task<IActionResult> ExportToCalendar(int id)
    {
        var schedule = await _scheduleService.GetScheduleByIdAsync(id);
        if (schedule == null)
        {
            return NotFound(new { message = "Schedule not found" });
        }

        var accessToken = await HttpContext.GetTokenAsync("access_token");
        if (string.IsNullOrEmpty(accessToken))
        {
            return Unauthorized(new { message = "Not authenticated with Google" });
        }

        var result = await _calendarService.ExportToCalendarAsync(accessToken, schedule);
        if (result)
        {
            return Ok(new { message = "Schedule exported to Google Calendar!" });
        }

        return BadRequest(new { message = "Error exporting to calendar" });
    }
}
