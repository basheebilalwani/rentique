import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'      // Solid dark editorial black
  | 'luxury'       // Rich antique gold with subtle glow
  | 'secondary'    // Champagne sand background
  | 'outline'      // Thin elegant border
  | 'ghost'        // Minimal hover fill
  | 'danger';      // Rose red for cancellations/destructive actions

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 rounded-luxury focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-charcoal-900 text-brand-50 hover:bg-charcoal-800 focus:ring-charcoal-900 shadow-sm hover:shadow-luxury',
      luxury:
        'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500 shadow-luxury hover:shadow-gold-glow',
      secondary:
        'bg-champagne-100 text-charcoal-900 hover:bg-champagne-200 focus:ring-champagne-300 border border-champagne-200',
      outline:
        'border border-charcoal-300 bg-transparent text-charcoal-900 hover:bg-charcoal-50 focus:ring-charcoal-400',
      ghost:
        'bg-transparent text-charcoal-700 hover:bg-brand-100/60 hover:text-charcoal-900 focus:ring-brand-200',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5',
      md: 'text-sm px-5 py-2.5 gap-2',
      lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
