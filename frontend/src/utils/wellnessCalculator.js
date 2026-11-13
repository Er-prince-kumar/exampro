export const calculateWellness = (data) => {
  const today = new Date().toISOString().split('T')[0];

  // 1. Study time today
  const todaySessions = data.studySessions.filter(s => s.completed_at?.startsWith(today));
  const todayStudyMinutes = todaySessions.reduce((acc, s) => acc + (s.duration_minutes || 0), 0);
  const studyGoal = data.user?.daily_study_goal_minutes || 240;

  const todayTasks = data.studyTasks.filter(t => t.due_date === today);
  const completedTasks = todayTasks.filter(t => t.status === 'completed');

  const durationRatio = studyGoal > 0 ? Math.min(todayStudyMinutes / studyGoal, 1.2) : 1;
  const taskRatio = todayTasks.length > 0 ? completedTasks.length / todayTasks.length : (todayStudyMinutes > 30 ? 1 : 0.5);
  const studyScore = Math.min(Math.round((durationRatio * 0.6 + taskRatio * 0.4) * 100), 100);

  // 2. Meals
  const todayMeals = data.meals.filter(m => m.meal_date === today && m.is_completed);
  let mealScore = 0;
  if (todayMeals.length >= 3) mealScore = 100;
  else if (todayMeals.length === 2) mealScore = 70;
  else if (todayMeals.length === 1) mealScore = 40;
  else mealScore = 0;

  // 3. Hydration
  const todayWater = data.waterLogs.filter(w => w.log_date === today);
  const totalWaterMl = todayWater.reduce((acc, w) => acc + (w.amount_ml || 0), 0);
  const waterGoal = data.user?.daily_water_goal_ml || 2500;
  const waterScore = Math.min(Math.round((totalWaterMl / waterGoal) * 100), 100);

  // 4. Sleep
  const todaySleep = data.sleepLogs.find(s => s.sleep_date === today) || data.sleepLogs[0];
  const sleepHours = todaySleep ? Number(todaySleep.duration_hours) : 0;
  let sleepScore = 0;
  if (sleepHours >= 7 && sleepHours <= 9) sleepScore = 100;
  else if (sleepHours >= 6 && sleepHours < 7) sleepScore = 85;
  else if (sleepHours > 9 && sleepHours <= 10.5) sleepScore = 85;
  else if (sleepHours >= 5 && sleepHours < 6) sleepScore = 65;
  else if (sleepHours > 0) sleepScore = Math.max(30, sleepHours * 10);
  else sleepScore = 0;

  // Total Weighted
  const total = Math.round(
    studyScore * 0.30 +
    mealScore * 0.25 +
    waterScore * 0.20 +
    sleepScore * 0.25
  );

  return {
    total,
    studyScore,
    mealScore,
    waterScore,
    sleepScore,
    todayStudyMinutes,
    studyGoal,
    completedTasksCount: completedTasks.length,
    totalTasksCount: todayTasks.length,
    todayMealsCount: todayMeals.length,
    totalWaterMl,
    waterGoal,
    sleepHours
  };
};

