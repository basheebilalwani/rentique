import React from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverable = false,
  padding = 'md',
  children,
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'bg-white rounded-luxury border border-champagne-200/80 shadow-luxury transition-all duration-300 overflow-hidden',
        hoverable && 'hover:shadow-luxury-hover hover:-translate-y-1 hover:border-brand-300',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
