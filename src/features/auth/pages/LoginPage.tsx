import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await login(email);
      navigate(from, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    try {
      await login('maya.patel@example.com');
      navigate(from, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-50/50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-luxury border border-champagne-300 shadow-2xl text-left">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl tracking-[0.2em] font-medium text-charcoal-950">
              RENTIQUE
            </span>
          </Link>
          <p className="text-xs uppercase tracking-widest text-charcoal-500 font-semibold">
            Private Member Sign In
          </p>
        </div>

        {/* 1-Click Demo Client Card */}
        <div className="p-4 rounded-xl border border-champagne-300 bg-champagne-50/50 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Maya Patel"
              className="w-10 h-10 rounded-full object-cover border border-brand-300 shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-charcoal-900">Maya Patel</span>
                <span className="text-[9px] uppercase font-bold text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded">
                  Demo Client
                </span>
              </div>
              <p className="text-[11px] text-charcoal-500">Instant access with active rental history</p>
            </div>
          </div>

          <Button
            type="button"
            variant="luxury"
            size="sm"
            className="w-full text-xs"
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            onClick={handleDemoLogin}
            disabled={isSubmitting}
          >
            One-Click Demo Sign In
          </Button>
        </div>

        {/* Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-champagne-200" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-white px-3 text-charcoal-400 font-bold">Or Sign In with Email</span>
          </div>
        </div>

        {/* Manual Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. maya.patel@example.com"
            required
            leftIcon={<Mail className="w-4 h-4 text-charcoal-400" />}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            leftIcon={<Lock className="w-4 h-4 text-charcoal-400" />}
            helperText="Any demo password will be accepted"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            isLoading={isSubmitting}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In to Wardrobe
          </Button>
        </form>
      </div>
    </div>
  );
};
