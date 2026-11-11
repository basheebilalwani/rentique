import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Heart,
  Star,
  ShieldCheck,
  Sparkles,
  Scissors,
  CheckCircle,
  Truck,
} from 'lucide-react';
import { outfitApi } from '@/services/api/outfitApi';
import { OutfitSize } from '@/types/outfit.types';
import { useWishlist } from '@/features/wishlist/WishlistContext';
import { BookingCalendar } from '@/features/booking/components/BookingCalendar';
import { BookingModal } from '@/features/booking/components/BookingModal';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Badge } from '@/components/ui/Badge';
import { getCategoryLabel, getOccasionLabel } from '@/utils/formatters';
import { cn } from '@/utils/cn';

export const OutfitDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Query outfit details
  const {
    data: outfit,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['outfit', id],
    queryFn: () => outfitApi.getOutfitById(id!),
    enabled: Boolean(id),
  });

  // Query all outfits for related recommendations
  const { data: allOutfits = [] } = useQuery({
    queryKey: ['outfits'],
    queryFn: () => outfitApi.getOutfits(),
  });

  // State
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<OutfitSize>('M');
  const [selectedColour, setSelectedColour] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Initialize selected image and defaults when outfit loads
  useEffect(() => {
    if (outfit) {
      setSelectedImage(outfit.featuredImage || outfit.images[0]);
      if (outfit.sizes.length > 0 && !outfit.sizes.includes(selectedSize)) {
        setSelectedSize(outfit.sizes[0]);
      }
      if (outfit.colours.length > 0) {
        setSelectedColour(outfit.colours[0]);
      }
    }
  }, [outfit, selectedSize]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Retrieving Couture Details..." />
      </div>
    );
  }

  if (isError || !outfit) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4">
        <EmptyState
          title="Outfit Not Found"
          description="The couture garment you requested could not be located in our archive."
          actionLabel="Return to Catalogue"
          onAction={() => navigate('/catalog')}
        />
      </div>
    );
  }

  const wishlisted = isInWishlist(outfit.id);
  const relatedOutfits = allOutfits
    .filter((o) => o.id !== outfit.id && (o.category === outfit.category || o.occasion === outfit.occasion))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 text-left">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-charcoal-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Archive</span>
        </Link>
        <button
          onClick={() => toggleWishlist(outfit.id, outfit.name)}
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
            wishlisted
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : 'bg-white text-charcoal-700 border-champagne-300 hover:border-brand-400'
          )}
        >
          <Heart className={cn('w-4 h-4', wishlisted && 'fill-current text-rose-500')} />
          <span>{wishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
        </button>
      </div>

      {/* Main Grid: Gallery on Left (7 cols), Booking Sidebar on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[3/4] w-full rounded-luxury-lg overflow-hidden bg-champagne-100 border border-champagne-200 shadow-luxury">
            <img
              src={selectedImage || outfit.featuredImage}
              alt={outfit.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {outfit.isFeatured && (
              <span className="absolute top-4 left-4 bg-charcoal-900/85 backdrop-blur-md text-brand-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                Featured Runway Edit
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {outfit.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {outfit.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={cn(
                    'w-20 h-24 rounded-luxury overflow-hidden border-2 transition-all shrink-0',
                    selectedImage === img
                      ? 'border-brand-600 shadow-md scale-105'
                      : 'border-champagne-300 opacity-70 hover:opacity-100'
                  )}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Couture Description & Craftsmanship Details */}
          <div className="space-y-6 pt-6 border-t border-champagne-200">
            <div>
              <h3 className="font-serif text-2xl font-medium text-charcoal-900 mb-2">
                Garment Description & Craftsmanship
              </h3>
              <p className="text-sm text-charcoal-600 leading-relaxed font-normal">
                {outfit.description}
              </p>
            </div>

            {/* Fabric & Materials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-luxury border border-champagne-200 shadow-subtle">
                <div className="flex items-center gap-2 text-brand-700 mb-1">
                  <Scissors className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-wider">Fabric & Textile</span>
                </div>
                <p className="text-xs font-semibold text-charcoal-900">{outfit.fabric}</p>
              </div>

              <div className="bg-white p-4 rounded-luxury border border-champagne-200 shadow-subtle">
                <div className="flex items-center gap-2 text-brand-700 mb-1">
                  <Truck className="w-4 h-4" />
                  <span className="text-xs uppercase font-bold tracking-wider">White-Glove Delivery</span>
                </div>
                <p className="text-xs font-semibold text-charcoal-900">Delivered 1–2 days before event</p>
              </div>
            </div>

            {/* Care and Policies */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider font-bold text-charcoal-700">
                Care & Eco-Sanitization
              </h4>
              <ul className="space-y-1.5 text-xs text-charcoal-600">
                {outfit.careInstructions.map((inst, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider font-bold text-charcoal-700">
                Rental & Damage Waiver Policies
              </h4>
              <ul className="space-y-1.5 text-xs text-charcoal-600">
                {outfit.rentalPolicies.map((pol, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span>{pol}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Outfit Info & Interactive Date Booking Calendar (Sticky) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-brand-700">
                {outfit.designer}
              </span>
              <span className="text-charcoal-300">&bull;</span>
              <Badge variant="brand" size="sm">
                {getCategoryLabel(outfit.category)}
              </Badge>
              <Badge variant="outline" size="sm">
                {getOccasionLabel(outfit.occasion)}
              </Badge>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal-950 mb-3">
              {outfit.name}
            </h1>

            <div className="flex items-center gap-2 text-xs text-charcoal-500">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-charcoal-900 ml-1">{outfit.rating}</span>
              </div>
              <span>&bull;</span>
              <span>{outfit.reviewCount} Verified Celebrations</span>
            </div>
          </div>

          {/* Interactive Date Booking Widget */}
          <BookingCalendar
            outfit={outfit}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            selectedColour={selectedColour}
            onSelectColour={setSelectedColour}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onProceedToBooking={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      {/* Related Outfits Section */}
      {relatedOutfits.length > 0 && (
        <div className="pt-16 border-t border-champagne-200">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest font-semibold text-brand-700">
              Complete Your Styling
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal-900">
              Complementary Couture
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedOutfits.map((rel) => (
              <ProductCard key={rel.id} outfit={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Multi-step Checkout / Reservation Modal */}
      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          outfit={outfit}
          selectedSize={selectedSize}
          selectedColour={selectedColour}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </div>
  );
};
