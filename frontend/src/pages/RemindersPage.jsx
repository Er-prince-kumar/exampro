import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { Bell, Plus, Trash2, CheckCircle, AlertCircle, Info, Volume2 } from 'lucide-react';

export const RemindersPage = () => {
  const { data, addReminder, toggleReminder, deleteReminder } = useStudent();
  const [showModal, setShowModal] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const [form, setForm] = useState({
    title: '',
    reminder_type: 'water',
    remind_time: '14:00'
  });

  const requestNotificationPermission = async () => {
    if (typeof Notification !== 'undefined') {
      const status = await Notification.requestPermission();
      setPermissionStatus(status);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title) return;
    addReminder({
      ...form,
      is_active: true
    });
    setShowModal(false);
    setForm({ title: '', reminder_type: 'water', remind_time: '14:00' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Reminder Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure timely in-app audio chimes and browser notifications for meals, water, and study transitions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Reminder</span>
        </button>
      </div>

      {/* Browser Background Limitation Honest Notice */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <strong className="text-white block mb-0.5">Browser Background Notification Policy</strong>
            Web browsers require user permission to display desktop alerts and may throttle background timers when the tab is sleeping or minimized. For optimal delivery, keep ExamPro open or installed on Android as a PWA.
          </div>
        </div>

        {permissionStatus !== 'granted' && (
          <button
            onClick={requestNotificationPermission}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap"
          >
            Enable Notifications
          </button>
        )}
      </div>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.reminders.map((rem) => (
          <div
            key={rem.id}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
              rem.is_active
                ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/30'
                : 'bg-slate-950/40 border-slate-900 opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleReminder(rem.id)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  rem.is_active ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Bell className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-sm font-bold text-white">{rem.title}</h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                  <span className="text-cyan-400 font-semibold">{rem.remind_time}</span>
                  <span className="capitalize">• {rem.reminder_type}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleReminder(rem.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${
                  rem.is_active
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {rem.is_active ? 'Active' : 'Off'}
              </button>

              <button
                onClick={() => deleteReminder(rem.id)}
                className="text-slate-500 hover:text-rose-400 p-1.5"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Add Habit Reminder</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reminder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drink 250ml water"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={form.reminder_type}
                  onChange={(e) => setForm({ ...form, reminder_type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="water">Hydration (Water)</option>
                  <option value="meal">Meal / Nutrition</option>
                  <option value="study">Study Sprint</option>
                  <option value="break">Screen Break</option>
                  <option value="sleep">Bedtime Wind-Down</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={form.remind_time}
                  onChange={(e) => setForm({ ...form, remind_time: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
