import React from 'react';
import { cn } from '@/utils/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  ...props
}) => {
  const variants = {
    rectangular: 'rounded-luxury',
    circular: 'rounded-full',
    text: 'rounded h-4 w-full',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-champagne-200/70',
        variants[variant],
        className
      )}
      {...props}
    />
  );
};
