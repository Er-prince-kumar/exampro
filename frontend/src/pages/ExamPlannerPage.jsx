import React, { useState } from 'react';
import { useStudent } from '../context/StudentContext';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Edit, 
  Clock, 
  MapPin, 
  AlertCircle, 
  CheckCircle,
  FileText
} from 'lucide-react';

export const ExamPlannerPage = () => {
  const { data, addExam, updateExam, deleteExam } = useStudent();
  const [showModal, setShowModal] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);

  const [formData, setFormData] = useState({
    subject_name: '',
    exam_type: 'MTT',
    exam_date: '',
    exam_time: '09:30',
    room_number: '',
    total_marks: 50,
    priority: 'high',
    notes: ''
  });

  const handleOpenAdd = () => {
    setEditingExamId(null);
    setFormData({
      subject_name: data.subjects[0]?.name || '',
      exam_type: 'MTT',
      exam_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      exam_time: '09:30',
      room_number: '',
      total_marks: 50,
      priority: 'high',
      notes: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (exam) => {
    setEditingExamId(exam.id);
    setFormData({
      subject_name: exam.subject_name,
      exam_type: exam.exam_type,
      exam_date: exam.exam_date,
      exam_time: exam.exam_time,
      room_number: exam.room_number || '',
      total_marks: exam.total_marks || 50,
      priority: exam.priority || 'high',
      notes: exam.notes || ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject_name || !formData.exam_date) return;

    if (editingExamId) {
      updateExam(editingExamId, formData);
    } else {
      addExam(formData);
    }
    setShowModal(false);
  };

  // Sort exams by date
  const sortedExams = [...data.exams].sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Examination Planner</h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize Mid Term Tests (MTT), End Term Tests (ETT), and practical exams with live countdowns.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Examination</span>
        </button>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedExams.map((exam) => {
          const examDateTime = new Date(`${exam.exam_date}T${exam.exam_time || '00:00'}`);
          const diffDays = Math.ceil((examDateTime.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          const isPast = diffDays < 0;

          return (
            <div
              key={exam.id}
              className={`p-5 rounded-2xl bg-slate-900/80 border ${
                isPast 
                  ? 'border-slate-800 opacity-60' 
                  : diffDays <= 3 
                  ? 'border-rose-500/40 shadow-lg shadow-rose-950/20' 
                  : 'border-slate-800 hover:border-cyan-500/40'
              } flex flex-col justify-between transition-all`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                    {exam.exam_type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      exam.priority === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {exam.priority}
                    </span>
                    <button
                      onClick={() => handleOpenEdit(exam)}
                      className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                      title="Edit Exam"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete Exam"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white leading-snug truncate">
                  {exam.subject_name}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{exam.exam_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{exam.exam_time}</span>
                  </div>
                  {exam.room_number && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{exam.room_number}</span>
                    </div>
                  )}
                </div>

                {exam.notes && (
                  <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300">
                    <span className="text-slate-500 font-semibold block mb-0.5">Focus Notes:</span>
                    {exam.notes}
                  </div>
                )}
              </div>

              {/* Countdown Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  {isPast ? (
                    <span className="text-xs font-semibold text-slate-500">Completed Exam</span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-cyan-400">{diffDays}</span>
                      <span className="text-[10px] text-slate-400 font-medium">days left</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => updateExam(exam.id, { is_completed: !exam.is_completed })}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors ${
                    exam.is_completed
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{exam.is_completed ? 'Finished' : 'Mark Done'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">
              {editingExamId ? 'Edit Examination' : 'Add New Examination'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  value={formData.subject_name}
                  onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                  placeholder="e.g. Operating Systems"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Type</label>
                  <select
                    value={formData.exam_type}
                    onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="MTT">MTT (Mid Term Test)</option>
                    <option value="ETT">ETT (End Term Test)</option>
                    <option value="QUIZ">Quiz / Unit Test</option>
                    <option value="PRACTICAL">Lab Practical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={formData.exam_date}
                    onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Time</label>
                  <input
                    type="time"
                    required
                    value={formData.exam_time}
                    onChange={(e) => setFormData({ ...formData, exam_time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Room / Hall</label>
                  <input
                    type="text"
                    value={formData.room_number}
                    onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
                    placeholder="e.g. Hall 204"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={formData.total_marks}
                    onChange={(e) => setFormData({ ...formData, total_marks: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preparation Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Key formulas or modules to prioritize..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  {editingExamId ? 'Save Changes' : 'Create Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

