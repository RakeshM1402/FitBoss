import React, { useEffect, useRef, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { colors, spacing } from '../theme';

const spotifyPlaylist = 'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP';
const youtubeMusicPlaylist = 'https://music.youtube.com/playlist?list=PL4fGSI1pDJn5AQ9aWLM4f0dpyl35Y8j0j';

export const WorkoutModeScreen = () => {
  const { state, addWorkout } = useAppContext();
  const [workoutType, setWorkoutType] = useState('Strength Training');
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running]);

  const handleComplete = () => {
    if (!state.profile) {
      Alert.alert('Profile required', 'Please complete your profile before logging workouts.');
      return;
    }

    addWorkout({
      userId: state.profile.id,
      workoutType,
      durationSeconds: seconds,
      completedAt: new Date().toISOString(),
    });
    setRunning(false);
    setSeconds(0);
    Alert.alert('Workout saved', 'This session will contribute points in your daily score.');
  };

  const openPlaylist = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainder = String(seconds % 60).padStart(2, '0');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Workout Mode</Text>
        <View style={styles.timerCard}>
          <Text style={styles.timerLabel}>Workout timer</Text>
          <Text style={styles.timerValue}>{minutes}:{remainder}</Text>
          <TextInput style={styles.input} value={workoutType} onChangeText={setWorkoutType} />
          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={() => setRunning((current) => !current)}>
              <Text style={styles.primaryButtonText}>{running ? 'Pause' : 'Start'}</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={handleComplete}>
              <Text style={styles.secondaryButtonText}>Complete</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Workout music</Text>
          <Text style={styles.sectionText}>Open a playlist while training and let the timer keep tracking in the app.</Text>
          <Pressable style={styles.linkButton} onPress={() => openPlaylist(spotifyPlaylist)}>
            <Text style={styles.linkButtonText}>Open Spotify Playlist</Text>
          </Pressable>
          <Pressable style={styles.linkButton} onPress={() => openPlaylist(youtubeMusicPlaylist)}>
            <Text style={styles.linkButtonText}>Open YouTube Music Playlist</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent workouts</Text>
          {state.workouts.slice(0, 5).map((workout) => (
            <View style={styles.row} key={workout.id}>
              <Text style={styles.rowTitle}>{workout.workoutType}</Text>
              <Text style={styles.rowValue}>{Math.round(workout.durationSeconds / 60)} min</Text>
            </View>
          ))}
          {state.workouts.length === 0 && <Text style={styles.emptyText}>No workouts logged yet.</Text>}
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
  timerCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.md,
  },
  timerLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  timerValue: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 44,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    backgroundColor: '#FBFCFD',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: spacing.md,
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 18,
  },
  sectionText: {
    color: colors.muted,
    lineHeight: 20,
  },
  linkButton: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
  },
  linkButtonText: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowTitle: {
    color: colors.text,
  },
  rowValue: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.muted,
  },
});
