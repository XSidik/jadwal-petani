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
public class AccountController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AccountController(ApplicationDbContext context)
    {
        _context = context;
    }

    private string FrontendUrl => Config.FrontendUrl;

    [HttpGet("user")]
    public IActionResult GetUserInfo()
    {
        if (HttpContext.Session.GetInt32("UserId") == null)
        {
            return Unauthorized();
        }

        return Ok(new
        {
            Id = HttpContext.Session.GetInt32("UserId"),
            Name = HttpContext.Session.GetString("UserName"),
            Email = HttpContext.Session.GetString("UserEmail")
        });
    }

    [HttpGet("google-login")]
    public IActionResult GoogleLogin()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action("GoogleResponse")
        };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("google-response")]
    public async Task<IActionResult> GoogleResponse()
    {
        var result = await HttpContext.AuthenticateAsync();

        if (!result.Succeeded)
        {
            return Redirect($"{FrontendUrl}/login?error=auth_failed");
        }

        var claims = result.Principal.Identities.FirstOrDefault()?.Claims;
        var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;
        var googleId = claims?.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(email))
        {
            return Redirect($"{FrontendUrl}/login?error=no_email");
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            user = new User
            {
                Email = email,
                Name = name,
                GoogleId = googleId
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        HttpContext.Session.SetInt32("UserId", user.Id);
        HttpContext.Session.SetString("UserName", user.Name!);
        HttpContext.Session.SetString("UserEmail", user.Email!);

        return Redirect($"{FrontendUrl}/schedules");
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync();
        HttpContext.Session.Clear();
        return Ok();
    }
}
