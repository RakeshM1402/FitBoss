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
        <View style={styles.heroCard}>
          <Text style={styles.overline}>Daily command</Text>
          <Text style={styles.title}>Welcome back, {profile.username}</Text>
          <Text style={styles.subtitle}>
            {state.isOnline ? 'Cloud sync armed' : 'Offline mode active'} | {state.pendingSync.length} pending sync item(s)
          </Text>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroLabel}>Calories</Text>
              <Text style={styles.heroValue}>{caloriesConsumed}</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroLabel}>Score</Text>
              <Text style={styles.heroValue}>{totalScore}</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroLabel}>Streak</Text>
              <Text style={styles.heroValue}>{profile.streakCount}</Text>
            </View>
          </View>
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
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.xs,
  },
  overline: {
    color: colors.primarySoft,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
    fontSize: 12,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 14,
    lineHeight: 21,
  },
  heroStats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  heroStat: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  heroLabel: {
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 11,
  },
  heroValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
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
    fontWeight: '800',
  },
  emptyText: {
    marginTop: spacing.sm,
    color: colors.textSoft,
    fontSize: 16,
    lineHeight: 24,
  },
});
