import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, RefreshCw, HeartHandshake, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/ToastContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      success('Thank you for subscribing to Rentique Private Archive.');
      setEmail('');
    }
  };

  return (
    <footer className="bg-charcoal-950 text-brand-100 border-t border-charcoal-800">
      {/* Guarantees Banner */}
      <div className="border-b border-charcoal-800/80 bg-charcoal-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-luxury bg-charcoal-900/40 border border-charcoal-800">
            <div className="p-3 rounded-full bg-brand-500/10 text-brand-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">100% Certified Couture</h4>
              <p className="text-xs text-charcoal-400 mt-0.5">Direct from verified heritage fashion houses.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-luxury bg-charcoal-900/40 border border-charcoal-800">
            <div className="p-3 rounded-full bg-brand-500/10 text-brand-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Eco-Friendly Sanitization</h4>
              <p className="text-xs text-charcoal-400 mt-0.5">Complimentary green dry cleaning after each return.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-luxury bg-charcoal-900/40 border border-charcoal-800">
            <div className="p-3 rounded-full bg-brand-500/10 text-brand-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide">Fit & Damage Assurance</h4>
              <p className="text-xs text-charcoal-400 mt-0.5">Included insurance waiver for minor accidental wear.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl tracking-[0.25em] font-medium text-white">
              RENTIQUE
            </span>
          </Link>
          <p className="text-xs text-charcoal-400 leading-relaxed max-w-sm">
            Rentique democratizes couture fashion through circular luxury. Experience the world&apos;s
            most coveted bridal lehengas, gala gowns, and bespoke tuxedos without the burden of permanent ownership.
          </p>
          <div className="flex items-center gap-2 text-xs text-brand-400 pt-2">
            <Sparkles className="w-4 h-4" />
            <span className="font-medium tracking-wider uppercase">Sustainable Circular Luxury</span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
            Collections
          </h4>
          <ul className="space-y-2.5 text-xs text-charcoal-400">
            <li>
              <Link to="/catalog?category=lehengas" className="hover:text-brand-300 transition-colors">
                Bridal Lehengas
              </Link>
            </li>
            <li>
              <Link to="/catalog?category=gowns" className="hover:text-brand-300 transition-colors">
                Evening Gowns
              </Link>
            </li>
            <li>
              <Link to="/catalog?category=tuxedos" className="hover:text-brand-300 transition-colors">
                Designer Tuxedos
              </Link>
            </li>
            <li>
              <Link to="/catalog?category=sherwanis" className="hover:text-brand-300 transition-colors">
                Royal Sherwanis
              </Link>
            </li>
            <li>
              <Link to="/catalog?category=sarees" className="hover:text-brand-300 transition-colors">
                Heritage Sarees
              </Link>
            </li>
          </ul>
        </div>

        {/* Occasions */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
            Occasions
          </h4>
          <ul className="space-y-2.5 text-xs text-charcoal-400">
            <li>
              <Link to="/catalog?occasion=wedding" className="hover:text-brand-300 transition-colors">
                Weddings & Engagements
              </Link>
            </li>
            <li>
              <Link to="/catalog?occasion=gala" className="hover:text-brand-300 transition-colors">
                Black Tie Galas
              </Link>
            </li>
            <li>
              <Link to="/catalog?occasion=reception" className="hover:text-brand-300 transition-colors">
                Evening Receptions
              </Link>
            </li>
            <li>
              <Link to="/catalog?occasion=cocktail" className="hover:text-brand-300 transition-colors">
                Cocktail Soirées
              </Link>
            </li>
          </ul>
        </div>

        {/* Private Archive Newsletter */}
        <div>
          <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
            Private Archive
          </h4>
          <p className="text-xs text-charcoal-400 mb-3">
            Receive private invites to new runway arrivals and exclusive designer drops.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-charcoal-900 border border-charcoal-700 rounded-luxury px-3.5 py-2 text-xs text-white placeholder:text-charcoal-500 focus:outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg flex items-center justify-center transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-charcoal-900 py-6 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-500 max-w-7xl mx-auto gap-3">
        <p>&copy; {new Date().getFullYear()} RENTIQUE Luxury Fashion Rental Platform. Sustainable circular couture archive.</p>
        <div className="flex items-center gap-6 text-[11px]">
          <span className="hover:text-champagne-300 transition-colors cursor-pointer">White-Glove Courier Service</span>
          <span>&bull;</span>
          <span className="hover:text-champagne-300 transition-colors cursor-pointer">Eco-Sanitization Guarantee</span>
        </div>
      </div>
    </footer>
  );
};
