import { describe, it, expect } from 'vitest';
import { calculateWellness } from '../utils/wellnessCalculator';

describe('Frontend Wellness Calculation Logic', () => {
  it('should accurately compute 100% when all goals are met', () => {
    const today = new Date().toISOString().split('T')[0];
    const mockData = {
      user: { daily_study_goal_minutes: 240, daily_water_goal_ml: 2500, daily_sleep_goal_hours: 8 },
      studySessions: [{ completed_at: `${today}T10:00:00`, duration_minutes: 240 }],
      studyTasks: [{ due_date: today, status: 'completed' }],
      meals: [
        { meal_date: today, meal_type: 'breakfast', is_completed: true },
        { meal_date: today, meal_type: 'lunch', is_completed: true },
        { meal_date: today, meal_type: 'dinner', is_completed: true }
      ],
      waterLogs: [{ log_date: today, amount_ml: 2500 }],
      sleepLogs: [{ sleep_date: today, duration_hours: 8 }]
    };

    const res = calculateWellness(mockData);
    expect(res.total).toBeGreaterThanOrEqual(95);
    expect(res.mealScore).toBe(100);
    expect(res.waterScore).toBe(100);
    expect(res.sleepScore).toBe(100);
  });
});
