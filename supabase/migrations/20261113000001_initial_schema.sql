-- ==============================================================================
-- ExamWeekWithoutTheCrash - Core Database Schema & Migrations
-- Target: Supabase PostgreSQL with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    timezone TEXT DEFAULT 'UTC',
    college_name TEXT DEFAULT '',
    semester TEXT DEFAULT '',
    branch TEXT DEFAULT '',
    daily_study_goal_minutes INTEGER DEFAULT 240, -- 4 hours default
    daily_water_goal_ml INTEGER DEFAULT 2500,     -- 2.5 Liters default
    daily_sleep_goal_hours NUMERIC(4, 2) DEFAULT 7.5,
    meal_reminder_enabled BOOLEAN DEFAULT true,
    water_reminder_enabled BOOLEAN DEFAULT true,
    sleep_reminder_enabled BOOLEAN DEFAULT true,
    exam_reminder_enabled BOOLEAN DEFAULT true,
    break_reminder_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT DEFAULT '',
    color TEXT DEFAULT '#0284c7', -- soft cyan / blue default
    credits INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SYLLABUS TOPICS
CREATE TABLE IF NOT EXISTS public.syllabus_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    chapter_name TEXT NOT NULL,
    topic_name TEXT NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
    revision_count INTEGER DEFAULT 0,
    estimated_minutes INTEGER DEFAULT 45,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXAMS
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    subject_name TEXT NOT NULL,
    exam_type TEXT CHECK (exam_type IN ('MTT', 'ETT', 'QUIZ', 'PRACTICAL', 'ASSIGNMENT')) DEFAULT 'MTT',
    exam_date DATE NOT NULL,
    exam_time TIME NOT NULL,
    room_number TEXT DEFAULT '',
    total_marks INTEGER DEFAULT 100,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'high',
    notes TEXT DEFAULT '',
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. STUDY TASKS
CREATE TABLE IF NOT EXISTS public.study_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.syllabus_topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    estimated_minutes INTEGER DEFAULT 60,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    due_date DATE DEFAULT CURRENT_DATE,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')) DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDY SESSIONS (Pomodoro & duration tracker)
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.study_tasks(id) ON DELETE SET NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    duration_minutes INTEGER NOT NULL,
    session_type TEXT CHECK (session_type IN ('pomodoro', 'freeform', 'revision')) DEFAULT 'pomodoro',
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MEALS
CREATE TABLE IF NOT EXISTS public.meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'snacks', 'dinner')) NOT NULL,
    meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_time TIME DEFAULT CURRENT_TIME,
    is_completed BOOLEAN DEFAULT true,
    description TEXT DEFAULT '',
    energy_rating INTEGER CHECK (energy_rating BETWEEN 1 AND 5) DEFAULT 3,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_meal_per_day UNIQUE(user_id, meal_date, meal_type)
);

-- 8. WATER LOGS
CREATE TABLE IF NOT EXISTS public.water_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount_ml INTEGER NOT NULL CHECK (amount_ml > 0),
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    log_time TIME DEFAULT CURRENT_TIME,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SLEEP LOGS
CREATE TABLE IF NOT EXISTS public.sleep_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sleep_date DATE NOT NULL DEFAULT CURRENT_DATE,
    bedtime TIMESTAMPTZ NOT NULL,
    wake_time TIMESTAMPTZ NOT NULL,
    duration_hours NUMERIC(4, 2) NOT NULL,
    quality_rating INTEGER CHECK (quality_rating BETWEEN 1 AND 5) DEFAULT 3,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_sleep_per_day UNIQUE(user_id, sleep_date)
);

-- 10. REMINDERS
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    reminder_type TEXT CHECK (reminder_type IN ('study', 'meal', 'water', 'sleep', 'break', 'exam', 'custom')) NOT NULL,
    remind_time TIME NOT NULL,
    days_of_week INTEGER[] DEFAULT '{1,2,3,4,5,6,7}', -- 1=Monday ... 7=Sunday
    is_active BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. DAILY WELLNESS SCORES
CREATE TABLE IF NOT EXISTS public.daily_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score_date DATE NOT NULL DEFAULT CURRENT_DATE,
    study_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
    meal_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
    water_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
    sleep_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
    total_wellness_score NUMERIC(5, 2) NOT NULL DEFAULT 0,
    explanation_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_score_per_day UNIQUE(user_id, score_date)
);

-- 12. NOTIFICATION PREFERENCES
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    browser_push_enabled BOOLEAN DEFAULT false,
    in_app_sound_enabled BOOLEAN DEFAULT true,
    quiet_hours_start TIME DEFAULT '23:00',
    quiet_hours_end TIME DEFAULT '06:00',
    study_interval_minutes INTEGER DEFAULT 60,
    water_interval_hours INTEGER DEFAULT 2,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_subjects_user ON public.subjects(user_id);
CREATE INDEX IF NOT EXISTS idx_syllabus_user_sub ON public.syllabus_topics(user_id, subject_id);
CREATE INDEX IF NOT EXISTS idx_exams_user_date ON public.exams(user_id, exam_date);
CREATE INDEX IF NOT EXISTS idx_study_tasks_user_status ON public.study_tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON public.study_sessions(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON public.meals(user_id, meal_date);
CREATE INDEX IF NOT EXISTS idx_water_user_date ON public.water_logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_sleep_user_date ON public.sleep_logs(user_id, sleep_date);
CREATE INDEX IF NOT EXISTS idx_reminders_user ON public.reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_scores_user_date ON public.daily_scores(user_id, score_date);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Helper to set policy for user isolation
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'subjects', 'syllabus_topics', 'exams', 'study_tasks', 
            'study_sessions', 'meals', 'water_logs', 'sleep_logs', 
            'reminders', 'daily_scores', 'notification_preferences'
        )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I_user_isolation_policy ON %I', tbl, tbl);
        EXECUTE format('
            CREATE POLICY %I_user_isolation_policy ON %I
            FOR ALL
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id)
        ', tbl, tbl);
    END LOOP;
END $$;

-- Profiles policy
DROP POLICY IF EXISTS profiles_user_policy ON public.profiles;
CREATE POLICY profiles_user_policy ON public.profiles
FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Auto create profile on auth signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.notification_preferences (user_id)
  VALUES (new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

