import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const ProblemChild: React.FC<{ shouldThrow: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Simulated couture drape crash');
  }
  return <div>Harmonious Couture Display</div>;
};

describe('ErrorBoundary Component', () => {
  // Suppress console.error in test logs for intentional errors
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });
  afterEach(() => {
    console.error = originalError;
  });

  it('renders children normally when no exception is thrown', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Harmonious Couture Display')).toBeInTheDocument();
  });

  it('catches runtime exceptions and displays fallback UI with error message', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('An Unexpected Disruption')).toBeInTheDocument();
    expect(screen.getByText('Simulated couture drape crash')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /storefront/i })).toBeInTheDocument();
  });

  it('renders custom fallback if provided in props', () => {
    render(
      <ErrorBoundary fallback={<div>Custom Atelier Error Screen</div>}>
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Atelier Error Screen')).toBeInTheDocument();
  });
});
