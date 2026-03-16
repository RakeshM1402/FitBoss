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
          <Text style={styles.timerLabel}>Session timer</Text>
          <Text style={styles.timerValue}>{minutes}:{remainder}</Text>
          <TextInput
            style={styles.input}
            value={workoutType}
            onChangeText={setWorkoutType}
            placeholder="Workout type"
            placeholderTextColor={colors.muted}
          />
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
          <Text style={styles.sectionText}>Jump into a playlist without breaking the pace of your session.</Text>
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
    borderRadius: 28,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.xl,
    gap: spacing.md,
  },
  timerLabel: {
    color: colors.primarySoft,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  timerValue: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 46,
  },
  input: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: spacing.md,
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: spacing.md,
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  primaryButtonText: {
    color: '#FFF',
    fontWeight: '800',
  },
  secondaryButtonText: {
    color: colors.primarySoft,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 18,
  },
  sectionText: {
    color: colors.textSoft,
    lineHeight: 20,
  },
  linkButton: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkButtonText: {
    color: colors.primarySoft,
    fontWeight: '800',
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
    color: colors.primarySoft,
    fontWeight: '800',
  },
  emptyText: {
    color: colors.muted,
  },
});
