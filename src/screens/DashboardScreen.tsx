import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressChart } from '../components/ProgressChart';
import { StatCard } from '../components/StatCard';
import { useAppContext } from '../context/AppContext';
import { colors, spacing } from '../theme';
import { calculateBmr, calculateDailyCaloriesConsumed } from '../utils/calculations';

export const DashboardScreen = () => {
  const { state } = useAppContext();
  const profile = state.profile;

  if (!profile) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Complete your profile</Text>
        <Text style={styles.emptyText}>Add your age, height, weight, gender, and activity level in Profile to unlock your dashboard.</Text>
      </SafeAreaView>
    );
  }

  const caloriesConsumed = calculateDailyCaloriesConsumed(state.foodLogs);
  const totalScore = state.scoreEntries.reduce((sum, entry) => sum + entry.points, 0);
  const recentScores = state.scoreEntries.slice(0, 7).map((entry) => entry.points).reverse();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome, {profile.username}</Text>
          <Text style={styles.subtitle}>
            {state.isOnline ? 'Online sync ready' : 'Offline mode active'} • {state.pendingSync.length} pending sync item(s)
          </Text>
        </View>

        <View style={styles.grid}>
          <StatCard label="Calories Today" value={`${caloriesConsumed}`} />
          <StatCard label="Goal" value={`${profile.dailyCalorieGoal}`} accent={colors.warning} />
        </View>

        <View style={styles.grid}>
          <StatCard label="BMR" value={`${calculateBmr(profile)}`} accent={colors.primaryDark} />
          <StatCard label="Body Fat" value={`${profile.bodyFatEstimate}%`} accent={colors.success} />
        </View>

        <View style={styles.grid}>
          <StatCard label="Streak" value={`${profile.streakCount} days`} />
          <StatCard label="Fitness Score" value={`${totalScore}`} accent={colors.danger} />
        </View>

        <ProgressChart title="Last 7 Score Entries" values={recentScores.length ? recentScores : [0, 0, 0, 0, 0, 0, 0]} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  emptyText: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 24,
  },
});
