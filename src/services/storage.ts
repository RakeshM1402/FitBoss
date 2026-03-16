import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../types';

const STORAGE_KEY = 'fitboss_state_v1';

export const loadAppState = async (): Promise<Partial<AppState>> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : {};
  } catch (error) {
    console.warn('Failed to load saved app state, clearing local cache.', error);
    await AsyncStorage.removeItem(STORAGE_KEY);
    return {};
  }
};

export const saveAppState = async (state: Partial<AppState>) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to persist app state.', error);
  }
};
