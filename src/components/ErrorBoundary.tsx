import React from 'react';

type State = { hasError: boolean; error?: Error };

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In a real app you'd log to a service here
    // console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: '#ffdede', background: 'rgba(40,20,20,0.6)', borderRadius: 8 }}>
          <h2 style={{ color: '#ffb4b4' }}>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#ffdede' }}>{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
