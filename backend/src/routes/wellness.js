import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { calculateWellnessScore } from '../services/wellnessEngine.js';
import { z } from 'zod';

const router = Router();

const calculateSchema = z.object({
  studyMinutes: z.number().nonnegative().default(0),
  studyGoalMinutes: z.number().positive().default(240),
  tasksCompleted: z.number().nonnegative().default(0),
  tasksTotal: z.number().nonnegative().default(0),
  mealsCompletedCount: z.number().min(0).max(4).default(0),
  waterConsumedMl: z.number().nonnegative().default(0),
  waterGoalMl: z.number().positive().default(2500),
  sleepHours: z.number().nonnegative().default(0),
  sleepGoalHours: z.number().positive().default(7.5)
});

router.post('/calculate', requireAuth, (req, res, next) => {
  try {
    const parse = calculateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid score metrics', details: parse.error.format() });
    }

    const result = calculateWellnessScore(parse.data);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;

