import { ActivityLevel, Gender, FoodLog, UserProfile } from '../types';
import { getTodayKey } from './date';

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export const calculateBmr = (profile: Pick<UserProfile, 'age' | 'weightKg' | 'heightCm' | 'gender'>) => {
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age;

  if (profile.gender === 'male') {
    return Math.round(base + 5);
  }
  if (profile.gender === 'female') {
    return Math.round(base - 161);
  }
  return Math.round(base - 78);
};

export const calculateDailyCalories = (
  profile: Pick<UserProfile, 'age' | 'weightKg' | 'heightCm' | 'gender' | 'activityLevel'>,
) => Math.round(calculateBmr(profile) * activityMultipliers[profile.activityLevel]);

export const estimateBodyFat = (
  profile: Pick<UserProfile, 'gender' | 'age' | 'weightKg' | 'heightCm'>,
) => {
  const bmi = profile.weightKg / Math.pow(profile.heightCm / 100, 2);
  const genderFactor: Record<Gender, number> = { male: 1, female: 0, other: 0.5 };
  return Math.max(5, Math.round(1.2 * bmi + 0.23 * profile.age - 10.8 * genderFactor[profile.gender] - 5.4));
};

export const calculateDailyCaloriesConsumed = (foodLogs: FoodLog[]) => {
  const today = getTodayKey();
  return foodLogs
    .filter((log) => log.loggedAt.startsWith(today))
    .reduce((sum, log) => sum + log.calories, 0);
};

export const calculateProgressPoints = (
  todayCalories: number,
  calorieGoal: number,
  didWorkoutToday: boolean,
  streakAwarded: boolean,
  missedYesterday: boolean,
) => {
  let points = 0;

  if (didWorkoutToday) {
    points += 20;
  }
  if (todayCalories >= calorieGoal && calorieGoal > 0) {
    points += 15;
  }
  if (streakAwarded) {
    points += 5;
  }
  if (missedYesterday) {
    points -= 5;
  }

  return Math.min(50, points);
};
