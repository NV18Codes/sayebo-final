
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sayebo-pink-50 to-sayebo-orange-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <AlertTriangle className="w-16 h-16 text-sayebo-orange-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">We're sorry for the inconvenience. Please refresh the page or try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-sayebo-pink-500 to-sayebo-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-sayebo-pink-600 hover:to-sayebo-orange-600 transition-all duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
