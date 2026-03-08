using JadwalPetani.Data;
using JadwalPetani.Models;
using Microsoft.EntityFrameworkCore;

namespace JadwalPetani.Services;

public interface IHomeService
{
    Task<HomeStatsViewModel> GetHomeStatsAsync();
}

public class HomeService : IHomeService
{
    private readonly ApplicationDbContext _context;

    public HomeService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<HomeStatsViewModel> GetHomeStatsAsync()
    {
        var totalUsers = await _context.Users.CountAsync();
        var totalSchedules = await _context.PlantingSchedules.CountAsync();

        return new HomeStatsViewModel
        {
            TotalUsers = totalUsers,
            TotalSchedules = totalSchedules
        };
    }
}
