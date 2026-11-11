import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { outfitApi } from '@/services/api/outfitApi';
import { useWishlist } from '../WishlistContext';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const WishlistPage: React.FC = () => {
  const { wishlistIds, count } = useWishlist();

  const { data: allOutfits = [], isLoading } = useQuery({
    queryKey: ['outfits'],
    queryFn: () => outfitApi.getOutfits(),
  });

  const wishlistedOutfits = allOutfits.filter((outfit) => wishlistIds.includes(outfit.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-champagne-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-brand-700 mb-1">
            <Heart className="w-4 h-4 fill-brand-700" />
            <span>Curated Collection</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal-950">
            My Saved Wishlist
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-charcoal-500 mt-2 sm:mt-0 font-medium">
          {count} {count === 1 ? 'Garment' : 'Garments'} Saved
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" label="Loading Wishlist..." />
        </div>
      ) : wishlistedOutfits.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-8 h-8 text-brand-500" />}
          title="Your Wishlist is Empty"
          description="Explore our curated catalogue of couture lehengas, evening gowns, and tuxedos to save pieces for your upcoming celebrations."
          actionLabel="Explore Archive"
          onAction={() => (window.location.href = '/catalog')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedOutfits.map((outfit) => (
            <ProductCard key={outfit.id} outfit={outfit} />
          ))}
        </div>
      )}
    </div>
  );
};
