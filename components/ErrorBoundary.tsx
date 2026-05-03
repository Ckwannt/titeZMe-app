'use client';

import React, { Component, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1A1A1B] flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-8 p-4 bg-[#2A2A2B] rounded-2xl border border-[#3A3A3B] shadow-2xl">
            <h1 className="text-3xl font-black text-[#FFD700] uppercase tracking-tighter mb-2">titeZMe</h1>
          </div>
          <h2 className="text-2xl font-bold text-[#F0F0F0] mb-4">Something went wrong.</h2>
          <p className="text-[#a0a0a0] mb-8 text-lg">Try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#FFD700] text-[#1A1A1B] font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:bg-[#ffe55c] active:scale-95 transition-all"
          >
            Refresh
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
