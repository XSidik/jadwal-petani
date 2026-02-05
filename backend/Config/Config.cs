namespace JadwalPetani;

public static class Config
{
    public static string FrontendUrl { get; private set; } = "http://localhost:3000";
    public static string GoogleClientId { get; private set; } = string.Empty;
    public static string GoogleClientSecret { get; private set; } = string.Empty;
    public static string GeminiApiKey { get; private set; } = string.Empty;
    public static string ConnectionString { get; private set; } = "Data Source=farmingscheduler.db";

    public static void Initialize(IConfiguration configuration)
    {
        FrontendUrl = configuration["FRONTEND_URL"] ?? configuration["FrontendUrl"] ?? string.Empty;
        GoogleClientId = configuration["GOOGLE_CLIENT_ID"] ?? configuration["Authentication:Google:ClientId"] ?? string.Empty;
        GoogleClientSecret = configuration["GOOGLE_CLIENT_SECRET"] ?? configuration["Authentication:Google:ClientSecret"] ?? string.Empty;
        GeminiApiKey = configuration["GEMINI_API_KEY"] ?? configuration["Gemini:ApiKey"] ?? string.Empty;
        ConnectionString = configuration["CONNECTION_STRING"] ?? configuration.GetConnectionString("DefaultConnection") ?? "Data Source=farmingscheduler.db";
    }
}
