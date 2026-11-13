import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Droplets, 
  UtensilsCrossed, 
  Moon, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Flame
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { calculateWellness } from '../utils/wellnessCalculator';

export const DashboardPage = () => {
  const { data } = useStudent();
  const wellness = calculateWellness(data);

  // Compute countdown to nearest upcoming exam
  const sortedExams = [...data.exams].sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));
  const upcomingExam = sortedExams.find(e => !e.is_completed && new Date(e.exam_date) >= new Date().setHours(0,0,0,0)) || sortedExams[0];
  
  let daysUntilExam = 0;
  if (upcomingExam) {
    const diff = new Date(upcomingExam.exam_date).getTime() - new Date().setHours(0,0,0,0);
    daysUntilExam = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Top Greeting & Date Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Hello, {data.user?.full_name?.split(' ')[0] || 'Student'} 👋
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
              {data.user?.branch || 'Active Student'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {currentDateFormatted} • Stay balanced, do not burn out.
          </p>
        </div>

        <Link
          to="/app/ai-assistant"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Ask Gemini Study Assistant</span>
        </Link>
      </div>

      {/* Main Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Daily Wellness Score Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Wellness Score</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">30:25:20:25 Weighted</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black text-white">{wellness.total}</span>
              <span className="text-slate-400 text-sm">/ 100</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {wellness.total >= 80 
                ? '🔥 Excellent endurance balance! Keep this rhythm.' 
                : wellness.total >= 60 
                ? '⚖️ Moderate balance. Check hydration & sleep tonight.' 
                : '⚠️ Burnout alert! Ensure you eat and sleep on time.'}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-4 mt-4 border-t border-slate-800/80 text-center">
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Study</p>
              <p className="text-xs font-bold text-cyan-400">{wellness.studyScore}%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Meals</p>
              <p className="text-xs font-bold text-emerald-400">{wellness.mealScore}%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Water</p>
              <p className="text-xs font-bold text-sky-400">{wellness.waterScore}%</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase">Sleep</p>
              <p className="text-xs font-bold text-indigo-400">{wellness.sleepScore}%</p>
            </div>
          </div>
        </div>

        {/* Next Exam Countdown Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Examination</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                {upcomingExam?.exam_type || 'MTT'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1 truncate">
              {upcomingExam ? upcomingExam.subject_name : 'No exams logged'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {upcomingExam ? `Date: ${upcomingExam.exam_date} at ${upcomingExam.exam_time}` : 'All caught up!'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-3xl font-extrabold text-blue-400">{daysUntilExam}</span>
              <span className="text-xs text-slate-400 ml-1.5 font-medium">days remaining</span>
            </div>
            <Link
              to="/app/exams"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Study Time & Pomodoro Quick Launch */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Study Duration Today</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-5xl font-black text-cyan-400">
                {(wellness.todayStudyMinutes / 60).toFixed(1)}
              </span>
              <span className="text-slate-400 text-sm">/ {(wellness.studyGoal / 60).toFixed(1)} hrs</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min((wellness.todayStudyMinutes / wellness.studyGoal) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {wellness.completedTasksCount} of {wellness.totalTasksCount} tasks done
            </span>
            <Link
              to="/app/study"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30 transition-colors"
            >
              Open Pomodoro
            </Link>
          </div>
        </div>
      </div>

      {/* Wellness Habit Trackers Quick Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Meals Summary */}
        <Link 
          to="/app/meals" 
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">Meals Today</p>
              <p className="text-sm font-bold text-white">{wellness.todayMealsCount} of 4 recorded</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </Link>

        {/* Water Intake */}
        <Link 
          to="/app/hydration" 
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/40 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">Hydration</p>
              <p className="text-sm font-bold text-white">{wellness.totalWaterMl} / {wellness.waterGoal} ml</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </Link>

        {/* Sleep Record */}
        <Link 
          to="/app/sleep" 
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">Sleep Duration</p>
              <p className="text-sm font-bold text-white">{wellness.sleepHours} hrs logged</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </Link>
      </div>

      {/* Pending Tasks & AI Quick Suggestion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Study Tasks */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Priority Study Tasks for Today</span>
            </h3>
            <Link to="/app/study" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
              Manage Tasks
            </Link>
          </div>

          <div className="space-y-2.5">
            {data.studyTasks.slice(0, 4).map(task => (
              <div 
                key={task.id}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    task.status === 'completed' ? 'bg-emerald-400' : task.priority === 'urgent' ? 'bg-rose-500' : 'bg-cyan-400'
                  }`} />
                  <span className={`text-xs text-slate-200 truncate ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 flex-shrink-0 font-medium">
                  {task.estimated_minutes} min
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestion Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/20 border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">AI Daily Wellness Suggestion</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your upcoming <strong>{upcomingExam?.subject_name}</strong> exam in {daysUntilExam} days and your current hydration levels:
            </p>
            <div className="mt-3 p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-xs text-slate-200 leading-relaxed">
              "Focus 2 Pomodoro blocks (50m each) on high-difficulty questions. Take a mandatory 15-minute screen break with 250ml water at 16:30. Protect your 7.5-hour sleep window tonight to allow your hippocampus to consolidate memory."
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Non-medical study strategy</span>
            <Link
              to="/app/ai-assistant"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Full AI Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

