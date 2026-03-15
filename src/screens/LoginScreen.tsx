import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { colors, spacing } from '../theme';

export const LoginScreen = () => {
  const { loginWithGoogle, loginAsGuest } = useAppContext();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      Alert.alert('Login failed', 'Google sign-in could not be completed. Check your Supabase Google provider settings.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Offline-first fitness tracking</Text>
        <Text style={styles.title}>Fit Boss</Text>
        <Text style={styles.subtitle}>
          Track meals, workouts, daily scores, and leaderboards from one shared React Native codebase.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign in</Text>
        <Text style={styles.cardText}>Continue with Google to create your profile and sync across devices.</Text>
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={loginAsGuest}>
          <Text style={styles.secondaryButtonText}>Continue in Demo Mode</Text>
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
  },
  hero: {
    marginTop: 72,
    gap: spacing.md,
  },
  kicker: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontSize: 42,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  cardText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 16,
  },
});
