using Microsoft.AspNetCore.Mvc;
using JadwalPetani.Models;
using JadwalPetani.Services;

namespace JadwalPetani.Controllers;

[Route("api/[controller]")]
[ApiController]
public class HomeController : ControllerBase
{
    private readonly IHomeService _homeService;

    public HomeController(IHomeService homeService)
    {
        _homeService = homeService;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<HomeStatsViewModel>> GetStats()
    {
        var stats = await _homeService.GetHomeStatsAsync();
        return Ok(stats);
    }
}
