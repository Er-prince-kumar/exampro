import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isDemoMode } from '../services/supabase';
import { loadState, saveState } from '../services/localDataService';

const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(loadState());

  // Listen to Supabase Auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync to local storage
  useEffect(() => {
    saveState(data);
  }, [data]);

  // Auth Actions
  const signInWithEmail = async (email, password) => {
    if (isDemoMode) {
      // Offline/Demo seamless login
      const demoUser = {
        id: 'student-demo-uuid',
        email,
        user_metadata: { full_name: email.split('@')[0] }
      };
      setSession({ user: demoUser, access_token: 'mock-token' });
      return { success: true };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUpWithEmail = async (email, password, fullName) => {
    if (isDemoMode) {
      const demoUser = {
        id: 'student-demo-uuid',
        email,
        user_metadata: { full_name: fullName }
      };
      setSession({ user: demoUser, access_token: 'mock-token' });
      return { success: true };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (!isDemoMode) {
      await supabase.auth.signOut();
    }
    setSession(null);
  };

  // State Mutation Helpers
  const addExam = (exam) => {
    const newExam = { ...exam, id: `exam-${Date.now()}` };
    setData(prev => ({ ...prev, exams: [newExam, ...prev.exams] }));
  };

  const updateExam = (id, updatedFields) => {
    setData(prev => ({
      ...prev,
      exams: prev.exams.map(e => e.id === id ? { ...e, ...updatedFields } : e)
    }));
  };

  const deleteExam = (id) => {
    setData(prev => ({
      ...prev,
      exams: prev.exams.filter(e => e.id !== id)
    }));
  };

  const addSubject = (subject) => {
    const newSubject = { ...subject, id: `sub-${Date.now()}` };
    setData(prev => ({ ...prev, subjects: [...prev.subjects, newSubject] }));
  };

  const addTopic = (topic) => {
    const newTopic = { ...topic, id: `top-${Date.now()}` };
    setData(prev => ({ ...prev, topics: [...prev.topics, newTopic] }));
  };

  const updateTopic = (id, fields) => {
    setData(prev => ({
      ...prev,
      topics: prev.topics.map(t => t.id === id ? { ...t, ...fields } : t)
    }));
  };

  const addStudyTask = (task) => {
    const newTask = { ...task, id: `task-${Date.now()}` };
    setData(prev => ({ ...prev, studyTasks: [newTask, ...prev.studyTasks] }));
  };

  const updateStudyTask = (id, fields) => {
    setData(prev => ({
      ...prev,
      studyTasks: prev.studyTasks.map(t => t.id === id ? { ...t, ...fields } : t)
    }));
  };

  const deleteStudyTask = (id) => {
    setData(prev => ({
      ...prev,
      studyTasks: prev.studyTasks.filter(t => t.id !== id)
    }));
  };

  const logStudySession = (durationMinutes, notes = '', sessionType = 'pomodoro') => {
    const newSession = {
      id: `sess-${Date.now()}`,
      duration_minutes: durationMinutes,
      session_type: sessionType,
      notes,
      completed_at: new Date().toISOString()
    };
    setData(prev => ({ ...prev, studySessions: [newSession, ...prev.studySessions] }));
  };

  const toggleMeal = (mealType, isCompleted, description = '') => {
    const today = new Date().toISOString().split('T')[0];
    setData(prev => {
      const existing = prev.meals.find(m => m.meal_type === mealType && m.meal_date === today);
      if (existing) {
        return {
          ...prev,
          meals: prev.meals.map(m => m.id === existing.id ? { ...m, is_completed: isCompleted, description } : m)
        };
      }
      const newMeal = {
        id: `meal-${Date.now()}`,
        meal_type: mealType,
        meal_date: today,
        meal_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        is_completed: isCompleted,
        description,
        energy_rating: 3
      };
      return { ...prev, meals: [...prev.meals, newMeal] };
    });
  };

  const addWater = (amountMl) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog = {
      id: `w-${Date.now()}`,
      amount_ml: amountMl,
      log_date: today,
      log_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setData(prev => ({ ...prev, waterLogs: [newLog, ...prev.waterLogs] }));
  };

  const deleteWaterLog = (id) => {
    setData(prev => ({
      ...prev,
      waterLogs: prev.waterLogs.filter(w => w.id !== id)
    }));
  };

  const logSleep = (sleepDate, bedtime, wakeTime, durationHours, qualityRating, notes) => {
    const newLog = {
      id: `slp-${Date.now()}`,
      sleep_date: sleepDate,
      bedtime,
      wake_time: wakeTime,
      duration_hours: durationHours,
      quality_rating: qualityRating,
      notes
    };
    setData(prev => {
      const filtered = prev.sleepLogs.filter(s => s.sleep_date !== sleepDate);
      return { ...prev, sleepLogs: [newLog, ...filtered] };
    });
  };

  const addReminder = (reminder) => {
    const newRem = { ...reminder, id: `rem-${Date.now()}` };
    setData(prev => ({ ...prev, reminders: [...prev.reminders, newRem] }));
  };

  const toggleReminder = (id) => {
    setData(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, is_active: !r.is_active } : r)
    }));
  };

  const deleteReminder = (id) => {
    setData(prev => ({
      ...prev,
      reminders: prev.reminders.filter(r => r.id !== id)
    }));
  };

  const updateProfile = (profileFields) => {
    setData(prev => ({
      ...prev,
      user: { ...prev.user, ...profileFields }
    }));
  };

  return (
    <StudentContext.Provider
      value={{
        session,
        loading,
        data,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        addExam,
        updateExam,
        deleteExam,
        addSubject,
        addTopic,
        updateTopic,
        addStudyTask,
        updateStudyTask,
        deleteStudyTask,
        logStudySession,
        toggleMeal,
        addWater,
        deleteWaterLog,
        logSleep,
        addReminder,
        toggleReminder,
        deleteReminder,
        updateProfile
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);

