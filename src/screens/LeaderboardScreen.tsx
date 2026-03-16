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
        <View style={styles.heroCard}>
          <Text style={styles.heroTag}>Competitive pulse</Text>
          <Text style={styles.heroText}>Climb the weekly board, protect your streak, and turn calorie discipline into ranking momentum.</Text>
        </View>

        <View style={styles.toggleWrap}>
          <Pressable style={[styles.toggle, mode === 'weekly' && styles.toggleActive]} onPress={() => setMode('weekly')}>
            <Text style={[styles.toggleText, mode === 'weekly' && styles.toggleTextActive]}>Weekly</Text>
          </Pressable>
          <Pressable style={[styles.toggle, mode === 'allTime' && styles.toggleActive]} onPress={() => setMode('allTime')}>
            <Text style={[styles.toggleText, mode === 'allTime' && styles.toggleTextActive]}>All Time</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          {items.map((item, index) => (
            <View key={`${mode}-${item.rank}-${item.username}`} style={styles.row}>
              <View style={[styles.rankBubble, index === 0 && styles.rankBubbleTop]}>
                <Text style={styles.rank}>#{item.rank}</Text>
              </View>
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
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  heroTag: {
    color: colors.primarySoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    fontSize: 12,
  },
  heroText: {
    color: colors.textSoft,
    lineHeight: 21,
  },
  toggleWrap: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    padding: 4,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toggle: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: colors.cardElevated,
  },
  toggleText: {
    color: colors.muted,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: colors.primarySoft,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 24,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rankBubble: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rankBubbleTop: {
    borderColor: colors.warning,
  },
  rank: {
    color: colors.primarySoft,
    fontWeight: '800',
  },
  username: {
    flex: 1,
    color: colors.text,
    fontWeight: '700',
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
