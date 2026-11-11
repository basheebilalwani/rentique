import React from 'react';
import { cn } from '@/utils/cn';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-luxury border border-rose-200 bg-rose-50/50 my-6',
        className
      )}
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-lg font-medium text-charcoal-900 mb-1">{title}</h3>
      <p className="text-sm text-charcoal-600 max-w-md mb-5">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RotateCcw className="w-4 h-4" />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
