import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import Button from './ui/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: '24px',
          padding: '40px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--color-danger-bg)',
            border: '1px solid hsla(0,72%,58%,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-danger)',
          }}>
            <FiAlertTriangle size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Something went wrong
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', maxWidth: '400px' }}>
              An unexpected error occurred. Please try refreshing this section.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre style={{
                marginTop: '12px',
                padding: '12px',
                background: 'var(--color-bg-tertiary)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--color-danger)',
                textAlign: 'left',
                maxWidth: '500px',
                overflow: 'auto',
              }}>
                {this.state.error.toString()}
              </pre>
            )}
          </div>
          <Button
            variant="secondary"
            icon={FiRefreshCw}
            onClick={this.handleRetry}
          >
            Try Again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
