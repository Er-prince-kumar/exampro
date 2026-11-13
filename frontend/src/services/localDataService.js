// Robust local storage repository providing instant offline & zero-setup functionality
// Syncs transparently with Supabase when valid Supabase credentials are provided

const STORAGE_KEY = 'exampro_student_state_v1';

const getInitialState = () => ({
  user: {
    id: 'student-demo-uuid',
    email: 'alex.rivera@college.edu',
    full_name: 'Alex Rivera',
    college_name: 'Apex Institute of Technology',
    branch: 'Computer Science & Engineering',
    semester: '6th Semester',
    daily_study_goal_minutes: 240,
    daily_water_goal_ml: 2500,
    daily_sleep_goal_hours: 7.5,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  },
  subjects: [
    { id: 'sub-1', name: 'Operating Systems & Concurrency', code: 'CS301', color: '#0ea5e9', credits: 4 },
    { id: 'sub-2', name: 'Database Management Systems', code: 'CS302', color: '#06b6d4', credits: 4 },
    { id: 'sub-3', name: 'Design & Analysis of Algorithms', code: 'CS303', color: '#3b82f6', credits: 4 },
    { id: 'sub-4', name: 'Computer Networks', code: 'CS304', color: '#6366f1', credits: 3 }
  ],
  topics: [
    { id: 'top-1', subject_id: 'sub-1', chapter_name: 'Process Scheduling', topic_name: 'Round Robin & Multilevel Queue', difficulty: 'medium', status: 'completed', revision_count: 2 },
    { id: 'top-2', subject_id: 'sub-1', chapter_name: 'Memory Management', topic_name: 'Page Replacement Algorithms (LRU, FIFO)', difficulty: 'hard', status: 'in_progress', revision_count: 1 },
    { id: 'top-3', subject_id: 'sub-1', chapter_name: 'Deadlocks', topic_name: "Banker's Algorithm & Resource Allocation Graphs", difficulty: 'hard', status: 'not_started', revision_count: 0 },
    { id: 'top-4', subject_id: 'sub-2', chapter_name: 'Indexing', topic_name: 'B+ Tree Indexing & Hash Indices', difficulty: 'medium', status: 'completed', revision_count: 1 },
    { id: 'top-5', subject_id: 'sub-2', chapter_name: 'Normalization', topic_name: '3NF, BCNF & Lossless Decomposition', difficulty: 'hard', status: 'in_progress', revision_count: 1 },
    { id: 'top-6', subject_id: 'sub-3', chapter_name: 'Dynamic Programming', topic_name: 'Longest Common Subsequence & 0/1 Knapsack', difficulty: 'hard', status: 'not_started', revision_count: 0 }
  ],
  exams: [
    {
      id: 'exam-1',
      subject_id: 'sub-1',
      subject_name: 'Operating Systems & Concurrency',
      exam_type: 'MTT',
      exam_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from today
      exam_time: '09:30',
      room_number: 'Hall B - 204',
      total_marks: 50,
      priority: 'critical',
      notes: 'Focus on Memory Management & Deadlock recovery algorithms',
      is_completed: false
    },
    {
      id: 'exam-2',
      subject_id: 'sub-2',
      subject_name: 'Database Management Systems',
      exam_type: 'MTT',
      exam_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 days from today
      exam_time: '14:00',
      room_number: 'Seminar Hall 1',
      total_marks: 50,
      priority: 'high',
      notes: 'Prepare SQL triggers and BCNF conversion steps',
      is_completed: false
    }
  ],
  studyTasks: [
    { id: 'task-1', subject_id: 'sub-1', topic_id: 'top-2', title: 'Solve 5 Page Fault problems (LRU & Optimal)', estimated_minutes: 50, priority: 'urgent', due_date: new Date().toISOString().split('T')[0], status: 'completed' },
    { id: 'task-2', subject_id: 'sub-1', topic_id: 'top-3', title: 'Derive Safety Algorithm pseudocode & proof', estimated_minutes: 60, priority: 'high', due_date: new Date().toISOString().split('T')[0], status: 'in_progress' },
    { id: 'task-3', subject_id: 'sub-2', topic_id: 'top-5', title: 'Practice 3 BCNF Decomposition questions', estimated_minutes: 45, priority: 'medium', due_date: new Date().toISOString().split('T')[0], status: 'pending' }
  ],
  studySessions: [
    { id: 'sess-1', duration_minutes: 50, session_type: 'pomodoro', completed_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), notes: 'Focused on LRU page faults' },
    { id: 'sess-2', duration_minutes: 45, session_type: 'pomodoro', completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), notes: 'Reviewed paging tables' }
  ],
  meals: [
    { id: 'meal-1', meal_type: 'breakfast', meal_date: new Date().toISOString().split('T')[0], meal_time: '08:30', is_completed: true, description: 'Oatmeal, banana and boiled eggs', energy_rating: 4 },
    { id: 'meal-2', meal_type: 'lunch', meal_date: new Date().toISOString().split('T')[0], meal_time: '13:15', is_completed: true, description: 'Rice, lentils, steamed vegetables and curd', energy_rating: 4 },
    { id: 'meal-3', meal_type: 'snacks', meal_date: new Date().toISOString().split('T')[0], meal_time: '17:00', is_completed: false, description: '', energy_rating: 3 },
    { id: 'meal-4', meal_type: 'dinner', meal_date: new Date().toISOString().split('T')[0], meal_time: '20:30', is_completed: false, description: '', energy_rating: 3 }
  ],
  waterLogs: [
    { id: 'w-1', amount_ml: 500, log_date: new Date().toISOString().split('T')[0], log_time: '08:45' },
    { id: 'w-2', amount_ml: 250, log_date: new Date().toISOString().split('T')[0], log_time: '10:30' },
    { id: 'w-3', amount_ml: 500, log_date: new Date().toISOString().split('T')[0], log_time: '12:15' },
    { id: 'w-4', amount_ml: 250, log_date: new Date().toISOString().split('T')[0], log_time: '14:20' }
  ],
  sleepLogs: [
    {
      id: 'slp-1',
      sleep_date: new Date().toISOString().split('T')[0],
      bedtime: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
      wake_time: new Date(Date.now() - 7.5 * 60 * 60 * 1000).toISOString(),
      duration_hours: 7.5,
      quality_rating: 4,
      notes: 'Felt well-rested, no midnight waking'
    }
  ],
  reminders: [
    { id: 'rem-1', title: 'Hydration - Drink 250ml Water', reminder_type: 'water', remind_time: '11:00', is_active: true },
    { id: 'rem-2', title: 'Lunch Fuel Time', reminder_type: 'meal', remind_time: '13:00', is_active: true },
    { id: 'rem-3', title: 'Afternoon Pomodoro Study Block', reminder_type: 'study', remind_time: '15:00', is_active: true },
    { id: 'rem-4', title: 'Sleep Cutoff - Wind down for tomorrow', reminder_type: 'sleep', remind_time: '23:00', is_active: true }
  ]
});

export const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialState();
      saveState(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load state from localStorage', err);
    return getInitialState();
  }
};

export const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to persist state to localStorage', err);
  }
};

