import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

const schedulePlanSchema = z.object({
  examDate: z.string(),
  availableDailyHours: z.number().min(1).max(16).default(4),
  remainingTopicsCount: z.number().int().positive().default(10),
  difficultyDistribution: z.object({
    hard: z.number().default(3),
    medium: z.number().default(4),
    easy: z.number().default(3)
  }).optional()
});

/**
 * Generates an adaptive, non-cramming study schedule split into Pomodoro chunks
 */
router.post('/suggest-schedule', requireAuth, (req, res, next) => {
  try {
    const parse = schedulePlanSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid parameters', details: parse.error.format() });
    }

    const { examDate, availableDailyHours, remainingTopicsCount, difficultyDistribution } = parse.data;
    const targetDate = new Date(examDate);
    const now = new Date();
    const diffTime = targetDate.getTime() - now.getTime();
    const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const totalAvailableStudyMinutes = daysRemaining * availableDailyHours * 60;
    const estimatedMinutesPerTopic = Math.round(totalAvailableStudyMinutes / remainingTopicsCount);

    // Generate balanced blocks (45m study + 10m recovery)
    const blocksPerDay = Math.floor((availableDailyHours * 60) / 55);

    const generatedDays = [];
    for (let i = 1; i <= Math.min(daysRemaining, 7); i++) {
      const dayDate = new Date();
      dayDate.setDate(dayDate.getDate() + (i - 1));
      
      generatedDays.push({
        dayNumber: i,
        date: dayDate.toISOString().split('T')[0],
        blocks: Array.from({ length: Math.max(1, blocksPerDay) }).map((_, blockIdx) => ({
          blockNumber: blockIdx + 1,
          type: blockIdx % 2 === 0 ? 'Deep Concept Study' : 'Active Problem Solving',
          durationMinutes: 45,
          recommendedBreakMinutes: blockIdx === blocksPerDay - 1 ? 30 : 10,
          suggestedActivity: blockIdx % 2 === 0 
            ? 'Review high-yield formulas and definitions' 
            : 'Solve 3 previous year examination questions'
        }))
      });
    }

    res.json({
      daysRemaining,
      totalAvailableStudyMinutes,
      estimatedMinutesPerTopic: Math.min(estimatedMinutesPerTopic, 120),
      dailyRecommendedHours: availableDailyHours,
      schedule: generatedDays,
      safetyNotice: 'Schedule automatically incorporates rest intervals and avoids all-night sessions to preserve cognitive recall.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;

