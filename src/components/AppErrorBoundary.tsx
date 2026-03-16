import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

interface State {
  hasError: boolean;
  message?: string;
}

export class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message,
    };
  }

  componentDidCatch(error: Error) {
    console.error('App startup error:', error);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, message: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Fit Boss hit a startup error</Text>
            <Text style={styles.text}>
              The app stayed open instead of crashing so we can recover more safely. Try reopening once, or reinstall the latest APK.
            </Text>
            {this.state.message ? <Text style={styles.code}>{this.state.message}</Text> : null}
            <Pressable style={styles.button} onPress={this.handleRetry}>
              <Text style={styles.buttonText}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  text: {
    color: colors.muted,
    lineHeight: 22,
  },
  code: {
    color: colors.danger,
    fontSize: 13,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    padding: spacing.md,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
  },
});
