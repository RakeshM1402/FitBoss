import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

interface ProgressChartProps {
  title: string;
  values: number[];
}

export const ProgressChart = ({ title, values }: ProgressChartProps) => {
  const max = Math.max(...values, 1);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        {values.map((value, index) => (
          <View key={`${title}-${index}`} style={styles.barWrap}>
            <View style={[styles.bar, { height: `${Math.max(8, (value / max) * 100)}%` }]} />
            <Text style={styles.caption}>{index + 1}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    gap: 8,
  },
  barWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  bar: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary,
    minHeight: 8,
  },
  caption: {
    color: colors.muted,
    fontSize: 11,
  },
});
