import React from 'react';
import { cn } from '@/utils/cn';

export type BadgeVariant =
  | 'brand'
  | 'emerald'
  | 'amber'
  | 'blue'
  | 'rose'
  | 'charcoal'
  | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'brand',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variants: Record<BadgeVariant, { container: string; dotColor: string }> = {
    brand: {
      container: 'bg-brand-100 text-brand-800 border-brand-200',
      dotColor: 'bg-brand-600',
    },
    emerald: {
      container: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    amber: {
      container: 'bg-amber-50 text-amber-800 border-amber-200',
      dotColor: 'bg-amber-500',
    },
    blue: {
      container: 'bg-blue-50 text-blue-800 border-blue-200',
      dotColor: 'bg-blue-500',
    },
    rose: {
      container: 'bg-rose-50 text-rose-800 border-rose-200',
      dotColor: 'bg-rose-500',
    },
    charcoal: {
      container: 'bg-charcoal-100 text-charcoal-800 border-charcoal-200',
      dotColor: 'bg-charcoal-500',
    },
    outline: {
      container: 'bg-transparent text-charcoal-700 border-charcoal-300',
      dotColor: 'bg-charcoal-400',
    },
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border uppercase',
        variants[variant].container,
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', variants[variant].dotColor)} />}
      <span>{children}</span>
    </span>
  );
};
