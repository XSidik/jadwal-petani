using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using JadwalPetani.Data;
using JadwalPetani.Models;
using JadwalPetani.Services;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace JadwalPetani.Tests;

public class ScheduleServiceTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly Mock<IGeminiService> _mockGeminiService;
    private readonly ScheduleService _scheduleService;

    public ScheduleServiceTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new ApplicationDbContext(options);
        _mockGeminiService = new Mock<IGeminiService>();
        _scheduleService = new ScheduleService(_context, _mockGeminiService.Object);
    }

    [Fact]
    public async Task CreateScheduleAsync_ShouldSaveScheduleAndReturnsTasks()
    {
        // Arrange
        int userId = 1;
        string plantName = "Padi";
        DateTime plantingDate = new DateTime(2025, 1, 1);
        var mockTasks = new List<ScheduleTask>
        {
            new ScheduleTask { TaskName = "Task 1", Description = "Desc 1", ScheduledDate = plantingDate.AddDays(1) },
            new ScheduleTask { TaskName = "Task 2", Description = "Desc 2", ScheduledDate = plantingDate.AddDays(2) }
        };

        _mockGeminiService.Setup(s => s.GenerateScheduleAsync(plantName, plantingDate))
            .ReturnsAsync(mockTasks);

        // Act
        var result = await _scheduleService.CreateScheduleAsync(userId, plantName, plantingDate);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(plantName, result.PlantName);
        Assert.Equal(userId, result.UserId);
        Assert.Equal(2, result.Tasks!.Count);

        var savedSchedule = await _context.PlantingSchedules.Include(s => s.Tasks).FirstOrDefaultAsync(s => s.Id == result.Id);
        Assert.NotNull(savedSchedule);
        Assert.Equal(2, savedSchedule.Tasks!.Count);
    }

    [Fact]
    public async Task GetUserSchedulesAsync_ShouldReturnSchedulesForUser()
    {
        // Arrange
        int userId = 1;
        _context.PlantingSchedules.Add(new PlantingSchedule
        {
            UserId = userId,
            PlantName = "Jagung",
            PlantingDate = DateTime.Now,
            Tasks = new List<ScheduleTask>()
        });
        _context.PlantingSchedules.Add(new PlantingSchedule
        {
            UserId = 2,
            PlantName = "Padi",
            PlantingDate = DateTime.Now,
            Tasks = new List<ScheduleTask>()
        });
        await _context.SaveChangesAsync();

        // Act
        var result = await _scheduleService.GetUserSchedulesAsync(userId);

        // Assert
        Assert.Single(result);
        Assert.Equal("Jagung", result[0].PlantName);
    }

    [Fact]
    public async Task DeleteScheduleAsync_ShouldRemoveSchedule()
    {
        // Arrange
        var schedule = new PlantingSchedule
        {
            UserId = 1,
            PlantName = "Tomat",
            PlantingDate = DateTime.Now,
            Tasks = new List<ScheduleTask>()
        };
        _context.PlantingSchedules.Add(schedule);
        await _context.SaveChangesAsync();

        // Act
        var result = await _scheduleService.DeleteScheduleAsync(schedule.Id);

        // Assert
        Assert.True(result);
        var deletedSchedule = await _context.PlantingSchedules.FindAsync(schedule.Id);
        Assert.Null(deletedSchedule);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }
}
