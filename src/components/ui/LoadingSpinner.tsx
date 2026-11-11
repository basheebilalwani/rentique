import React from 'react';
import { cn } from '@/utils/cn';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  label = 'Loading...',
}) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)} role="status">
      <div
        className={cn(
          'rounded-full animate-spin border-brand-200 border-t-brand-600',
          sizes[size]
        )}
      />
      <span className="sr-only">{label}</span>
      {label && size === 'lg' && (
        <p className="text-xs uppercase tracking-widest text-charcoal-500 font-medium">{label}</p>
      )}
    </div>
  );
};
