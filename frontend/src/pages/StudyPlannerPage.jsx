import React, { useState, useEffect } from 'react';
import { useStudent } from '../context/StudentContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Plus, 
  Clock, 
  Calendar, 
  AlertCircle,
  Coffee,
  Sparkles,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const StudyPlannerPage = () => {
  const { data, addStudyTask, updateStudyTask, deleteStudyTask, logStudySession } = useStudent();
  
  // Pomodoro Timer States
  const [timerMode, setTimerMode] = useState('work'); // 'work' (25 or 50m) or 'break' (5 or 10m)
  const [selectedDuration, setSelectedDuration] = useState(25); // minutes
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSessionNotes, setActiveSessionNotes] = useState('');

  // Task creation state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    subject_id: data.subjects[0]?.id || '',
    estimated_minutes: 50,
    priority: 'medium',
    due_date: new Date().toISOString().split('T')[0]
  });

  // Pomodoro countdown effect
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0 && isRunning) {
      setIsRunning(false);
      // Sound or confetti on session complete
      confetti({ particleCount: 70, spread: 60 });
      if (timerMode === 'work') {
        logStudySession(selectedDuration, activeSessionNotes || 'Pomodoro focus session completed');
        setTimerMode('break');
        setSelectedDuration(5);
        setTimeLeftSeconds(5 * 60);
      } else {
        setTimerMode('work');
        setSelectedDuration(25);
        setTimeLeftSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeftSeconds, timerMode, selectedDuration, activeSessionNotes, logStudySession]);

  const setTimerPreset = (mins, mode = 'work') => {
    setIsRunning(false);
    setTimerMode(mode);
    setSelectedDuration(mins);
    setTimeLeftSeconds(mins * 60);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    addStudyTask(newTask);
    setShowTaskModal(false);
    setNewTask({
      title: '',
      subject_id: data.subjects[0]?.id || '',
      estimated_minutes: 50,
      priority: 'medium',
      due_date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Smart Study Planner & Pomodoro</h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain deliberate, focused study sprints with timed biological recovery breaks.
          </p>
        </div>

        <button
          onClick={() => setShowTaskModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Study Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Pomodoro Engine (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              timerMode === 'work' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              {timerMode === 'work' ? '⚡ Focus Sprint' : '☕ Recovery Break'}
            </span>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setTimerPreset(25, 'work')}
              className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-colors ${
                selectedDuration === 25 && timerMode === 'work'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              25m Focus
            </button>
            <button
              onClick={() => setTimerPreset(50, 'work')}
              className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-colors ${
                selectedDuration === 50 && timerMode === 'work'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              50m Deep Block
            </button>
            <button
              onClick={() => setTimerPreset(5, 'break')}
              className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-colors ${
                selectedDuration === 5 && timerMode === 'break'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              5m Break
            </button>
            <button
              onClick={() => setTimerPreset(15, 'break')}
              className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-colors ${
                selectedDuration === 15 && timerMode === 'break'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              15m Rest
            </button>
          </div>

          {/* Giant Timer Display */}
          <div className="relative my-4 flex items-center justify-center">
            <div className={`w-52 h-52 rounded-full border-4 ${
              timerMode === 'work' ? 'border-cyan-500/30' : 'border-emerald-500/30'
            } flex items-center justify-center shadow-inner`}>
              <span className="text-5xl font-black tracking-tight text-white font-mono">
                {formatTime(timeLeftSeconds)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-8 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 transition-transform transform active:scale-95 ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
            </button>

            <button
              onClick={() => setTimerPreset(selectedDuration, timerMode)}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Optional notes on completed block */}
          <div className="w-full mt-6 text-left">
            <input
              type="text"
              placeholder="Session notes (e.g. Practiced Dynamic Programming)..."
              value={activeSessionNotes}
              onChange={(e) => setActiveSessionNotes(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Right Column: Study Tasks & Daily Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Today's Scheduled Tasks</h3>
                <p className="text-xs text-slate-400">Mark complete as you finish Pomodoro chunks</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-400 font-bold">
                {data.studyTasks.filter(t => t.status === 'completed').length} / {data.studyTasks.length} Done
              </span>
            </div>

            <div className="space-y-3">
              {data.studyTasks.map((task) => {
                const subject = data.subjects.find(s => s.id === task.subject_id);
                const isDone = task.status === 'completed';

                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isDone
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <button
                        onClick={() => updateStudyTask(task.id, { status: isDone ? 'pending' : 'completed' })}
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-600 hover:border-cyan-400'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="truncate">
                        <p className={`text-xs font-semibold truncate ${isDone ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                          {subject && <span className="text-cyan-400">{subject.name}</span>}
                          <span>• {task.estimated_minutes} mins</span>
                          <span className={`capitalize font-bold ${
                            task.priority === 'urgent' ? 'text-rose-400' : 'text-slate-400'
                          }`}>
                            • {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteStudyTask(task.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Past Sessions History */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Focus Sessions</h3>
            <div className="space-y-2">
              {data.studySessions.slice(0, 3).map((sess) => (
                <div key={sess.id} className="flex items-center justify-between text-xs text-slate-300 py-1.5 border-b border-slate-800/60 last:border-0">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{sess.notes || 'Pomodoro Sprint'}</span>
                  </div>
                  <span className="font-bold text-white">{sess.duration_minutes} mins</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Add Study Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve 5 Previous Year Questions"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={newTask.subject_id}
                    onChange={(e) => setNewTask({ ...newTask, subject_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    {data.subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Est. Duration (Mins)</label>
                  <input
                    type="number"
                    value={newTask.estimated_minutes}
                    onChange={(e) => setNewTask({ ...newTask, estimated_minutes: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

