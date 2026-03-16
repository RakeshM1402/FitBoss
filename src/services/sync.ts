import { FitnessScoreEntry, FoodLog, PendingSyncItem, UserProfile, WorkoutLog } from '../types';
import { supabase } from './supabase';

const serializeProfile = (profile: UserProfile) => ({
  id: profile.id,
  email: profile.email,
  username: profile.username,
  age: profile.age,
  weight_kg: profile.weightKg,
  height_cm: profile.heightCm,
  gender: profile.gender,
  activity_level: profile.activityLevel,
  daily_calorie_goal: profile.dailyCalorieGoal,
  body_fat_estimate: profile.bodyFatEstimate,
  streak_count: profile.streakCount,
  last_login_date: profile.lastLoginDate ?? null,
  primary_goal: profile.onboarding.primaryGoal,
  experience_level: profile.onboarding.experienceLevel,
  workouts_per_week: profile.onboarding.workoutsPerWeek,
  diet_style: profile.onboarding.dietStyle,
  training_location: profile.onboarding.trainingLocation,
  discovery_source: profile.onboarding.discoverySource,
  motivation: profile.onboarding.motivation,
});

const serializeFoodLog = (item: FoodLog) => ({
  id: item.id,
  user_id: item.userId,
  food_name: item.foodName,
  grams: item.grams,
  calories: item.calories,
  protein: item.protein,
  carbs: item.carbs,
  fat: item.fat,
  logged_at: item.loggedAt,
  nutrition_source: item.nutritionSource ?? null,
});

const serializeWorkout = (item: WorkoutLog) => ({
  id: item.id,
  user_id: item.userId,
  workout_type: item.workoutType,
  duration_seconds: item.durationSeconds,
  completed_at: item.completedAt,
});

const serializeScore = (item: FitnessScoreEntry) => ({
  id: item.id,
  user_id: item.userId,
  date: item.date,
  points: item.points,
  reason: item.reason,
});

const uploadByAction = async (item: PendingSyncItem) => {
  switch (item.action) {
    case 'upsert_profile':
      return supabase.from('users').upsert(serializeProfile(item.payload as UserProfile));
    case 'upsert_food_log':
      return supabase.from('food_logs').upsert(serializeFoodLog(item.payload as FoodLog));
    case 'upsert_workout':
      return supabase.from('workouts').upsert(serializeWorkout(item.payload as WorkoutLog));
    case 'upsert_score':
      return supabase.from('fitness_scores').upsert(serializeScore(item.payload as FitnessScoreEntry));
    default:
      return { error: null };
  }
};

export const syncPendingItems = async (queue: PendingSyncItem[]) => {
  const remaining: PendingSyncItem[] = [];

  for (const item of queue) {
    try {
      const { error } = await uploadByAction(item);
      if (error) {
        remaining.push(item);
      }
    } catch {
      remaining.push(item);
    }
  }

  return remaining;
};

export const fetchLeaderboards = async () => {
  const [weekly, allTime] = await Promise.all([
    supabase.rpc('get_weekly_leaderboard'),
    supabase.rpc('get_all_time_leaderboard'),
  ]);

  return {
    weekly: (weekly.data ?? []).map((item: { rank: number; username: string; fitnessscore: number }) => ({
      rank: item.rank,
      username: item.username,
      fitnessScore: item.fitnessscore,
    })),
    allTime: (allTime.data ?? []).map((item: { rank: number; username: string; fitnessscore: number }) => ({
      rank: item.rank,
      username: item.username,
      fitnessScore: item.fitnessscore,
    })),
  };
};
