import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { ActivityLevel, Gender } from '../types';
import { colors, spacing } from '../theme';
import { calculateBmr, calculateDailyCalories, estimateBodyFat } from '../utils/calculations';
import { generateId } from '../utils/id';

const activityOptions: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'active', 'athlete'];
const genderOptions: Gender[] = ['male', 'female', 'other'];

export const UserProfileScreen = () => {
  const { state, saveProfile, logout } = useAppContext();
  const current = state.profile;
  const [username, setUsername] = useState(current?.username ?? 'FitBossUser');
  const [age, setAge] = useState(String(current?.age ?? 28));
  const [weightKg, setWeightKg] = useState(String(current?.weightKg ?? 70));
  const [heightCm, setHeightCm] = useState(String(current?.heightCm ?? 175));
  const [gender, setGender] = useState<Gender>(current?.gender ?? 'male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(current?.activityLevel ?? 'moderate');

  const preview = useMemo(() => {
    const draft = {
      age: Number(age),
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      gender,
      activityLevel,
    };

    return {
      bmr: calculateBmr(draft),
      calories: calculateDailyCalories(draft),
      bodyFat: estimateBodyFat(draft),
    };
  }, [activityLevel, age, gender, heightCm, weightKg]);

  const handleSave = () => {
    const parsedAge = Number(age);
    const parsedWeight = Number(weightKg);
    const parsedHeight = Number(heightCm);

    if (!username.trim() || !parsedAge || !parsedWeight || !parsedHeight) {
      Alert.alert('Missing data', 'Please fill in all profile fields.');
      return;
    }

    saveProfile({
      id: current?.id ?? state.sessionUserId ?? generateId(),
      email: state.sessionEmail ?? 'local@fitboss.app',
      username,
      age: parsedAge,
      weightKg: parsedWeight,
      heightCm: parsedHeight,
      gender,
      activityLevel,
      lastLoginDate: current?.lastLoginDate,
      onboarding: current?.onboarding ?? {
        primaryGoal: 'general_health',
        experienceLevel: 'beginner',
        workoutsPerWeek: 3,
        dietStyle: 'balanced',
        trainingLocation: 'Gym',
        discoverySource: 'search',
        motivation: 'I want to build sustainable fitness habits.',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your Profile</Text>
        <View style={styles.previewCard}>
          <View style={styles.previewStat}>
            <Text style={styles.previewLabel}>BMR</Text>
            <Text style={styles.previewValue}>{preview.bmr}</Text>
          </View>
          <View style={styles.previewStat}>
            <Text style={styles.previewLabel}>Daily goal</Text>
            <Text style={styles.previewValue}>{preview.calories}</Text>
          </View>
          <View style={styles.previewStat}>
            <Text style={styles.previewLabel}>Body fat</Text>
            <Text style={styles.previewValue}>{preview.bodyFat}%</Text>
          </View>
        </View>

        {current?.onboarding ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your coaching profile</Text>
            <Text style={styles.infoLine}>Goal: {current.onboarding.primaryGoal.replace(/_/g, ' ')}</Text>
            <Text style={styles.infoLine}>Experience: {current.onboarding.experienceLevel}</Text>
            <Text style={styles.infoLine}>Workouts per week: {current.onboarding.workoutsPerWeek}</Text>
            <Text style={styles.infoLine}>Diet: {current.onboarding.dietStyle.replace(/_/g, ' ')}</Text>
            <Text style={styles.infoLine}>Training location: {current.onboarding.trainingLocation}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholderTextColor={colors.muted} />
          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholderTextColor={colors.muted} />
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput style={styles.input} value={weightKg} onChangeText={setWeightKg} keyboardType="numeric" placeholderTextColor={colors.muted} />
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput style={styles.input} value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" placeholderTextColor={colors.muted} />

          <Text style={styles.label}>Gender</Text>
          <View style={styles.pillRow}>
            {genderOptions.map((option) => (
              <Pressable key={option} style={[styles.pill, gender === option && styles.pillActive]} onPress={() => setGender(option)}>
                <Text style={[styles.pillText, gender === option && styles.pillTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Activity level</Text>
          <View style={styles.pillRow}>
            {activityOptions.map((option) => (
              <Pressable
                key={option}
                style={[styles.pill, activityLevel === option && styles.pillActive]}
                onPress={() => setActivityLevel(option)}
              >
                <Text style={[styles.pillText, activityLevel === option && styles.pillTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Profile</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={logout}>
            <Text style={styles.secondaryButtonText}>Log Out</Text>
          </Pressable>
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
  previewCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  previewStat: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewLabel: {
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 11,
  },
  previewValue: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 20,
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontWeight: '700',
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.md,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
  },
  pillRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    color: colors.textSoft,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  pillTextActive: {
    color: '#FFF',
  },
  button: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 18,
    alignItems: 'center',
    padding: spacing.md,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '800',
  },
  secondaryButton: {
    borderRadius: 18,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.primarySoft,
    fontWeight: '800',
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  infoLine: {
    color: colors.textSoft,
  },
});
