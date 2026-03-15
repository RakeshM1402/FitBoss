import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { colors, spacing } from '../theme';

export const LeaderboardScreen = () => {
  const { state } = useAppContext();
  const [mode, setMode] = useState<'weekly' | 'allTime'>('weekly');
  const items = mode === 'weekly' ? state.weeklyLeaderboard : state.allTimeLeaderboard;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.toggleWrap}>
          <Pressable style={[styles.toggle, mode === 'weekly' && styles.toggleActive]} onPress={() => setMode('weekly')}>
            <Text style={[styles.toggleText, mode === 'weekly' && styles.toggleTextActive]}>Weekly</Text>
          </Pressable>
          <Pressable style={[styles.toggle, mode === 'allTime' && styles.toggleActive]} onPress={() => setMode('allTime')}>
            <Text style={[styles.toggleText, mode === 'allTime' && styles.toggleTextActive]}>All Time</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          {items.map((item) => (
            <View key={`${mode}-${item.rank}-${item.username}`} style={styles.row}>
              <Text style={styles.rank}>#{item.rank}</Text>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.score}>{item.fitnessScore}</Text>
            </View>
          ))}
          {items.length === 0 && (
            <Text style={styles.emptyText}>No leaderboard data yet. Rankings will appear after online sync.</Text>
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
    fontSize: 28,
    fontWeight: '800',
  },
  toggleWrap: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 4,
    borderRadius: 16,
  },
  toggle: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.card,
  },
  toggleText: {
    color: colors.muted,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.primaryDark,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rank: {
    width: 56,
    color: colors.primaryDark,
    fontWeight: '800',
  },
  username: {
    flex: 1,
    color: colors.text,
    fontWeight: '600',
  },
  score: {
    color: colors.text,
    fontWeight: '800',
  },
  emptyText: {
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
