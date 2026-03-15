import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { AppState, FitnessScoreEntry, FoodLog, LeaderboardEntry, PendingSyncItem, UserProfile, WorkoutLog } from '../types';
import { loadAppState, saveAppState } from '../services/storage';
import { supabase } from '../services/supabase';
import { calculateDailyCalories, calculateDailyCaloriesConsumed, calculateProgressPoints, estimateBodyFat } from '../utils/calculations';
import { sameCalendarDay, getTodayKey, getYesterdayKey } from '../utils/date';
import { generateId } from '../utils/id';

WebBrowser.maybeCompleteAuthSession();
const authRedirectPath = 'auth/callback';

const getRedirectUri = () =>
  makeRedirectUri({
    scheme: 'fitboss',
    path: authRedirectPath,
  });

const extractSessionTokens = (url: string) => {
  const normalized = url.replace('#', '?');
  const parsed = Linking.parse(normalized);

  return {
    accessToken: parsed.queryParams?.access_token as string | undefined,
    refreshToken: parsed.queryParams?.refresh_token as string | undefined,
  };
};

const initialState: AppState = {
  isOnline: true,
  isAuthenticated: false,
  foodLogs: [],
  workouts: [],
  scoreEntries: [],
  weeklyLeaderboard: [],
  allTimeLeaderboard: [],
  pendingSync: [],
};

interface AppContextValue {
  state: AppState;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  saveProfile: (profile: Omit<UserProfile, 'dailyCalorieGoal' | 'bodyFatEstimate' | 'streakCount'>) => void;
  addFoodLog: (log: Omit<FoodLog, 'id' | 'synced'>) => void;
  addWorkout: (log: Omit<WorkoutLog, 'id' | 'synced'>) => void;
  addScoreEntry: (entry: Omit<FitnessScoreEntry, 'id' | 'synced'>) => void;
  replacePendingSync: (queue: PendingSyncItem[]) => void;
  setLeaderboards: (weekly: LeaderboardEntry[], allTime: LeaderboardEntry[]) => void;
  hydrateDailyScore: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const createQueueItem = (action: PendingSyncItem['action'], payload: PendingSyncItem['payload']): PendingSyncItem => ({
  id: generateId(),
  action,
  payload,
  createdAt: new Date().toISOString(),
});

export const AppProvider = ({ children }: React.PropsWithChildren) => {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    const hydrate = async () => {
      const stored = await loadAppState();
      setState((current) => ({ ...current, ...stored }));
    };

    void hydrate();
  }, []);

  useEffect(() => {
    void saveAppState(state);
  }, [state]);

  useEffect(() => {
    const subscription = NetInfo.addEventListener((netState) => {
      setState((current) => ({ ...current, isOnline: Boolean(netState.isConnected) }));
    });

    return () => subscription();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const redirectTo = getRedirectUri();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    if (error) {
      throw error;
    }

    if (!data?.url) {
      return;
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (result.type !== 'success' || !result.url) {
      return;
    }

    const { accessToken, refreshToken } = extractSessionTokens(result.url);

    if (!accessToken || !refreshToken) {
      return;
    }

    const { data: sessionData } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    setState((current) => ({
      ...current,
      isAuthenticated: true,
      sessionEmail: sessionData.session?.user.email,
      sessionUserId: sessionData.session?.user.id,
    }));
  }, []);

  const logout = useCallback(() => {
    setState((current) => ({
      ...current,
      isAuthenticated: false,
      sessionEmail: undefined,
      sessionUserId: undefined,
    }));
  }, []);

  const loginAsGuest = useCallback(() => {
    setState((current) => ({
      ...current,
      isAuthenticated: true,
      sessionEmail: 'guest@fitboss.app',
      sessionUserId: current.sessionUserId ?? generateId(),
    }));
  }, []);

  const saveProfileHandler = useCallback((profile: Omit<UserProfile, 'dailyCalorieGoal' | 'bodyFatEstimate' | 'streakCount'>) => {
    const derivedProfile: UserProfile = {
      ...profile,
      dailyCalorieGoal: calculateDailyCalories(profile),
      bodyFatEstimate: estimateBodyFat(profile),
      streakCount: state.profile?.streakCount ?? 0,
    };

    setState((current) => ({
      ...current,
      profile: derivedProfile,
      isAuthenticated: true,
      pendingSync: [...current.pendingSync, createQueueItem('upsert_profile', derivedProfile)],
    }));
  }, [state.profile?.streakCount]);

  const addFoodLog = useCallback((log: Omit<FoodLog, 'id' | 'synced'>) => {
    const item: FoodLog = { ...log, id: generateId(), synced: false };
    setState((current) => ({
      ...current,
      foodLogs: [item, ...current.foodLogs],
      pendingSync: [...current.pendingSync, createQueueItem('upsert_food_log', item)],
    }));
  }, []);

  const addWorkout = useCallback((log: Omit<WorkoutLog, 'id' | 'synced'>) => {
    const item: WorkoutLog = { ...log, id: generateId(), synced: false };
    setState((current) => ({
      ...current,
      workouts: [item, ...current.workouts],
      pendingSync: [...current.pendingSync, createQueueItem('upsert_workout', item)],
    }));
  }, []);

  const addScoreEntry = useCallback((entry: Omit<FitnessScoreEntry, 'id' | 'synced'>) => {
    const item: FitnessScoreEntry = { ...entry, id: generateId(), synced: false };
    setState((current) => ({
      ...current,
      scoreEntries: [item, ...current.scoreEntries],
      pendingSync: [...current.pendingSync, createQueueItem('upsert_score', item)],
    }));
  }, []);

  const replacePendingSync = useCallback((queue: PendingSyncItem[]) => {
    setState((current) => ({
      ...current,
      pendingSync: queue,
      foodLogs: current.foodLogs.map((item) => ({ ...item, synced: !queue.some((q) => q.payload.id === item.id) })),
      workouts: current.workouts.map((item) => ({ ...item, synced: !queue.some((q) => q.payload.id === item.id) })),
      scoreEntries: current.scoreEntries.map((item) => ({ ...item, synced: !queue.some((q) => q.payload.id === item.id) })),
    }));
  }, []);

  const setLeaderboards = useCallback((weekly: LeaderboardEntry[], allTime: LeaderboardEntry[]) => {
    setState((current) => ({ ...current, weeklyLeaderboard: weekly, allTimeLeaderboard: allTime }));
  }, []);

  const hydrateDailyScore = useCallback(() => {
    if (!state.profile) {
      return;
    }

    const today = getTodayKey();
    const alreadyLogged = state.scoreEntries.some((entry) => entry.date === today && entry.reason === 'daily_rollup');
    if (alreadyLogged) {
      return;
    }

    const consumed = calculateDailyCaloriesConsumed(state.foodLogs);
    const didWorkoutToday = state.workouts.some((item) => item.completedAt.startsWith(today));
    const streakAwarded = state.profile.lastLoginDate !== today;
    const missedYesterday = Boolean(state.profile.lastLoginDate) && !sameCalendarDay(state.profile.lastLoginDate!, getYesterdayKey());
    const points = calculateProgressPoints(
      consumed,
      state.profile.dailyCalorieGoal,
      didWorkoutToday,
      streakAwarded,
      missedYesterday,
    );

    const updatedProfile: UserProfile = {
      ...state.profile,
      lastLoginDate: today,
      streakCount: streakAwarded ? state.profile.streakCount + 1 : state.profile.streakCount,
    };

    setState((current) => ({
      ...current,
      profile: updatedProfile,
      pendingSync: [...current.pendingSync, createQueueItem('upsert_profile', updatedProfile)],
    }));

    addScoreEntry({
      userId: updatedProfile.id,
      date: today,
      points,
      reason: 'daily_rollup',
    });
  }, [addScoreEntry, state.foodLogs, state.profile, state.scoreEntries, state.workouts]);

  const value = useMemo(
    () => ({
      state,
      loginWithGoogle,
      loginAsGuest,
      logout,
      saveProfile: saveProfileHandler,
      addFoodLog,
      addWorkout,
      addScoreEntry,
      replacePendingSync,
      setLeaderboards,
      hydrateDailyScore,
    }),
    [addFoodLog, addScoreEntry, addWorkout, hydrateDailyScore, loginAsGuest, loginWithGoogle, logout, replacePendingSync, saveProfileHandler, setLeaderboards, state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
