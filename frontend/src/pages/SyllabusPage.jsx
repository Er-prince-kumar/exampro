import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { BookOpen, Plus, CheckCircle, Clock, AlertTriangle, Layers, BarChart2 } from 'lucide-react';

export const SyllabusPage = () => {
  const { data, addSubject, addTopic, updateTopic } = useStudent();
  const [selectedSubjectId, setSelectedSubjectId] = useState(data.subjects[0]?.id || '');
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);

  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', credits: 4, color: '#0ea5e9' });
  const [topicForm, setTopicForm] = useState({
    chapter_name: '',
    topic_name: '',
    difficulty: 'medium',
    status: 'not_started',
    estimated_minutes: 45
  });

  const activeSubject = data.subjects.find(s => s.id === selectedSubjectId) || data.subjects[0];
  const subjectTopics = data.topics.filter(t => t.subject_id === activeSubject?.id);

  const completedCount = subjectTopics.filter(t => t.status === 'completed').length;
  const progressPercent = subjectTopics.length > 0 ? Math.round((completedCount / subjectTopics.length) * 100) : 0;

  const handleCreateSubject = (e) => {
    e.preventDefault();
    if (!subjectForm.name) return;
    addSubject(subjectForm);
    setShowSubjectModal(false);
    setSubjectForm({ name: '', code: '', credits: 4, color: '#0ea5e9' });
  };

  const handleCreateTopic = (e) => {
    e.preventDefault();
    if (!topicForm.topic_name || !activeSubject) return;
    addTopic({
      ...topicForm,
      subject_id: activeSubject.id
    });
    setShowTopicModal(false);
    setTopicForm({
      chapter_name: '',
      topic_name: '',
      difficulty: 'medium',
      status: 'not_started',
      estimated_minutes: 45
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Subject & Syllabus Manager</h1>
          <p className="text-xs text-slate-400 mt-1">
            Break down course syllabi into bite-sized chapters, rate topic difficulty, and track revision status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSubjectModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>New Subject</span>
          </button>
          <button
            onClick={() => setShowTopicModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Topic</span>
          </button>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {data.subjects.map((subj) => (
          <button
            key={subj.id}
            onClick={() => setSelectedSubjectId(subj.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeSubject?.id === subj.id
                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <span>{subj.name}</span>
            {subj.code && <span className="ml-1.5 opacity-60">({subj.code})</span>}
          </button>
        ))}
      </div>

      {/* Active Subject Overview Card */}
      {activeSubject && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeSubject.color || '#0ea5e9' }} />
              <h2 className="text-lg font-bold text-white">{activeSubject.name}</h2>
              {activeSubject.code && (
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {activeSubject.code}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {subjectTopics.length} total topics logged • {completedCount} fully revised
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-2xl font-black text-cyan-400">{progressPercent}%</span>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Syllabus Covered</p>
            </div>
            <div className="w-36 bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Topics List Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Modules & Topic Breakdown</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Click status or revision count to update</span>
        </div>

        {subjectTopics.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No topics added yet for this subject. Click "Add Topic" above to begin structuring your syllabus!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {subjectTopics.map((topic) => (
              <div
                key={topic.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors"
              >
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-0.5">
                    {topic.chapter_name || 'General Chapter'}
                  </span>
                  <h4 className="text-sm font-semibold text-white">{topic.topic_name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span className={`capitalize font-medium ${
                      topic.difficulty === 'hard' ? 'text-rose-400' : topic.difficulty === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      • {topic.difficulty} Difficulty
                    </span>
                    <span>• {topic.estimated_minutes || 45} mins</span>
                    <button
                      onClick={() => updateTopic(topic.id, { revision_count: (topic.revision_count || 0) + 1 })}
                      className="hover:text-cyan-300 underline"
                    >
                      • Revised: {topic.revision_count || 0} times
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={topic.status}
                    onChange={(e) => updateTopic(topic.id, { status: e.target.value })}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none ${
                      topic.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : topic.status === 'in_progress'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Add Enrolled Subject</h3>
            <form onSubmit={handleCreateSubject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Networks"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Code</label>
                <input
                  type="text"
                  placeholder="CS304"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Topic Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-3">Add Topic to {activeSubject?.name}</h3>
            <form onSubmit={handleCreateTopic} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Chapter / Module</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 3: Transport Layer"
                  value={topicForm.chapter_name}
                  onChange={(e) => setTopicForm({ ...topicForm, chapter_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topic Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TCP 3-Way Handshake & Flow Control"
                  value={topicForm.topic_name}
                  onChange={(e) => setTopicForm({ ...topicForm, topic_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={topicForm.difficulty}
                    onChange={(e) => setTopicForm({ ...topicForm, difficulty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Mins</label>
                  <input
                    type="number"
                    value={topicForm.estimated_minutes}
                    onChange={(e) => setTopicForm({ ...topicForm, estimated_minutes: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTopicModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

