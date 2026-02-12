using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using JadwalPetani.Controllers;
using JadwalPetani.Models;
using JadwalPetani.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace JadwalPetani.Tests;

public class ScheduleControllerTests
{
    private readonly Mock<IScheduleService> _mockScheduleService;
    private readonly Mock<IGoogleCalendarService> _mockCalendarService;
    private readonly ScheduleController _controller;

    public ScheduleControllerTests()
    {
        _mockScheduleService = new Mock<IScheduleService>();
        _mockCalendarService = new Mock<IGoogleCalendarService>();
        _controller = new ScheduleController(_mockScheduleService.Object, _mockCalendarService.Object);

        // Setup mock HttpContext for session
        var mockSession = new Mock<ISession>();
        var httpContext = new DefaultHttpContext();
        httpContext.Session = mockSession.Object;
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };
    }

    [Fact]
    public async Task Index_ReturnsUnauthorized_WhenUserIdIsZero()
    {
        // Arrange
        // (Default session mock returns null for GetInt32, so userId will be 0)

        // Act
        var result = await _controller.Index();

        // Assert
        Assert.IsType<UnauthorizedResult>(result.Result);
    }

    [Fact]
    public async Task Index_ReturnsOk_WhenUserIdIsSet()
    {
        // Arrange
        int userId = 1;
        // GetInt32 extension uses big-endian: data[0] << 24 | data[1] << 16 | data[2] << 8 | data[3]
        byte[] bytes = new byte[] { 0, 0, 0, (byte)userId };
        var mockSession = new Mock<ISession>();
        mockSession.Setup(s => s.TryGetValue("UserId", out bytes)).Returns(true);
        _controller.HttpContext.Session = mockSession.Object;

        var mockSchedules = new List<ScheduleViewModel>
        {
            new ScheduleViewModel { ScheduleId = 1, PlantName = "Padi" }
        };
        _mockScheduleService.Setup(s => s.GetUserSchedulesAsync(userId))
            .ReturnsAsync(mockSchedules);

        // Act
        var result = await _controller.Index();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedSchedules = Assert.IsType<List<ScheduleViewModel>>(okResult.Value);
        Assert.Single(returnedSchedules);
        Assert.Equal("Padi", returnedSchedules[0].PlantName);
    }

    [Fact]
    public async Task Details_ReturnsNotFound_WhenScheduleDoesNotExist()
    {
        // Arrange
        int scheduleId = 99;
        _mockScheduleService.Setup(s => s.GetScheduleByIdAsync(scheduleId))
            .ReturnsAsync((ScheduleViewModel)null!);

        // Act
        var result = await _controller.Details(scheduleId);

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task Details_ReturnsOk_WhenScheduleExists()
    {
        // Arrange
        int scheduleId = 1;
        var mockSchedule = new ScheduleViewModel { ScheduleId = scheduleId, PlantName = "Jagung" };
        _mockScheduleService.Setup(s => s.GetScheduleByIdAsync(scheduleId))
            .ReturnsAsync(mockSchedule);

        // Act
        var result = await _controller.Details(scheduleId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedSchedule = Assert.IsType<ScheduleViewModel>(okResult.Value);
        Assert.Equal("Jagung", returnedSchedule.PlantName);
    }
}
