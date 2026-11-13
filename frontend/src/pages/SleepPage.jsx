import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { Moon, Sunrise, Clock, Info, CheckCircle, Plus } from 'lucide-react';

export const SleepPage = () => {
  const { data, logSleep } = useStudent();
  const today = new Date().toISOString().split('T')[0];

  const [bedtimeStr, setBedtimeStr] = useState('23:00');
  const [wakeStr, setWakeStr] = useState('06:30');
  const [quality, setQuality] = useState(4);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compute duration automatically with overnight support
  const calculateSleepDuration = (bed, wake) => {
    const [bH, bM] = bed.split(':').map(Number);
    const [wH, wM] = wake.split(':').map(Number);
    let bedMinutes = bH * 60 + bM;
    let wakeMinutes = wH * 60 + wM;
    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60; // crossed midnight
    }
    const diffHours = (wakeMinutes - bedMinutes) / 60;
    return Number(diffHours.toFixed(1));
  };

  const computedHours = calculateSleepDuration(bedtimeStr, wakeStr);
  const userGoal = data.user?.daily_sleep_goal_hours || 7.5;

  const handleSaveSleep = (e) => {
    e.preventDefault();
    const duration = calculateSleepDuration(bedtimeStr, wakeStr);
    const bedISO = new Date(`${today}T${bedtimeStr}:00`).toISOString();
    const wakeISO = new Date(`${today}T${wakeStr}:00`).toISOString();

    logSleep(today, bedISO, wakeISO, duration, quality, notes);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Sleep & Cognitive Recovery Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Memory consolidation occurs predominantly during slow-wave and REM sleep. Sacrificing sleep reduces test day recall.
          </p>
        </div>
      </div>

      {/* Non-medical Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/20 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p>
          ExamPro tracks subjective rest duration and routine consistency. We do not provide clinical polysomnography or sleep disorder diagnoses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Log Sleep Session (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
          <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Record Last Night's Sleep</span>
          </h2>

          <form onSubmit={handleSaveSleep} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Bedtime</span>
                </label>
                <input
                  type="time"
                  required
                  value={bedtimeStr}
                  onChange={(e) => setBedtimeStr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                  <span>Wake-Up Time</span>
                </label>
                <input
                  type="time"
                  required
                  value={wakeStr}
                  onChange={(e) => setWakeStr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Calculated Preview Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Computed Sleep Duration</span>
                <span className="text-2xl font-black text-indigo-400">{computedHours} hrs</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Personal Target</span>
                <span className="text-xs font-bold text-slate-200">{userGoal} hrs / night</span>
              </div>
            </div>

            {/* Rest Quality Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subjective Rest Quality (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setQuality(stars)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                      quality === stars
                        ? 'bg-indigo-500 text-white border-indigo-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {stars} ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Woke up refreshed, no caffeine after 6pm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{savedSuccess ? 'Saved to Your Records!' : 'Save Sleep Entry'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Sleep Consistency & Cognitive Impact (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-2">Why Sleep Protects Examination Grades</h3>
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <strong className="text-slate-200 block mb-0.5">🧠 Synaptic Consolidation</strong>
                During deep sleep, the brain transfers newly learned facts from fragile short-term storage in the hippocampus to durable neocortex long-term memory.
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <strong className="text-slate-200 block mb-0.5">⚡ Stress Response Regulation</strong>
                Sleeping 7+ hours maintains emotional stability, directly preventing panic freezes and blank-outs when encountering unfamiliar questions on the MTT paper.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
