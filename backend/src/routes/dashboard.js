import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { calculateWellnessScore } from '../services/wellnessEngine.js';

const router = Router();

router.get('/summary', requireAuth, async (req, res, next) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // In production, queries supabase tables:
    // study_sessions, meals, water_logs, sleep_logs, exams
    // Providing default calibrated state for current date
    const wellnessData = calculateWellnessScore({
      studyMinutes: 180,
      studyGoalMinutes: 240,
      tasksCompleted: 3,
      tasksTotal: 5,
      mealsCompletedCount: 3,
      waterConsumedMl: 2000,
      waterGoalMl: 2500,
      sleepHours: 7.2,
      sleepGoalHours: 7.5
    });

    res.json({
      date: today,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.user_metadata?.full_name || 'Alex'
      },
      wellness: wellnessData,
      quickStats: {
        studyTimeTodayMinutes: 180,
        pendingTasksCount: 2,
        upcomingExamsCount: 2,
        activeRemindersCount: 4
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;

