import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    ErrorBoundaryState
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '40px',
                    backgroundColor: '#1a1a2e',
                    color: '#e94560',
                    minHeight: '100vh',
                    fontFamily: 'monospace',
                }}>
                    <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
                        ⚠️ React Runtime Error
                    </h1>
                    <pre style={{
                        backgroundColor: '#16213e',
                        padding: '16px',
                        borderRadius: '8px',
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        color: '#e94560',
                    }}>
                        {this.state.error?.message}
                    </pre>
                    <pre style={{
                        backgroundColor: '#16213e',
                        padding: '16px',
                        borderRadius: '8px',
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        color: '#a0a0a0',
                        marginTop: '8px',
                        fontSize: '12px',
                    }}>
                        {this.state.error?.stack}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}
