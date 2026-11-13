# ExamWeekWithoutTheCrash (ExamPro)
> **Tagline:** Study Smart. Stay Healthy. Perform Better.

A full-stack, responsive student wellness and examination management platform for college students preparing for **MTT (Mid Term Tests)** and **ETT (End Term Tests)**. 

---

## 🎯 Problem Statement
During intensive college examination periods, students' basic health routines (meals, hydration, and sleep) break down under deadline pressure, impairing working memory, processing speed, and academic performance. **ExamPro** balances structured syllabus revision with non-negotiable biological recovery.

---

## 🚀 Technology Stack
- **Frontend:** React 18, Vite, JavaScript, Tailwind CSS, React Router v7, Lucide Icons, Recharts, Canvas-Confetti
- **Backend:** Node.js, Express, Helmet, CORS, Morgan, Express Rate Limit, Zod validation
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth
- **AI Integration:** Google Gemini API (`@google/generative-ai` with automated contextual fallback engine)
- **Mobile & PWA:** Progressive Web App (`vite-plugin-pwa` service worker & webmanifest) + Capacitor Android Configuration
- **Testing:** Vitest & Supertest (Backend API tests + Frontend Wellness Engine tests)

---

## 📂 Project Architecture
```text
ExamWeekWithoutTheCrash/
├── frontend/
│   ├── src/
│   │   ├── components/      # Navigation, DesktopSidebar, MobileBottomNav
│   │   ├── context/         # StudentContext (Auth, State Sync)
│   │   ├── layouts/         # AppLayout (Responsive Shell)
│   │   ├── pages/           # LandingPage, AuthPage, Dashboard, ExamPlanner, Syllabus, Study, Meals, Hydration, Sleep, Reminders, AIAssistant, Analytics, Settings
│   │   ├── services/        # Supabase client, LocalDataService (Offline Sync)
│   │   ├── utils/           # Wellness score calculator
│   │   └── test/            # Vitest suite
│   ├── capacitor.config.json # Capacitor Android configuration
│   └── vite.config.js       # Vite & PWA Service Worker setup
├── backend/
│   ├── src/
│   │   ├── middleware/      # Auth, Rate limiting
│   │   ├── routes/          # Health, AI, Dashboard, Wellness, StudyPlanner
│   │   ├── services/        # AI Assistant (Gemini), Wellness Engine
│   │   └── utils/           # Supabase server client (ws enabled)
│   ├── tests/               # API endpoint & wellness engine tests
│   └── .env.example
├── supabase/
│   └── migrations/
│       └── 20261113000001_initial_schema.sql # 12 tables + RLS policies + triggers
├── package.json
└── README.md
```

---

## ⚙️ Quickstart & Local Setup

### 1. Prerequisites
- Node.js (v18+) & npm

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Environment Configuration
Create `.env` in `backend/`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase (Optional for local offline mode; required for cloud sync)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# Google Gemini API Key
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Running the Application
```bash
# In one terminal: run backend
cd backend
npm run dev

# In another terminal: run frontend
cd frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Testing
```bash
# Run backend API & logic tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

---

## 📱 Android App (PWA & Capacitor)
1. **PWA Installation:** Open the web app on Android Chrome and select **"Add to Home screen"**. It operates in standalone mode with full offline fallback.
2. **Capacitor Android Build:**
   ```bash
   cd frontend
   npm run build
   npx cap add android
   npx cap sync
   npx cap open android
   ```
   Open Android Studio to compile and sign your APK. *(Note: Real APK generation requires Android Studio and SDK installed on host machine).*

---

## 🔒 Security & Privacy Notice
ExamPro enforces strict user isolation via Supabase Row-Level Security policies. It does not provide medical prescriptions, diagnose medical conditions, or claim guaranteed grade improvements.
