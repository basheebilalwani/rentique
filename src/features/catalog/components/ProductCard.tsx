import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Sparkles } from 'lucide-react';
import { Outfit } from '@/types/outfit.types';
import { formatCurrency, getCategoryLabel } from '@/utils/formatters';
import { useWishlist } from '@/features/wishlist/WishlistContext';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

export interface ProductCardProps {
  outfit: Outfit;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ outfit, priority = false }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(outfit.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(outfit.id, outfit.name);
  };

  const statusVariant = {
    available: 'emerald',
    cleaning: 'amber',
    maintenance: 'charcoal',
    retired: 'rose',
  }[outfit.status] as 'emerald' | 'amber' | 'charcoal' | 'rose';

  return (
    <div className="group relative flex flex-col bg-white rounded-luxury border border-champagne-200/90 shadow-luxury hover:shadow-luxury-hover transition-all duration-300 overflow-hidden">
      {/* Image Thumbnail Container */}
      <Link to={`/outfits/${outfit.id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-champagne-100 block">
        <img
          src={outfit.featuredImage}
          alt={outfit.name}
          loading={priority ? 'eager' : 'lazy'}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {outfit.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-charcoal-900/85 backdrop-blur-md text-brand-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
              <Sparkles className="w-3 h-3 text-brand-400" />
              Runway Edit
            </span>
          )}
          {outfit.status !== 'available' && (
            <Badge variant={statusVariant} size="sm" dot>
              {outfit.status === 'cleaning' ? 'Under Sanitization' : 'Under Maintenance'}
            </Badge>
          )}
        </div>

        {/* Wishlist Heart Icon */}
        <button
          onClick={handleWishlistClick}
          aria-label={wishlisted ? `Remove ${outfit.name} from wishlist` : `Add ${outfit.name} to wishlist`}
          className={cn(
            'absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-400',
            wishlisted
              ? 'bg-rose-50 text-rose-600 scale-105'
              : 'bg-white/80 text-charcoal-700 hover:bg-white hover:text-rose-500 hover:scale-110'
          )}
        >
          <Heart className={cn('w-4 h-4', wishlisted && 'fill-current text-rose-500')} />
        </button>

        {/* Quick Sizes Pill Overlay at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-charcoal-950/80 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full flex gap-1.5 font-medium tracking-wider">
            <span>SIZES:</span>
            <span>{outfit.sizes.join(', ')}</span>
          </div>
        </div>
      </Link>

      {/* Card Details */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-brand-700">
              {outfit.designer}
            </span>
            <div className="flex items-center gap-1 text-charcoal-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-charcoal-800">{outfit.rating}</span>
              <span className="text-[10px] text-charcoal-400">({outfit.reviewCount})</span>
            </div>
          </div>

          <Link to={`/outfits/${outfit.id}`} className="block group/title">
            <h3 className="font-serif text-base sm:text-lg font-medium text-charcoal-900 group-hover/title:text-brand-600 transition-colors line-clamp-1">
              {outfit.name}
            </h3>
          </Link>

          <p className="text-xs text-charcoal-500 mt-1 line-clamp-1">
            {getCategoryLabel(outfit.category)} &bull; {outfit.fabric}
          </p>
        </div>

        {/* Pricing Footer */}
        <div className="mt-4 pt-3.5 border-t border-champagne-100 flex items-baseline justify-between">
          <div>
            <span className="font-serif text-lg font-semibold text-charcoal-900">
              {formatCurrency(outfit.dailyRentalPrice)}
            </span>
            <span className="text-xs text-charcoal-500 font-normal"> / day</span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-charcoal-400 line-through">
              Retail {formatCurrency(outfit.retailPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
