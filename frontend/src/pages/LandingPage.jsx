import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  ShieldCheck, 
  Zap, 
  Brain, 
  Droplets, 
  Moon, 
  Utensils, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Calendar,
  AlertTriangle
} from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                ExamPro
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 border-l border-slate-700 pl-2">
                ExamWeekWithoutTheCrash
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/auth" 
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/auth?mode=signup" 
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Built Specifically for MTT & ETT College Exam Sprints</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
            Study Smart. Stay Healthy. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Perform Better.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            During exam pressure, sleep, hydration, and nutrition collapse—degrading the exact cognitive performance you sacrificed them for. ExamPro balances high-yield revision with non-negotiable wellness habits.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/app/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Launch Live Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/auth?mode=signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold flex items-center justify-center transition-colors"
            >
              Create Free Account
            </Link>
          </div>

          {/* Value Highlights */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-cyan-400 font-bold text-lg mb-1">0%</div>
              <div className="text-xs text-slate-400">Exam-week burnout with spaced Pomodoro breaks</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-blue-400 font-bold text-lg mb-1">30:25:20:25</div>
              <div className="text-xs text-slate-400">Explainable scientific wellness scoring engine</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-indigo-400 font-bold text-lg mb-1">Gemini AI</div>
              <div className="text-xs text-slate-400">Contextual daily study planning & safety boundaries</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="text-emerald-400 font-bold text-lg mb-1">PWA + APK</div>
              <div className="text-xs text-slate-400">Installable on Android, offline local persistence</div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Breakdown */}
      <section className="py-16 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">The Exam Week Dilemma</h2>
            <p className="mt-2 text-3xl font-bold text-white tracking-tight">Why Traditional Cramming Backfires</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-rose-500/20 relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <Moon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Sleep Deprivation</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Cutting sleep to 3 hours reduces prefrontal working memory by up to 40%. You spend hours studying but cannot retrieve formulas during the MTT exam.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/20 relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Skipped Meals</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Surviving solely on high-caffeine energy drinks triggers acute hypoglycemia spikes, brain fog, and severe afternoon energy crashes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-500/20 relative overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Unstructured Panic</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Attempting to review all 5 syllabus modules simultaneously without priority filters causes overwhelm, anxiety, and decision paralysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Built for High Performance</h2>
          <p className="mt-2 text-3xl font-bold text-white tracking-tight">Everything You Need for Exam Week</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <Calendar className="w-8 h-8 text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">MTT & ETT Exam Planner</h3>
            <p className="text-sm text-slate-400">
              Live countdown timers, syllabus weightings, priority flags, and classroom schedules all organized chronologically.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <Clock className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Pomodoro Study Engine</h3>
            <p className="text-sm text-slate-400">
              Configurable 25/50 minute focus blocks with mandatory restorative breaks so your brain actively consolidates concepts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <Sparkles className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">AI Wellness Guidance</h3>
            <p className="text-sm text-slate-400">
              Powered by Google Gemini to analyze your exact syllabus gap and wellness data, generating realistic daily study strategies.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <Droplets className="w-8 h-8 text-sky-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Hydration & Meal Logs</h3>
            <p className="text-sm text-slate-400">
              Quick one-tap logging for water and meals. No complex diet calorie counting—strictly focused on sustained physical energy.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Daily Wellness Score</h3>
            <p className="text-sm text-slate-400">
              Scientific 0-100 metric calculated from Study (30%), Meals (25%), Water (20%), and Sleep (25%) with honest zero-shame missing data handling.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-colors">
            <Zap className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Browser Reminders & Offline</h3>
            <p className="text-sm text-slate-400">
              Web notification alerts for study blocks and meals. Seamless PWA installable on your Android phone with zero lag.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-900/30 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <h3 className="font-semibold text-white mb-1">Does this app give medical or nutrition prescriptions?</h3>
              <p className="text-sm text-slate-400">
                No. ExamPro is an evidence-backed motivational habit tracker designed to help college students avoid extreme exhaustion. It provides no clinical diagnosis or prescription claims.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <h3 className="font-semibold text-white mb-1">Can I use this without a paid Supabase account?</h3>
              <p className="text-sm text-slate-400">
                Yes! The application runs with a smart local storage sync engine right out of the box, preserving all your exams, study tasks, and health logs. Supabase can be connected at any time by configuring environment variables.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <h3 className="font-semibold text-white mb-1">How do I install ExamPro on my Android phone?</h3>
              <p className="text-sm text-slate-400">
                You can install it directly in Google Chrome via "Add to Home screen" (Progressive Web App), or build an APK using the included Capacitor Android configuration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p>© 2026 ExamWeekWithoutTheCrash (ExamPro). Study Smart. Stay Healthy. Perform Better.</p>
        <p className="mt-2 text-slate-600">Built for college students everywhere.</p>
      </footer>
    </div>
  );
};

