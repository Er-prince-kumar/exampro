import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey && apiKey !== 'your-gemini-api-key-here') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (e) {
    console.warn('[Gemini Init Warning]', e.message);
  }
}

/**
 * Generate intelligent, realistic student daily study & wellness guidance.
 * Fallback gracefully if API key is not configured or network fails.
 */
export const generateStudentAdvice = async (context) => {
  const {
    studentName = 'Student',
    upcomingExams = [],
    syllabusProgress = [],
    todayStudyMinutes = 0,
    studyGoalMinutes = 240,
    mealsLogged = [],
    waterMl = 0,
    waterGoalMl = 2500,
    sleepHours = 7,
    wellnessScore = 75,
    userQuery = ''
  } = context;

  // If Gemini is configured, query the model
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
You are the AI Wellness & Academic Assistant for "ExamWeekWithoutTheCrash", an evidence-based student wellness and exam planning platform.
Your mission: Help college students balance intense MTT (Mid Term Tests) and ETT (End Term Tests) examination prep with non-negotiable health routines (meals, hydration, sleep).

CURRENT STUDENT CONTEXT:
- Name: ${studentName}
- Current Wellness Score: ${wellnessScore}/100
- Sleep last night: ${sleepHours} hours (Target: 7-8h)
- Water consumed today: ${waterMl}ml / ${waterGoalMl}ml goal
- Meals recorded today: ${mealsLogged.length} meal(s) (${mealsLogged.join(', ') || 'None recorded yet'})
- Study time today: ${todayStudyMinutes} minutes / ${studyGoalMinutes} minutes goal
- Upcoming Exams: ${upcomingExams.map(e => `${e.subject} (${e.exam_type}) on ${e.exam_date} in ${e.days_remaining} days`).join('; ') || 'No immediate exams logged'}
- Syllabus Status: ${syllabusProgress.map(s => `${s.subject}: ${s.completedTopics}/${s.totalTopics} topics (${s.percentage}%)`).join('; ') || 'Topics not loaded'}

STUDENT SPECIFIC QUERY (if any): "${userQuery || 'Generate my daily strategy and wellness suggestions'}"

RESPONSE INSTRUCTIONS:
1. Provide an empathetic, realistic, structured response.
2. Structure your reply in clear markdown sections:
   - 🎯 **Priority Focus for Today** (Which subject/topic needs attention based on exam proximity and remaining syllabus)
   - ⚡ **Study Schedule & Pomodoro Breakdown** (Manageable 45-50 min chunks with breaks)
   - 🥗 **Wellness Non-Negotiables** (Actionable advice for meals, water replenishment, and strict bedtime cutoff)
   - 💡 **Mindset & Crash-Prevention Tip** (Quick mental recovery technique)
3. SAFETY BOUNDARIES:
   - Do NOT provide medical diagnosis or prescribe medications/supplements.
   - Do NOT advise pulling all-nighters or skipping meals.
   - Do NOT guarantee academic letter grades.
   - Keep tone encouraging, pragmatic, and stress-reducing.
`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return {
        success: true,
        source: 'gemini-1.5-flash',
        advice: text,
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      console.error('[Gemini API Call Error]', err.message);
      // Fall through to deterministic fallback
    }
  }

  // High-quality Deterministic Rule-Based Fallback when offline or API key pending
  const nearestExam = upcomingExams[0];
  const examAlert = nearestExam 
    ? `Your next exam is **${nearestExam.subject} (${nearestExam.exam_type})** in ${nearestExam.days_remaining} days.`
    : `Keep progressing consistently across your enrolled syllabus topics.`;

  const waterAdvice = waterMl < waterGoalMl * 0.5 
    ? `You have only recorded ${waterMl}ml so far. Drink a 250ml glass of water before starting your next study block.`
    : `Great job on hydration (${waterMl}ml / ${waterGoalMl}ml)! Keep a water bottle within reach.`;

  const mealAdvice = mealsLogged.length < 2
    ? `Only ${mealsLogged.length} meal recorded today. Remember: cognitive endurance drops sharply on an empty stomach. Take a 20-minute meal break now.`
    : `Good consistency on meals. Fuel with light snacks (nuts, fruits) rather than heavy sugary foods to avoid afternoon fatigue.`;

  const sleepAdvice = sleepHours < 6
    ? `You only slept ${sleepHours} hours. Sleep debt significantly reduces working memory during tests. Set a hard cutoff tonight by 11:30 PM.`
    : `Healthy sleep baseline (${sleepHours} hours). Protect this routine tonight to maximize memory consolidation.`;

  const fallbackAdvice = `
### 🎯 Priority Focus for Today
${examAlert} Focus 65% of your available study time on high-difficulty remaining topics rather than passive re-reading.

### ⚡ Recommended Study & Pomodoro Breakdown
- **Block 1 (45 mins):** Active recall and formula/concept review for ${nearestExam ? nearestExam.subject : 'primary subject'}.
- **Break (10 mins):** Step away from all screens; stretch neck and shoulders.
- **Block 2 (45 mins):** Practice 2 past-year MTT/ETT problems under timed conditions.
- **Break (15 mins):** Hydrate and take a brief walk.
- **Block 3 (30 mins):** Quick synthesis notes and self-quiz.

### 🥗 Wellness Non-Negotiables
- **Hydration:** ${waterAdvice}
- **Meals:** ${mealAdvice}
- **Rest:** ${sleepAdvice}

### 💡 Crash-Prevention Tip
*Spacing beats cramming.* If you feel your attention wandering after 40 minutes, that is your brain's biological signal for rest—not a failure of willpower. Take a 5-minute break instead of forcing through exhaustion.
  `.trim();

  return {
    success: true,
    source: 'rule-engine-fallback',
    advice: fallbackAdvice,
    timestamp: new Date().toISOString(),
    notice: 'Using rule-based guidance engine. Configure GEMINI_API_KEY in backend/.env to enable live Gemini generative assistant.'
  };
};

