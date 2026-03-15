import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../types';

const STORAGE_KEY = 'fitboss_state_v1';

export const loadAppState = async (): Promise<Partial<AppState>> => {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  return value ? JSON.parse(value) : {};
};

export const saveAppState = async (state: Partial<AppState>) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
