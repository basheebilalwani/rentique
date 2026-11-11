import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/ToastContext';
import { useAuth } from '@/features/auth/AuthContext';
import { Outfit, OutfitSize } from '@/types/outfit.types';
import { bookingApi } from '@/services/api/bookingApi';
import { calculateRentalPricing } from '@/utils/bookingCalculations';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ShieldCheck, CheckCircle2, Package } from 'lucide-react';

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: Outfit;
  selectedSize: OutfitSize;
  selectedColour: string;
  startDate: string;
  endDate: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  outfit,
  selectedSize,
  selectedColour,
  startDate,
  endDate,
}) => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form states
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+1-555-0192');
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.address || '740 Park Avenue, Apt 8B, New York, NY 10021'
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const pricing = calculateRentalPricing({
    dailyPrice: outfit.dailyRentalPrice,
    retailPrice: outfit.retailPrice,
    securityDeposit: outfit.securityDeposit,
    startDate,
    endDate,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerEmail || !deliveryAddress) {
      toastError('Please fill in all required delivery fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await bookingApi.createBooking(
        {
          outfitId: outfit.id,
          selectedSize,
          selectedColour,
          startDate,
          endDate,
          customerName,
          customerEmail,
          customerPhone,
          deliveryAddress,
          notes,
        },
        user?.id || 'guest-user'
      );

      // Invalidate query caches
      queryClient.invalidateQueries({ queryKey: ['outfit-bookings', outfit.id] });
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });

      setBookingConfirmed(true);
      success('Rental reservation request submitted successfully!');
    } catch (err: any) {
      toastError(err.message || 'Failed to submit reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (bookingConfirmed) {
          navigate('/profile');
        }
        onClose();
      }}
      title={bookingConfirmed ? 'Reservation Confirmed' : 'Reserve Couture Garment'}
      maxWidth="lg"
    >
      {bookingConfirmed ? (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-medium text-charcoal-900">
            Your Reservation is Received!
          </h3>
          <p className="text-xs sm:text-sm text-charcoal-600 max-w-md mx-auto leading-relaxed">
            Our concierge team has received your rental request for the{' '}
            <strong>{outfit.name}</strong>. You can monitor confirmation and dispatch in your
            customer portal.
          </p>
          <div className="bg-champagne-50 p-4 rounded-luxury border border-champagne-200 text-left text-xs space-y-1.5 max-w-sm mx-auto">
            <div className="flex justify-between">
              <span className="text-charcoal-500">Rental Period:</span>
              <span className="font-semibold text-charcoal-900">
                {formatDate(startDate)} &ndash; {formatDate(endDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Selected Size / Color:</span>
              <span className="font-semibold text-charcoal-900">
                Size {selectedSize} &bull; {selectedColour}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Total Price:</span>
              <span className="font-bold text-brand-700 font-serif">
                {formatCurrency(pricing.grandTotal)}
              </span>
            </div>
          </div>
          <div className="pt-4 flex justify-center gap-3">
            <Button
              variant="luxury"
              onClick={() => {
                onClose();
                navigate('/profile');
              }}
            >
              View In My Rentals
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          {/* Summary Banner */}
          <div className="flex items-center gap-4 bg-champagne-50/70 p-4 rounded-luxury border border-champagne-200">
            <img
              src={outfit.featuredImage}
              alt={outfit.name}
              className="w-16 h-20 object-cover rounded-lg border border-champagne-300 shrink-0"
            />
            <div className="text-xs space-y-1 flex-1">
              <p className="font-bold uppercase tracking-wider text-brand-700 text-[10px]">
                {outfit.designer}
              </p>
              <h4 className="font-serif text-sm font-semibold text-charcoal-900 line-clamp-1">
                {outfit.name}
              </h4>
              <p className="text-charcoal-600">
                Dates: <strong className="text-charcoal-900">{formatDate(startDate)} &ndash; {formatDate(endDate)}</strong> ({pricing.rentalDays} days)
              </p>
              <p className="text-charcoal-600">
                Specification: <strong>Size {selectedSize}</strong> &bull; <strong>{selectedColour}</strong>
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-700 flex items-center gap-1.5 border-b border-champagne-200 pb-2">
              <Package className="w-4 h-4 text-brand-600" />
              Delivery & Contact Details
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                placeholder="e.g. Maya Patel"
              />
              <Input
                label="Email Address *"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number *"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                placeholder="+1-555-0144"
              />
              <Input
                label="Delivery Address *"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
                placeholder="Street address, city, state, zip"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                Fitting & Event Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Include height with heels, styling notes, or building buzzer instructions..."
                className="w-full text-xs p-3 rounded-luxury border border-champagne-300 focus:outline-none focus:border-brand-500 bg-white"
              />
            </div>
          </div>

          {/* Assurance Notice */}
          <div className="flex items-start gap-2.5 bg-brand-50 p-3 rounded-luxury border border-brand-200 text-[11px] text-charcoal-700">
            <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <span>
              Your security deposit of <strong>{formatCurrency(pricing.securityDeposit)}</strong> is
              protected and returned to your original payment method automatically within 48 hours of
              post-event inspection.
            </span>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-champagne-200">
            <div>
              <span className="text-xs text-charcoal-500 block">Total Due at Checkout</span>
              <span className="font-serif text-xl font-bold text-charcoal-900">
                {formatCurrency(pricing.grandTotal)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" variant="luxury" isLoading={isSubmitting}>
                Confirm Reservation
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};
