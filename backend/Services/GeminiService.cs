using System.Text;
using System.Text.Json;
using JadwalPetani.Models;
using JadwalPetani.Data;
using Microsoft.EntityFrameworkCore;

namespace JadwalPetani.Services;
public interface IGeminiService
{
    Task<List<ScheduleTask>> GenerateScheduleAsync(string plantName, DateTime plantingDate);
    IAsyncEnumerable<string> GenerateScheduleStreamAsync(string plantName, DateTime plantingDate);
}

public class GeminiService : IGeminiService
{
    private readonly HttpClient _httpClient;

    public GeminiService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
    }

    public async IAsyncEnumerable<string> GenerateScheduleStreamAsync(string plantName, DateTime plantingDate)
    {
        var apiKey = Config.GeminiApiKey;
        var url = $"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:streamGenerateContent?key={apiKey}&alt=sse";

        var prompt = GetPrompt(plantName, plantingDate);

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var request = new HttpRequestMessage(HttpMethod.Post, url) { Content = content };
        using var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);
        response.EnsureSuccessStatusCode();

        using var stream = await response.Content.ReadAsStreamAsync();
        using var reader = new StreamReader(stream);

        string? line;
        while ((line = await reader.ReadLineAsync()) != null)
        {
            if (string.IsNullOrWhiteSpace(line)) continue;

            if (line.StartsWith("data: "))
            {
                var jsonData = line.Substring(6);
                var chunk = JsonSerializer.Deserialize<GeminiResponse>(jsonData);
                var text = chunk?.candidates?[0]?.content?.parts?[0]?.text;

                if (!string.IsNullOrEmpty(text))
                {
                    yield return text;
                }
            }
        }
    }

    private string GetPrompt(string plantName, DateTime plantingDate)
    {
        var template = Config.GeminiPromptTemplate;
        return template
            .Replace("{plantName}", plantName)
            .Replace("{plantingDate}", plantingDate.ToString("yyyy-MM-dd"));
    }

    public async Task<List<ScheduleTask>> GenerateScheduleAsync(string plantName, DateTime plantingDate)
    {
        var apiKey = Config.GeminiApiKey;
        var url = $"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={apiKey}";

        var prompt = GetPrompt(plantName, plantingDate);

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await _httpClient.PostAsync(url, content);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var geminiResponse = JsonSerializer.Deserialize<GeminiResponse>(responseContent);

            var responseText = geminiResponse?.candidates?[0]?.content?.parts?[0]?.text;

            if (string.IsNullOrEmpty(responseText))
            {
                return GetDefaultSchedule(plantingDate);
            }

            // Extract JSON from response
            var jsonStart = responseText.IndexOf('[');
            var jsonEnd = responseText.LastIndexOf(']') + 1;

            if (jsonStart >= 0 && jsonEnd > jsonStart)
            {
                var jsonArray = responseText.Substring(jsonStart, jsonEnd - jsonStart);
                var taskDtos = JsonSerializer.Deserialize<List<TaskDto>>(jsonArray);

                var tasks = new List<ScheduleTask>();
                foreach (var dto in taskDtos!)
                {
                    tasks.Add(new ScheduleTask
                    {
                        TaskName = dto.taskName,
                        Description = dto.description,
                        ScheduledDate = plantingDate.AddDays(dto.daysFromPlanting)
                    });
                }

                return tasks;
            }

            return GetDefaultSchedule(plantingDate);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error generating schedule: {ex.Message}");
            return GetDefaultSchedule(plantingDate);
        }
    }

    private List<ScheduleTask> GetDefaultSchedule(DateTime plantingDate)
    {
        return new List<ScheduleTask>
        {
            new ScheduleTask { TaskName = "Initial Watering", Description = "Water thoroughly after planting", ScheduledDate = plantingDate },
            new ScheduleTask { TaskName = "First Fertilizer", Description = "Apply starter fertilizer", ScheduledDate = plantingDate.AddDays(7) },
            new ScheduleTask { TaskName = "Pest Inspection", Description = "Check for pests and diseases", ScheduledDate = plantingDate.AddDays(14) },
            new ScheduleTask { TaskName = "Second Fertilizer", Description = "Apply growth fertilizer", ScheduledDate = plantingDate.AddDays(30) },
            new ScheduleTask { TaskName = "Pest Control", Description = "Apply organic pest control if needed", ScheduledDate = plantingDate.AddDays(45) },
            new ScheduleTask { TaskName = "Harvest Preparation", Description = "Check for harvest readiness", ScheduledDate = plantingDate.AddDays(75) }
        };
    }

    private class TaskDto
    {
        public string taskName { get; set; }
        public string description { get; set; }
        public int daysFromPlanting { get; set; }
    }

    private class GeminiResponse
    {
        public Candidate[] candidates { get; set; }
    }

    private class Candidate
    {
        public Content content { get; set; }
    }

    private class Content
    {
        public Part[] parts { get; set; }
    }

    private class Part
    {
        public string text { get; set; }
    }
}
