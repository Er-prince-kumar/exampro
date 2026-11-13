import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StudentProvider } from './context/StudentContext';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExamPlannerPage } from './pages/ExamPlannerPage';
import { SyllabusPage } from './pages/SyllabusPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { MealsPage } from './pages/MealsPage';
import { HydrationPage } from './pages/HydrationPage';
import { SleepPage } from './pages/SleepPage';
import { RemindersPage } from './pages/RemindersPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <StudentProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Student App Portal */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="exams" element={<ExamPlannerPage />} />
            <Route path="syllabus" element={<SyllabusPage />} />
            <Route path="study" element={<StudyPlannerPage />} />
            <Route path="meals" element={<MealsPage />} />
            <Route path="hydration" element={<HydrationPage />} />
            <Route path="sleep" element={<SleepPage />} />
            <Route path="reminders" element={<RemindersPage />} />
            <Route path="ai-assistant" element={<AIAssistantPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StudentProvider>
  );
}

export default App;
