import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { calculateWellnessScore } from '../src/services/wellnessEngine.js';

describe('Wellness Score Engine', () => {
  it('should calculate accurate weighted wellness score', () => {
    const result = calculateWellnessScore({
      studyMinutes: 240,
      studyGoalMinutes: 240,
      tasksCompleted: 4,
      tasksTotal: 4,
      mealsCompletedCount: 3,
      waterConsumedMl: 2500,
      waterGoalMl: 2500,
      sleepHours: 8,
      sleepGoalHours: 7.5
    });

    expect(result.totalScore).toBeGreaterThanOrEqual(95);
    expect(result.categoryScores.study).toBe(100);
    expect(result.categoryScores.meals).toBe(100);
    expect(result.categoryScores.hydration).toBe(100);
    expect(result.categoryScores.sleep).toBe(100);
  });

  it('should handle zero or partial logs gracefully without crashing', () => {
    const result = calculateWellnessScore({
      studyMinutes: 0,
      mealsCompletedCount: 0,
      waterConsumedMl: 0,
      sleepHours: 0
    });

    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.disclaimer).toBeDefined();
  });
});

describe('API Health and Public Endpoints', () => {
  it('GET /api/health should return status healthy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  it('GET / should return platform metadata', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('ExamWeekWithoutTheCrash API');
  });
});

