import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { UtensilsCrossed, CheckCircle, Clock, Plus, AlertCircle, Info } from 'lucide-react';

export const MealsPage = () => {
  const { data, toggleMeal } = useStudent();
  const today = new Date().toISOString().split('T')[0];

  const mealSlots = [
    { type: 'breakfast', label: 'Breakfast', defaultTime: '08:30 AM', icon: '🍳', target: 'Protein & complex carbs for morning cognition' },
    { type: 'lunch', label: 'Lunch', defaultTime: '01:15 PM', icon: '🥗', target: 'Balanced meal to avoid post-lunch glucose spike' },
    { type: 'snacks', label: 'Evening Snacks', defaultTime: '05:00 PM', icon: '🍎', target: 'Nuts, fruits or light energy boost' },
    { type: 'dinner', label: 'Dinner', defaultTime: '08:30 PM', icon: '🍲', target: 'Light dinner at least 2 hours before bedtime' }
  ];

  const todayMeals = data.meals.filter(m => m.meal_date === today);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Meal Consistency Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">
            Track daily meals to prevent cognitive dips, headaches, and low blood sugar during examination prep.
          </p>
        </div>
      </div>

      {/* Non-medical Disclaimer Alert */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <p>
          ExamPro tracks meal frequency to prevent prolonged starvation and energy crashes. We do not provide clinical calorie counting or medical nutritional advice.
        </p>
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {mealSlots.map((slot) => {
          const loggedMeal = todayMeals.find(m => m.meal_type === slot.type);
          const isDone = Boolean(loggedMeal?.is_completed);

          return (
            <div
              key={slot.type}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-slate-900/80 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{slot.icon}</span>
                    <div>
                      <h3 className="text-base font-bold text-white">{slot.label}</h3>
                      <p className="text-[11px] text-slate-400">Target: around {slot.defaultTime}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleMeal(slot.type, !isDone, loggedMeal?.description || '')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{isDone ? 'Completed' : 'Mark Eaten'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-2">{slot.target}</p>

                {/* Optional description input */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <input
                    type="text"
                    placeholder="Meal description (e.g. Oatmeal & fruit)..."
                    value={loggedMeal?.description || ''}
                    onChange={(e) => toggleMeal(slot.type, isDone, e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meal History / Weekly Consistency */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Weekly Meal Regularity</h3>
        <p className="text-xs text-slate-400 mb-4">Maintaining at least 3 meals daily prevents the brain's reliance on stress hormones (cortisol) for basic energy.</p>
        <div className="flex items-center gap-3">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
            <div key={day} className="flex-1 text-center p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">{day}</span>
              <span className="text-sm font-black text-emerald-400 mt-1 block">
                {idx < 4 ? '4/4' : '3/4'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
