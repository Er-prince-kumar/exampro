import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { generateStudentAdvice } from '../services/aiAssistant.js';
import { z } from 'zod';

const router = Router();

const adviceRequestSchema = z.object({
  studentName: z.string().optional(),
  upcomingExams: z.array(z.any()).optional(),
  syllabusProgress: z.array(z.any()).optional(),
  todayStudyMinutes: z.number().nonnegative().optional(),
  studyGoalMinutes: z.number().positive().optional(),
  mealsLogged: z.array(z.string()).optional(),
  waterMl: z.number().nonnegative().optional(),
  waterGoalMl: z.number().positive().optional(),
  sleepHours: z.number().nonnegative().optional(),
  wellnessScore: z.number().min(0).max(100).optional(),
  userQuery: z.string().max(500).optional()
});

router.post('/recommendations', requireAuth, async (req, res, next) => {
  try {
    const parseResult = adviceRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid input format', details: parseResult.error.format() });
    }

    const context = {
      ...parseResult.data,
      studentName: parseResult.data.studentName || req.user?.user_metadata?.full_name || 'Student'
    };

    const adviceResult = await generateStudentAdvice(context);
    res.json(adviceResult);
  } catch (err) {
    next(err);
  }
});

export default router;

