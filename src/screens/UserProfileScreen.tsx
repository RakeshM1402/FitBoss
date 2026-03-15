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
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your Profile</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} />
          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput style={styles.input} value={weightKg} onChangeText={setWeightKg} keyboardType="numeric" />
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput style={styles.input} value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" />

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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Health metrics preview</Text>
          <Text style={styles.metric}>BMR: {preview.bmr}</Text>
          <Text style={styles.metric}>Daily calorie requirement: {preview.calories}</Text>
          <Text style={styles.metric}>Estimated body fat: {preview.bodyFat}%</Text>
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
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontWeight: '600',
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    backgroundColor: '#FBFCFD',
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
    backgroundColor: colors.surface,
  },
  pillActive: {
    backgroundColor: colors.primary,
  },
  pillText: {
    color: colors.primaryDark,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  pillTextActive: {
    color: '#FFF',
  },
  button: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    padding: spacing.md,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 14,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 18,
  },
  metric: {
    color: colors.muted,
    fontSize: 15,
  },
});
