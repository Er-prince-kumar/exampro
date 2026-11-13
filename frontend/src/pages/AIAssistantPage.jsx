import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { calculateWellness } from '../utils/wellnessCalculator';
import { Sparkles, Send, Bot, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

export const AIAssistantPage = () => {
  const { data } = useStudent();
  const wellness = calculateWellness(data);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleAskAI = async (customPrompt = '') => {
    setLoading(true);
    const userPrompt = customPrompt || query || 'Analyze my current exam schedule and wellness data, and generate my daily game plan.';

    try {
      const res = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
          'x-mock-user-id': data.user?.id || 'demo-user'
        },
        body: JSON.stringify({
          studentName: data.user?.full_name || 'Student',
          wellnessScore: wellness.total,
          todayStudyMinutes: wellness.todayStudyMinutes,
          studyGoalMinutes: wellness.studyGoal,
          waterMl: wellness.totalWaterMl,
          waterGoalMl: wellness.waterGoal,
          sleepHours: wellness.sleepHours,
          mealsLogged: data.meals.filter(m => m.is_completed).map(m => m.meal_type),
          upcomingExams: data.exams.map(e => ({
            subject: e.subject_name,
            exam_type: e.exam_type,
            exam_date: e.exam_date,
            days_remaining: Math.max(0, Math.ceil((new Date(e.exam_date) - new Date()) / (1000 * 60 * 60 * 24)))
          })),
          userQuery: userPrompt
        })
      });

      const result = await res.json();
      setResponse(result);
    } catch (err) {
      console.error('AI Error:', err);
      setResponse({
        advice: 'Unable to reach backend AI service right now. Please ensure the backend is running at http://localhost:5000.',
        source: 'error-handler'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">AI Wellness & Study Assistant</h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold">
              Powered by Google Gemini
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Context-aware academic planning that respects biological limits to eliminate exam burnout.
          </p>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>Strict Safety Guardrails: No medical prescriptions, no all-nighter encouragement, zero exam guarantees.</span>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => handleAskAI('Generate my personalized daily study & rest breakdown for today.')}
          className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap"
        >
          🎯 Generate Daily Strategy
        </button>
        <button
          onClick={() => handleAskAI('I feel exhausted and cannot concentrate. What is my optimal recovery protocol?')}
          className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap"
        >
          ☕ Burnout Recovery Protocol
        </button>
        <button
          onClick={() => handleAskAI('How should I prioritize my hardest syllabus topics with only 3 days left?')}
          className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 whitespace-nowrap"
        >
          ⚡ High-Yield Topic Prioritization
        </button>
      </div>

      {/* AI Conversation & Response Window */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 min-h-[350px] flex flex-col justify-between shadow-2xl">
        {response ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  AI Guidance ({response.source})
                </span>
              </div>
              <button
                onClick={() => handleAskAI()}
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            </div>

            <div className="prose prose-invert max-w-none text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {response.advice}
            </div>

            {response.notice && (
              <p className="text-[11px] text-amber-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                Notice: {response.notice}
              </p>
            )}
          </div>
        ) : (
          <div className="my-auto text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Your AI Study Co-Pilot Is Ready</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Ask any question about your exam schedule, topic distribution, or fatigue management.
            </p>
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAI(query);
          }}
          className="mt-6 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Gemini AI for realistic study & recovery advice..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Thinking...' : 'Ask AI'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
