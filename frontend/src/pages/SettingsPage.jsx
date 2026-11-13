import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { User, Settings, Bell, Clock, Droplets, Moon, Trash2, CheckCircle, ShieldAlert } from 'lucide-react';

export const SettingsPage = () => {
  const { data, updateProfile } = useStudent();
  const [profileForm, setProfileForm] = useState({
    full_name: data.user?.full_name || '',
    college_name: data.user?.college_name || '',
    branch: data.user?.branch || '',
    semester: data.user?.semester || '',
    daily_study_goal_minutes: data.user?.daily_study_goal_minutes || 240,
    daily_water_goal_ml: data.user?.daily_water_goal_ml || 2500,
    daily_sleep_goal_hours: data.user?.daily_sleep_goal_hours || 7.5
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearAllData = () => {
    localStorage.removeItem('exampro_student_state_v1');
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white tracking-tight">Profile & Preferences</h1>
        <p className="text-xs text-slate-400 mt-1">
          Customize your study targets, personal hydration goals, and college profile.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Student Profile Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" />
            <span>Student Academic Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.full_name}
                onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">College / University</label>
              <input
                type="text"
                value={profileForm.college_name}
                onChange={(e) => setProfileForm({ ...profileForm, college_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Branch / Degree</label>
              <input
                type="text"
                value={profileForm.branch}
                onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Semester</label>
              <input
                type="text"
                value={profileForm.semester}
                onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Goals Configuration Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>Daily Health & Study Target Baselines</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Daily Study Goal (Mins)</span>
              </label>
              <input
                type="number"
                value={profileForm.daily_study_goal_minutes}
                onChange={(e) => setProfileForm({ ...profileForm, daily_study_goal_minutes: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                <span>Water Goal (ml)</span>
              </label>
              <input
                type="number"
                value={profileForm.daily_water_goal_ml}
                onChange={(e) => setProfileForm({ ...profileForm, daily_water_goal_ml: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Sleep Target (Hours)</span>
              </label>
              <input
                type="number"
                step="0.5"
                value={profileForm.daily_sleep_goal_hours}
                onChange={(e) => setProfileForm({ ...profileForm, daily_sleep_goal_hours: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>{savedSuccess ? 'Changes Saved!' : 'Save Preferences'}</span>
        </button>
      </form>

      {/* Danger Zone: Account / Data Reset */}
      <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
        <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Reset Student Storage Data</span>
        </h3>
        <p className="text-xs text-slate-400">
          Clear all locally saved examination schedules, tasks, and wellness history. This action cannot be reversed.
        </p>

        {confirmDelete ? (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleClearAllData}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg"
            >
              Confirm Full Reset
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold text-xs rounded-lg"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-4 py-2 border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 font-bold text-xs rounded-lg transition-colors"
          >
            Reset All Records
          </button>
        )}
      </div>
    </div>
  );
};
