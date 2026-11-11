import { Component, ErrorInfo, ReactNode } from 'react';
import { Sparkles, RefreshCw, Home, AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Production-grade React Error Boundary.
 * Catches unhandled runtime JavaScript errors anywhere in the child component tree,
 * logs the incident, and displays an editorial luxury fallback interface instead of a blank screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Rentique ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = (): void => {
    window.location.reload();
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-brand-50 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-2xl border border-champagne-300 shadow-xl p-8 text-center">
            {/* Luxury Brand Accent Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-champagne-100 flex items-center justify-center text-brand-600 border border-brand-200">
              <Sparkles className="w-8 h-8" />
            </div>

            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-brand-600 block mb-2">
              Atelier Notification
            </span>

            <h1 className="font-serif text-2xl font-bold text-charcoal-900 mb-3">
              An Unexpected Disruption
            </h1>

            <p className="text-sm text-charcoal-600 mb-6 leading-relaxed">
              We encountered an unforeseen interruption while preparing this couture showcase.
              Our concierge fleet has been alerted.
            </p>

            {this.state.error && (
              <div className="mb-6 p-3 bg-red-50/80 rounded-lg border border-red-200 text-left flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-800 font-mono break-words overflow-hidden">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-charcoal-900 text-white rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-charcoal-800 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Page
              </button>

              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-100 text-brand-900 border border-brand-300 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-brand-200 transition-colors shadow-sm"
              >
                <Home className="w-3.5 h-3.5" />
                Storefront
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
