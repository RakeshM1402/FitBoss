export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
export type QueueAction = 'upsert_food_log' | 'upsert_workout' | 'upsert_profile' | 'upsert_score';
export type FitnessGoal = 'lose_weight' | 'maintain' | 'gain_muscle' | 'improve_endurance' | 'general_health';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type DietStyle = 'balanced' | 'high_protein' | 'vegetarian' | 'vegan' | 'keto' | 'other';
export type DiscoverySource = 'instagram' | 'youtube' | 'friend' | 'trainer' | 'search' | 'other';

export interface OnboardingAnswers {
  primaryGoal: FitnessGoal;
  experienceLevel: ExperienceLevel;
  workoutsPerWeek: number;
  dietStyle: DietStyle;
  trainingLocation: string;
  discoverySource: DiscoverySource;
  motivation: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  age: number;
  weightKg: number;
  heightCm: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  dailyCalorieGoal: number;
  bodyFatEstimate: number;
  streakCount: number;
  lastLoginDate?: string;
  onboarding: OnboardingAnswers;
}

export interface FoodLog {
  id: string;
  userId: string;
  foodName: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAt: string;
  synced: boolean;
  nutritionSource?: string;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  workoutType: string;
  durationSeconds: number;
  completedAt: string;
  synced: boolean;
}

export interface FitnessScoreEntry {
  id: string;
  userId: string;
  date: string;
  points: number;
  reason: string;
  synced: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  fitnessScore: number;
}

export interface PendingSyncItem {
  id: string;
  action: QueueAction;
  payload: FoodLog | WorkoutLog | UserProfile | FitnessScoreEntry;
  createdAt: string;
}

export interface AppState {
  sessionEmail?: string;
  sessionUserId?: string;
  isOnline: boolean;
  isAuthenticated: boolean;
  profile?: UserProfile;
  foodLogs: FoodLog[];
  workouts: WorkoutLog[];
  scoreEntries: FitnessScoreEntry[];
  weeklyLeaderboard: LeaderboardEntry[];
  allTimeLeaderboard: LeaderboardEntry[];
  pendingSync: PendingSyncItem[];
}
