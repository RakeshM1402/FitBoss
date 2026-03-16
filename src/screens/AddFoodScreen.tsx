import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';
import { fetchFoodNutrition } from '../services/openFoodFacts';
import { colors, spacing } from '../theme';

export const AddFoodScreen = () => {
  const { state, addFoodLog } = useAppContext();
  const [foodName, setFoodName] = useState('');
  const [grams, setGrams] = useState('100');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!state.profile) {
      Alert.alert('Profile required', 'Please complete your profile before logging food.');
      return;
    }

    if (!foodName.trim()) {
      Alert.alert('Food required', 'Enter a food name to search the nutrition database.');
      return;
    }

    try {
      setLoading(true);
      const nutrition = await fetchFoodNutrition(foodName, Number(grams));
      addFoodLog({
        userId: state.profile.id,
        foodName: nutrition.foodName,
        grams: Number(grams),
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        loggedAt: new Date().toISOString(),
        nutritionSource: nutrition.source,
      });
      setFoodName('');
      setGrams('100');
    } catch {
      Alert.alert('Nutrition lookup failed', 'Try a more specific food name or reconnect to the internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Add Food</Text>
        <View style={styles.heroCard}>
          <Text style={styles.heroTag}>Quick nutrition log</Text>
          <Text style={styles.heroText}>Search by food name, enter grams, and let Fit Boss estimate calories automatically.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Food name</Text>
          <TextInput
            style={styles.input}
            value={foodName}
            onChangeText={setFoodName}
            placeholder="Chicken breast"
            placeholderTextColor={colors.muted}
          />
          <Text style={styles.label}>Grams</Text>
          <TextInput
            style={styles.input}
            value={grams}
            onChangeText={setGrams}
            keyboardType="numeric"
            placeholder="100"
            placeholderTextColor={colors.muted}
          />
          <Pressable style={styles.button} onPress={handleAdd} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Calculating...' : 'Fetch Nutrition & Save'}</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent entries</Text>
          {state.foodLogs.slice(0, 5).map((log) => (
            <View key={log.id} style={styles.row}>
              <View style={styles.rowCopy}>
                <Text style={styles.foodName}>{log.foodName}</Text>
                <Text style={styles.meta}>{log.grams}g | {log.protein}P / {log.carbs}C / {log.fat}F</Text>
                {log.nutritionSource ? <Text style={styles.source}>Source: {log.nutritionSource}</Text> : null}
              </View>
              <Text style={styles.calories}>{log.calories} kcal</Text>
            </View>
          ))}
          {state.foodLogs.length === 0 && <Text style={styles.emptyText}>No food logs yet.</Text>}
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
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  heroCard: {
    backgroundColor: colors.card,
    borderRadius: 26,
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
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
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
  button: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 18,
    alignItems: 'center',
    padding: spacing.md,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '800',
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowCopy: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  foodName: {
    color: colors.text,
    fontWeight: '700',
  },
  meta: {
    color: colors.textSoft,
    marginTop: 4,
  },
  source: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 12,
  },
  calories: {
    color: colors.primarySoft,
    fontWeight: '800',
  },
  emptyText: {
    color: colors.muted,
  },
});
