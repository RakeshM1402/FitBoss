import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { ActivityLevel, DietStyle, DiscoverySource, ExperienceLevel, FitnessGoal, Gender } from '../types';
import { colors, spacing } from '../theme';
import { generateId } from '../utils/id';

const goalOptions: FitnessGoal[] = ['lose_weight', 'maintain', 'gain_muscle', 'improve_endurance', 'general_health'];
const experienceOptions: ExperienceLevel[] = ['beginner', 'intermediate', 'advanced'];
const dietOptions: DietStyle[] = ['balanced', 'high_protein', 'vegetarian', 'vegan', 'keto', 'other'];
const sourceOptions: DiscoverySource[] = ['instagram', 'youtube', 'friend', 'trainer', 'search', 'other'];
const activityOptions: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'active', 'athlete'];
const genderOptions: Gender[] = ['male', 'female', 'other'];

const labelize = (value: string) => value.replace(/_/g, ' ');

export const OnboardingSurveyScreen = () => {
  const { state, saveProfile } = useAppContext();
  const [username, setUsername] = useState('FitBossUser');
  const [age, setAge] = useState('25');
  const [weightKg, setWeightKg] = useState('70');
  const [heightCm, setHeightCm] = useState('175');
  const [gender, setGender] = useState<Gender>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>('lose_weight');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('beginner');
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState('4');
  const [dietStyle, setDietStyle] = useState<DietStyle>('balanced');
  const [trainingLocation, setTrainingLocation] = useState('Gym');
  const [discoverySource, setDiscoverySource] = useState<DiscoverySource>('search');
  const [motivation, setMotivation] = useState('I want a fitness coach that keeps me consistent.');

  const handleSave = () => {
    if (!username.trim() || !age || !weightKg || !heightCm || !workoutsPerWeek.trim() || !trainingLocation.trim() || !motivation.trim()) {
      Alert.alert('Survey incomplete', 'Please answer the onboarding questions before continuing.');
      return;
    }

    saveProfile({
      id: state.sessionUserId ?? generateId(),
      email: state.sessionEmail ?? 'local@fitboss.app',
      username,
      age: Number(age),
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      gender,
      activityLevel,
      lastLoginDate: undefined,
      onboarding: {
        primaryGoal,
        experienceLevel,
        workoutsPerWeek: Number(workoutsPerWeek),
        dietStyle,
        trainingLocation,
        discoverySource,
        motivation,
      },
    });
  };

  const renderChoiceRow = <T extends string,>(title: string, options: T[], value: T, onChange: (next: T) => void) => (
    <View style={styles.block}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.pillRow}>
        {options.map((option) => (
          <Pressable key={option} style={[styles.pill, value === option && styles.pillActive]} onPress={() => onChange(option)}>
            <Text style={[styles.pillText, value === option && styles.pillTextActive]}>{labelize(option)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.overline}>Coach intake</Text>
        <Text style={styles.title}>Let Fit Boss learn your plan</Text>
        <Text style={styles.subtitle}>Answer these questions like you would with a trainer so we can personalize calories, workout rhythm, and progress goals.</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic stats</Text>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} placeholderTextColor={colors.muted} />
          <Text style={styles.label}>Age</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholderTextColor={colors.muted} />
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput style={styles.input} value={weightKg} onChangeText={setWeightKg} keyboardType="numeric" placeholderTextColor={colors.muted} />
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput style={styles.input} value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" placeholderTextColor={colors.muted} />
          {renderChoiceRow('Gender', genderOptions, gender, setGender)}
          {renderChoiceRow('Activity level', activityOptions, activityLevel, setActivityLevel)}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Trainer questions</Text>
          {renderChoiceRow('What is your main goal?', goalOptions, primaryGoal, setPrimaryGoal)}
          {renderChoiceRow('How experienced are you?', experienceOptions, experienceLevel, setExperienceLevel)}
          {renderChoiceRow('How do you usually eat?', dietOptions, dietStyle, setDietStyle)}
          {renderChoiceRow('Where did you hear about us?', sourceOptions, discoverySource, setDiscoverySource)}

          <Text style={styles.label}>How many workouts per week can you realistically do?</Text>
          <TextInput style={styles.input} value={workoutsPerWeek} onChangeText={setWorkoutsPerWeek} keyboardType="numeric" placeholderTextColor={colors.muted} />

          <Text style={styles.label}>Where do you usually train?</Text>
          <TextInput style={styles.input} value={trainingLocation} onChangeText={setTrainingLocation} placeholder="Gym, home, park..." placeholderTextColor={colors.muted} />

          <Text style={styles.label}>Why does this goal matter to you?</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={motivation}
            onChangeText={setMotivation}
            multiline
            placeholder="I want more energy, confidence, and consistency."
            placeholderTextColor={colors.muted}
          />
        </View>

        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Create My Plan</Text>
        </Pressable>
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
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  block: {
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
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
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
    color: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
});
