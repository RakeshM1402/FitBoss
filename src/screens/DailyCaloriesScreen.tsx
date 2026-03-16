import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { colors, spacing } from '../theme';
import { calculateDailyCaloriesConsumed } from '../utils/calculations';

export const DailyCaloriesScreen = () => {
  const { state } = useAppContext();
  const consumed = calculateDailyCaloriesConsumed(state.foodLogs);
  const goal = state.profile?.dailyCalorieGoal ?? 0;
  const todayKey = new Date().toISOString().split('T')[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Daily Calories</Text>
        <View style={styles.heroCard}>
          <Text style={styles.heroTag}>Fuel balance</Text>
          <Text style={styles.heroValue}>{consumed}</Text>
          <Text style={styles.heroLabel}>calories consumed today</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.min(100, goal ? (consumed / goal) * 100 : 0)}%` }]} />
          </View>
          <Text style={styles.goalText}>Goal: {goal} kcal</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Today&apos;s food log</Text>
          {state.foodLogs
            .filter((item) => item.loggedAt.startsWith(todayKey))
            .map((item) => (
              <View key={item.id} style={styles.row}>
                <Text style={styles.rowText}>{item.foodName}</Text>
                <Text style={styles.rowValue}>{item.calories} kcal</Text>
              </View>
            ))}
          {state.foodLogs.filter((item) => item.loggedAt.startsWith(todayKey)).length === 0 && (
            <Text style={styles.emptyText}>No calories logged today.</Text>
          )}
        </View>
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
  title: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 28,
  },
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 28,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.xl,
  },
  heroTag: {
    color: colors.primarySoft,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    fontWeight: '700',
    fontSize: 12,
  },
  heroValue: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  heroLabel: {
    color: colors.textSoft,
    fontSize: 16,
    marginTop: 4,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: colors.surfaceAlt,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  goalText: {
    marginTop: spacing.sm,
    color: colors.textSoft,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowText: {
    color: colors.text,
  },
  rowValue: {
    color: colors.primarySoft,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.muted,
  },
});
