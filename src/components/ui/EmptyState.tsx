import React from 'react';
import { cn } from '@/utils/cn';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-luxury border border-dashed border-champagne-300 bg-white/60 my-6',
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-champagne-100 flex items-center justify-center text-brand-600 mb-4 shadow-sm">
        {icon || <Sparkles className="w-6 h-6" />}
      </div>
      <h3 className="font-serif text-xl sm:text-2xl font-medium text-charcoal-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-charcoal-500 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
