export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
export type QueueAction = 'upsert_food_log' | 'upsert_workout' | 'upsert_profile' | 'upsert_score';

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
