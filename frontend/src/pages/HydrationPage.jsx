import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { Droplets, Plus, Trash2, Info, Sparkles } from 'lucide-react';

export const HydrationPage = () => {
  const { data, addWater, deleteWaterLog } = useStudent();
  const today = new Date().toISOString().split('T')[0];

  const [customMl, setCustomMl] = useState('');

  const todayWater = data.waterLogs.filter(w => w.log_date === today);
  const totalWaterMl = todayWater.reduce((acc, w) => acc + (w.amount_ml || 0), 0);
  const goalMl = data.user?.daily_water_goal_ml || 2500;
  const progressPercent = Math.min(Math.round((totalWaterMl / goalMl) * 100), 100);

  const handleAddCustom = (e) => {
    e.preventDefault();
    const ml = Number(customMl);
    if (ml > 0) {
      addWater(ml);
      setCustomMl('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Hydration Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Even 1-2% dehydration decreases short-term memory, attention span, and processing speed during study blocks.
          </p>
        </div>
      </div>

      {/* Non-medical Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/20 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
        <p>
          Hydration targets are personal preference baselines configured by the student, not clinical medical advice or universal minimums.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Progress & Quick Add (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Total Water</span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold border border-sky-500/20">
                Goal: {goalMl} ml
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-sky-400">{totalWaterMl}</span>
              <span className="text-slate-400 text-lg font-medium">ml</span>
            </div>

            <div className="w-full bg-slate-950 h-4 rounded-full mt-4 p-0.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-sky-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              {progressPercent}% of target reached ({Math.max(0, goalMl - totalWaterMl)} ml remaining)
            </p>
          </div>

          {/* Quick Add Buttons */}
          <div className="mt-8 pt-4 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-300 mb-3">Quick Add Hydration</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => addWater(150)}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-sky-500 hover:text-slate-950 text-slate-200 border border-slate-700 font-bold text-xs flex flex-col items-center gap-1 transition-all"
              >
                <Droplets className="w-4 h-4" />
                <span>+150 ml</span>
                <span className="text-[10px] opacity-70">Small Cup</span>
              </button>

              <button
                onClick={() => addWater(250)}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-sky-500 hover:text-slate-950 text-slate-200 border border-slate-700 font-bold text-xs flex flex-col items-center gap-1 transition-all"
              >
                <Droplets className="w-4 h-4" />
                <span>+250 ml</span>
                <span className="text-[10px] opacity-70">Glass</span>
              </button>

              <button
                onClick={() => addWater(500)}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-sky-500 hover:text-slate-950 text-slate-200 border border-slate-700 font-bold text-xs flex flex-col items-center gap-1 transition-all"
              >
                <Droplets className="w-4 h-4" />
                <span>+500 ml</span>
                <span className="text-[10px] opacity-70">Bottle</span>
              </button>
            </div>

            {/* Custom Amount */}
            <form onSubmit={handleAddCustom} className="mt-4 flex gap-2">
              <input
                type="number"
                placeholder="Custom ml (e.g. 350)"
                value={customMl}
                onChange={(e) => setCustomMl(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Today's Intake History (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Today's Intake Log</h3>
            <p className="text-xs text-slate-400 mb-4">Every entry is saved locally and synced with Supabase</p>

            {todayWater.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No water recorded today yet. Log your first cup!</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {todayWater.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-xs">
                        💧
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white">+{log.amount_ml} ml</span>
                        <span className="text-[10px] text-slate-500 block">{log.log_time}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteWaterLog(log.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Remove log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
