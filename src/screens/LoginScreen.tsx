import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { colors, spacing } from '../theme';

export const LoginScreen = () => {
  const { loginAsGuest } = useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.orbLarge} />
      <View style={styles.orbSmall} />
      <View style={styles.heroCard}>
        <Text style={styles.kicker}>Gamified fitness command center</Text>
        <Text style={styles.title}>Fit Boss</Text>
        <Text style={styles.subtitle}>
          A dark-mode fitness tracker that feels sharper, more competitive, and easier to come back to every single day.
        </Text>
        <View style={styles.metricStrip}>
          <View style={styles.metricPill}>
            <Text style={styles.metricValue}>+50</Text>
            <Text style={styles.metricLabel}>daily cap</Text>
          </View>
          <View style={styles.metricPill}>
            <Text style={styles.metricValue}>7d</Text>
            <Text style={styles.metricLabel}>score loop</Text>
          </View>
          <View style={styles.metricPill}>
            <Text style={styles.metricValue}>1 app</Text>
            <Text style={styles.metricLabel}>track all</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Jump into Demo Mode</Text>
        <Text style={styles.cardText}>
          Explore the redesigned dashboard, workout mode, calorie system, and leaderboard flow instantly while sign-in is being polished.
        </Text>
        <Pressable style={styles.button} onPress={loginAsGuest}>
          <Text style={styles.buttonText}>Enter Fit Boss</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    padding: spacing.xl,
    overflow: 'hidden',
  },
  orbLarge: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(59,130,246,0.22)',
  },
  orbSmall: {
    position: 'absolute',
    bottom: 180,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(96,165,250,0.12)',
  },
  heroCard: {
    marginTop: 52,
    gap: spacing.md,
    backgroundColor: colors.overlay,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xxl,
  },
  kicker: {
    color: colors.primarySoft,
    fontWeight: '700',
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  title: {
    color: colors.text,
    fontSize: 46,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 17,
    lineHeight: 26,
  },
  metricStrip: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  metricPill: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  metricValue: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  cardText: {
    color: colors.textSoft,
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingVertical: spacing.md,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
