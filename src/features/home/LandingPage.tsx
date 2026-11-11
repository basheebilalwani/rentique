import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  PackageCheck,
  Star,
  Quote,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { Outfit } from '@/types/outfit.types';
import { outfitApi } from '@/services/api/outfitApi';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const LandingPage: React.FC = () => {
  const [featuredOutfits, setFeaturedOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await outfitApi.getFeaturedOutfits();
        setFeaturedOutfits(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured outfits:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const occasionCards = [
    {
      title: 'Grand Weddings',
      tagline: 'Bridal Lehengas & Sherwanis',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      href: '/catalog?occasion=wedding',
    },
    {
      title: 'Black Tie Galas',
      tagline: 'Couture Gowns & Tailored Tuxedos',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      href: '/catalog?occasion=gala',
    },
    {
      title: 'Evening Receptions',
      tagline: 'Zari Sarees & Embellished Silks',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      href: '/catalog?occasion=reception',
    },
    {
      title: 'Cocktail Soirées',
      tagline: 'Contemporary Runway Silhouettes',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      href: '/catalog?occasion=cocktail',
    },
  ];

  const rentalSteps = [
    {
      step: '01',
      title: 'Discover & Reserve',
      description:
        'Browse our curated archive of designer couture. Select your exact event dates and size; our live calendar verifies instant availability.',
      icon: <CalendarCheck className="w-6 h-6 text-brand-600" />,
    },
    {
      step: '02',
      title: 'Couture Arrival',
      description:
        'Your garment arrives immaculately pressed and sealed in a luxury garment case 1–2 days prior to your celebration, ready to wear.',
      icon: <PackageCheck className="w-6 h-6 text-brand-600" />,
    },
    {
      step: '03',
      title: 'Effortless Return',
      description:
        'Slip the outfit back into the prepaid return case. We handle eco-friendly professional dry cleaning and sanitization on us.',
      icon: <ShieldCheck className="w-6 h-6 text-brand-600" />,
    },
  ];

  const testimonials = [
    {
      quote:
        'Wearing a $6,000 Sabyasachi lehenga for my sister’s wedding without spending a fortune was a dream. The fabric condition was pristine!',
      author: 'Ananya Singhania',
      role: 'Wedding Guest',
      event: 'Royal Palace Udaipur Wedding',
      stars: 5,
    },
    {
      quote:
        'The Ralph Lauren Purple Label tuxedo fit impeccably. Rentique makes black tie dressing completely effortless.',
      author: 'Marcus Vance',
      role: 'Philanthropy Gala Host',
      event: 'Metropolitan Arts Benefit',
      stars: 5,
    },
    {
      quote:
        'The date availability calendar and automated cleaning buffer gave me total confidence that my gown would arrive on time.',
      author: 'Clara Beaumont',
      role: 'Fashion Editor',
      event: 'Paris Fashion Week Gala',
      stars: 5,
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 bg-gradient-to-b from-champagne-100/60 via-brand-50 to-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 border border-brand-200/80 text-brand-800 text-xs font-semibold uppercase tracking-widest shadow-subtle">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>The Circular Luxury Archive</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-charcoal-950 font-normal leading-[1.15] tracking-tight">
                Wear the Unattainable. <br />
                <span className="italic font-serif text-brand-700">Rent Iconic Couture.</span>
              </h1>

              <p className="text-base sm:text-lg text-charcoal-600 max-w-xl font-normal leading-relaxed">
                Step into verified designer lehengas, bespoke evening gowns, and tailored tuxedos for
                weddings, galas, and celebrations. Premium luxury rentals with guaranteed availability.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/catalog">
                  <Button variant="luxury" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Explore Collection
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button variant="outline" size="lg">
                    How Rental Works
                  </Button>
                </a>
              </div>

              {/* Trust badges row */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-champagne-200/70 max-w-lg">
                <div>
                  <p className="font-serif text-2xl font-semibold text-charcoal-900">100%</p>
                  <p className="text-xs text-charcoal-500 mt-0.5">Authentic Couture</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold text-charcoal-900">48h</p>
                  <p className="text-xs text-charcoal-500 mt-0.5">Pre-Event Delivery</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-semibold text-charcoal-900">$0</p>
                  <p className="text-xs text-charcoal-500 mt-0.5">Dry Cleaning Fees</p>
                </div>
              </div>
            </div>

            {/* Hero Right Visuals */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Luxury Frame */}
                <div className="aspect-[3/4] rounded-luxury-lg overflow-hidden border-2 border-brand-200/60 shadow-2xl bg-champagne-200">
                  <img
                    src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=80"
                    alt="Marchesa Couture Evening Gown"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Floating Highlight Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-luxury border border-champagne-200 shadow-luxury max-w-[240px] text-left hidden sm:block animate-in fade-in duration-500">
                  <div className="flex items-center gap-1.5 text-brand-600 mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold text-charcoal-900">Featured Couture</span>
                  </div>
                  <p className="text-xs font-serif font-medium text-charcoal-900">Marchesa Tulle Gown</p>
                  <p className="text-[11px] text-brand-700 font-semibold mt-0.5">$175 / day &bull; Retail $3,200</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Occasions Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-700 mb-2">
            Curated For Every Milestone
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-normal">
            Browse By Occasion
          </h2>
          <p className="text-sm text-charcoal-600 mt-2">
            Explore wardrobe edits tailored specifically to dress codes, seasons, and cultural celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {occasionCards.map((occ) => (
            <Link
              key={occ.title}
              to={occ.href}
              className="group relative h-96 rounded-luxury overflow-hidden shadow-luxury border border-champagne-200/80 block"
            >
              <img
                src={occ.image}
                alt={occ.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/85 via-charcoal-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <span className="text-[10px] uppercase tracking-widest text-brand-300 font-bold">
                  {occ.tagline}
                </span>
                <h3 className="font-serif text-xl font-medium text-white mt-1 group-hover:text-brand-200 transition-colors">
                  {occ.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs text-brand-400 font-semibold mt-3 group-hover:translate-x-1 transition-transform">
                  Explore Edits <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Outfits Carousel/Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-champagne-200">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-700 mb-1">
              Curator&apos;s Selection
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-normal">
              Most Coveted Outfits
            </h2>
          </div>
          <Link to="/catalog" className="mt-4 sm:mt-0">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              View All Collection
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="lg" label="Loading Archive..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredOutfits.map((outfit) => (
              <ProductCard key={outfit.id} outfit={outfit} />
            ))}
          </div>
        )}
      </section>

      {/* 4. How Rental Works */}
      <section id="how-it-works" className="bg-champagne-100/70 border-y border-champagne-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-700 mb-2">
              Seamless 3-Step Experience
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-normal">
              How Rentique Works
            </h2>
            <p className="text-sm text-charcoal-600 mt-2">
              White-glove luxury fashion rental designed for effortless celebration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rentalSteps.map((step) => (
              <div
                key={step.step}
                className="bg-white p-8 rounded-luxury border border-champagne-200 shadow-luxury text-left relative"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-full bg-champagne-100 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="font-serif text-3xl font-light text-brand-300">{step.step}</span>
                </div>
                <h3 className="font-serif text-xl font-medium text-charcoal-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Guarantee highlights bar */}
          <div className="mt-12 bg-white/80 rounded-luxury p-6 border border-champagne-300 max-w-3xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs font-semibold text-charcoal-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Complimentary Size Swaps</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Professional Eco-Sanitization</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Full Refund If Cancelled 7 Days Prior</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-700 mb-2">
            Real Experiences
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-950 font-normal">
            Celebrated By Our Guests
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-luxury border border-champagne-200 shadow-luxury text-left flex flex-col justify-between"
            >
              <div>
                <Quote className="w-8 h-8 text-brand-400/40 mb-3" />
                <p className="text-sm text-charcoal-700 italic leading-relaxed mb-6 font-serif">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-champagne-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-charcoal-900">{t.author}</h4>
                  <p className="text-[11px] text-charcoal-500">{t.event}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. High-Fashion Call To Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-luxury-lg overflow-hidden bg-charcoal-950 text-white p-8 sm:p-16 text-center shadow-2xl border border-charcoal-800">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-brand-400">
              Private Runway Vault
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
              Ready for Your Next Celebration?
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-300 leading-relaxed">
              Rent pieces that turn heads. Reserve your dates today with zero hassle and guaranteed white-glove delivery.
            </p>
            <div className="pt-2">
              <Link to="/catalog">
                <Button variant="luxury" size="lg">
                  Explore Full Archive
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
