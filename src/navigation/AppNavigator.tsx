import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import { useOfflineSync } from '../hooks/useOfflineSync';
import { colors } from '../theme';
import { LoginScreen } from '../screens/LoginScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AddFoodScreen } from '../screens/AddFoodScreen';
import { DailyCaloriesScreen } from '../screens/DailyCaloriesScreen';
import { WorkoutModeScreen } from '../screens/WorkoutModeScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { UserProfileScreen } from '../screens/UserProfileScreen';
import { OnboardingSurveyScreen } from '../screens/OnboardingSurveyScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    primary: colors.primary,
    card: colors.card,
    text: colors.text,
    border: colors.border,
  },
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primarySoft,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: {
        height: 72,
        paddingBottom: 10,
        paddingTop: 8,
        backgroundColor: colors.surfaceAlt,
        borderTopColor: colors.border,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '700',
      },
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          Dashboard: 'home-outline',
          Food: 'nutrition-outline',
          Calories: 'flame-outline',
          Workout: 'barbell-outline',
          Leaderboard: 'trophy-outline',
          Profile: 'person-outline',
        };

        return <Ionicons name={icons[route.name]} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Food" component={AddFoodScreen} />
    <Tab.Screen name="Calories" component={DailyCaloriesScreen} />
    <Tab.Screen name="Workout" component={WorkoutModeScreen} />
    <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
    <Tab.Screen name="Profile" component={UserProfileScreen} />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  const { state, hydrateDailyScore } = useAppContext();
  useOfflineSync();

  useEffect(() => {
    if (state.isAuthenticated) {
      hydrateDailyScore();
    }
  }, [hydrateDailyScore, state.isAuthenticated]);

  return (
    <NavigationContainer theme={appTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {state.isAuthenticated ? (
          state.profile?.onboarding ? (
            <Stack.Screen name="MainTabs" component={MainTabs} />
          ) : (
            <Stack.Screen name="Onboarding" component={OnboardingSurveyScreen} />
          )
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
