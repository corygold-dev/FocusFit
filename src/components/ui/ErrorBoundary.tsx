import { useTheme } from '@/src/providers/ThemeProvider';
import React, { Component, ReactNode } from 'react';
import { Text, View } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error }: { error?: Error }) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: theme.colors.background,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: theme.colors.text,
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        Something went wrong
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: theme.colors.textSecondary,
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        Please restart the app to continue
      </Text>
      {__DEV__ && error && (
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.error,
            textAlign: 'center',
            fontFamily: 'monospace',
          }}
        >
          {error.message}
        </Text>
      )}
    </View>
  );
}

export default function ErrorBoundary(props: Props) {
  return <ErrorBoundaryClass {...props} />;
}
