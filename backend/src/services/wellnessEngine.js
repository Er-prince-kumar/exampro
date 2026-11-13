/**
 * Explainable Wellness Score Engine
 * Weights: Study progress: 30%, Meals: 25%, Hydration: 20%, Sleep: 25%
 * Note: Motivational consistency indicator, not a medical metric.
 */

export const calculateWellnessScore = ({
  studyMinutes = 0,
  studyGoalMinutes = 240, // 4 hours target
  tasksCompleted = 0,
  tasksTotal = 0,
  mealsCompletedCount = 0, // 0 to 4
  waterConsumedMl = 0,
  waterGoalMl = 2500,
  sleepHours = 0,
  sleepGoalHours = 7.5
}) => {
  // 1. Study Score (30%)
  // Combines duration progress and task completion
  let durationRatio = studyGoalMinutes > 0 ? Math.min(studyMinutes / studyGoalMinutes, 1.2) : 1;
  let taskRatio = tasksTotal > 0 ? tasksCompleted / tasksTotal : (studyMinutes > 30 ? 1 : 0.5);
  let rawStudy = (durationRatio * 0.6 + taskRatio * 0.4) * 100;
  const studyScore = Math.min(Math.round(rawStudy), 100);

  // 2. Meals Score (25%)
  // 3-4 meals = 100%, 2 meals = 70%, 1 meal = 40%, 0 = 0%
  let rawMeals = 0;
  if (mealsCompletedCount >= 3) rawMeals = 100;
  else if (mealsCompletedCount === 2) rawMeals = 70;
  else if (mealsCompletedCount === 1) rawMeals = 40;
  else rawMeals = 0;
  const mealScore = rawMeals;

  // 3. Hydration Score (20%)
  let rawWater = waterGoalMl > 0 ? (waterConsumedMl / waterGoalMl) * 100 : 0;
  const waterScore = Math.min(Math.round(rawWater), 100);

  // 4. Sleep Score (25%)
  // Optimal: 7 - 9 hours. Penalty if severely deprived (< 5h) or excessively long (> 11h during active exams)
  let rawSleep = 0;
  if (sleepHours >= 7 && sleepHours <= 9) {
    rawSleep = 100;
  } else if (sleepHours >= 6 && sleepHours < 7) {
    rawSleep = 85;
  } else if (sleepHours > 9 && sleepHours <= 10.5) {
    rawSleep = 85;
  } else if (sleepHours >= 5 && sleepHours < 6) {
    rawSleep = 65;
  } else if (sleepHours > 0 && sleepHours < 5) {
    rawSleep = Math.max(30, sleepHours * 10);
  } else {
    // missing or unrecorded sleep is not penalized to 0 if rest of day is tracked
    rawSleep = 0;
  }
  const sleepScore = Math.min(Math.round(rawSleep), 100);

  // Weighted Total
  // Study: 30%, Meals: 25%, Hydration: 20%, Sleep: 25%
  const totalWellnessScore = Math.round(
    (studyScore * 0.30) +
    (mealScore * 0.25) +
    (waterScore * 0.20) +
    (sleepScore * 0.25)
  );

  return {
    totalScore: totalWellnessScore,
    categoryScores: {
      study: studyScore,
      meals: mealScore,
      hydration: waterScore,
      sleep: sleepScore
    },
    weights: {
      study: 0.30,
      meals: 0.25,
      hydration: 0.20,
      sleep: 0.25
    },
    metricsSummary: {
      studyMinutes,
      studyGoalMinutes,
      mealsCompletedCount,
      waterConsumedMl,
      waterGoalMl,
      sleepHours,
      sleepGoalHours
    },
    disclaimer: "This wellness score is a motivational habit consistency indicator to help balance college study routines with essential recovery. It is not a medical diagnostic assessment or academic performance guarantee."
  };
};

