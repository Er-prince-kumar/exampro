import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  Clock, 
  UtensilsCrossed, 
  Droplets, 
  Moon, 
  Bell, 
  Sparkles, 
  BarChart3, 
  Settings, 
  LogOut,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

const navigationLinks = [
  { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Exam Planner', path: '/app/exams', icon: CalendarDays },
  { name: 'Syllabus & Topics', path: '/app/syllabus', icon: BookOpen },
  { name: 'Study & Pomodoro', path: '/app/study', icon: Clock },
  { name: 'Meals', path: '/app/meals', icon: UtensilsCrossed },
  { name: 'Hydration', path: '/app/hydration', icon: Droplets },
  { name: 'Sleep Tracker', path: '/app/sleep', icon: Moon },
  { name: 'AI Study Assistant', path: '/app/ai-assistant', icon: Sparkles, badge: 'Gemini' },
  { name: 'Reminder Center', path: '/app/reminders', icon: Bell },
  { name: 'Analytics', path: '/app/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/app/settings', icon: Settings },
];

export const DesktopSidebar = () => {
  const { data, signOut } = useStudent();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900/90 border-r border-slate-800 backdrop-blur-xl h-screen sticky top-0 p-4 justify-between z-30">
      <div>
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 px-3 py-4 mb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight">ExamPro</h1>
            <p className="text-[10px] text-cyan-400 font-medium tracking-wider uppercase">ExamWeek Without Crash</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navigationLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
            {data.user?.full_name ? data.user.full_name.charAt(0) : 'A'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate">{data.user?.full_name || 'Alex Rivera'}</p>
            <p className="text-[10px] text-slate-400 truncate">{data.user?.college_name || 'Apex Institute'}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export const MobileBottomNav = () => {
  const quickLinks = [
    { name: 'Home', path: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Exams', path: '/app/exams', icon: CalendarDays },
    { name: 'Study', path: '/app/study', icon: Clock },
    { name: 'AI', path: '/app/ai-assistant', icon: Sparkles },
    { name: 'Reminders', path: '/app/reminders', icon: Bell },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 z-50 flex justify-around items-center">
      {quickLinks.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs transition-colors ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

