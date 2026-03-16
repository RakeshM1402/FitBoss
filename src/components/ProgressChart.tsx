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
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.badge}>7d</Text>
      </View>
      <View style={styles.row}>
        {values.map((value, index) => (
          <View key={`${title}-${index}`} style={styles.barWrap}>
            <View style={styles.track}>
              <View style={[styles.bar, { height: `${Math.max(8, (value / max) * 100)}%` }]} />
            </View>
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
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  badge: {
    color: colors.primarySoft,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
    fontSize: 11,
    fontWeight: '700',
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
  track: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    justifyContent: 'flex-end',
    backgroundColor: colors.surfaceAlt,
    padding: 4,
  },
  bar: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary,
    minHeight: 8,
  },
  caption: {
    color: colors.textSoft,
    fontSize: 11,
  },
});
