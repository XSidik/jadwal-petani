# Jadwal Petani 🌾

An intelligent farming scheduler designed to help farmers manage their planting activities, integrate with Google Calendar, and leverage AI for personalized farming advice.

## 🚀 Key Features

- **Smart Scheduling**: AI-powered planting schedules tailored to your needs.
- **Google Integration**: Sync your farming tasks directly with Google Calendar.
- **User Authentication**: Secure Login using Google OAuth.
- **Modern UI**: Clean, responsive dashboard built with Next.js and Tailwind CSS.
- **Local Database**: Robust data management using SQLite.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [.NET 10 (ASP.NET Core API)](https://dotnet.microsoft.com/en-us/download/dotnet/10.0)
- **Language**: C#
- **Database**: Entity Framework Core with SQLite
- **AI Integration**: Google Gemini API
- **Authentication**: Google OAuth 2.0
- **External API**: Google Calendar API

### Frontend
- **Framework**: [Next.js 16 (Turbopack)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **HTTP Client**: Axios

---

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js 18+](https://nodejs.org/)
- Google Cloud Console Project (with Gemini and Calendar APIs enabled)

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your credentials:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GEMINI_API_KEY`
4. Run the backend:
   ```bash
   dotnet watch run
   ```
   *The API will usually run at `http://localhost:5174` (check `launchSettings.json`).*

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Create a `.env.local` file:
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:5174" > .env.local
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The dashboard will be available at `http://localhost:3000`.*

---

## 📁 Project Structure

```text
jadwal-petani/
├── backend/          # .NET Core API
├── frontend/         # Next.js Application
├── .gitignore        # Global git ignore
└── README.md         # Project documentation
```

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
