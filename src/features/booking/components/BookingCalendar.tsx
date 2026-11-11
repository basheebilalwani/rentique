import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  ShieldCheck,
  Sparkles,
  Info,
  Clock,
} from 'lucide-react';
import { Outfit, OutfitSize } from '@/types/outfit.types';
import { bookingApi } from '@/services/api/bookingApi';
import {
  calculateRentalPricing,
  CLEANING_BUFFER_DAYS,
} from '@/utils/bookingCalculations';
import { checkOutfitAvailability } from '@/utils/dateAvailability';
import { formatCurrency, formatRentalDays } from '@/utils/formatters';
import { Button } from '@/components/ui/Button';

export interface BookingCalendarProps {
  outfit: Outfit;
  selectedSize: OutfitSize;
  onSelectSize: (size: OutfitSize) => void;
  selectedColour: string;
  onSelectColour: (colour: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  onProceedToBooking: () => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  outfit,
  selectedSize,
  onSelectSize,
  selectedColour,
  onSelectColour,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onProceedToBooking,
}) => {
  // Query existing bookings for this outfit to calculate date collisions
  const { data: outfitBookings = [] } = useQuery({
    queryKey: ['outfit-bookings', outfit.id],
    queryFn: () => bookingApi.getBookingsByOutfit(outfit.id),
  });

  // Validate current date selection
  const availability = useMemo(() => {
    if (!startDate || !endDate) return null;
    return checkOutfitAvailability({
      startDate,
      endDate,
      outfitStatus: outfit.status,
      existingBookings: outfitBookings,
      cleaningBufferDays: CLEANING_BUFFER_DAYS,
    });
  }, [startDate, endDate, outfit.status, outfitBookings]);

  // Compute pricing breakdown
  const pricing = useMemo(() => {
    return calculateRentalPricing({
      dailyPrice: outfit.dailyRentalPrice,
      retailPrice: outfit.retailPrice,
      securityDeposit: outfit.securityDeposit,
      startDate,
      endDate,
    });
  }, [outfit, startDate, endDate]);

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const minEndDate = startDate || todayStr;

  return (
    <div className="bg-white rounded-luxury border border-champagne-300 p-6 shadow-luxury space-y-6 text-left">
      {/* Header Price */}
      <div className="flex items-baseline justify-between pb-4 border-b border-champagne-100">
        <div>
          <span className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal-900">
            {formatCurrency(outfit.dailyRentalPrice)}
          </span>
          <span className="text-xs text-charcoal-500 font-medium"> / day rental</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-charcoal-400 line-through">
            Retail {formatCurrency(outfit.retailPrice)}
          </span>
        </div>
      </div>

      {/* 1. Size Selection */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold uppercase tracking-wider text-charcoal-700">Select Size</span>
          <span className="text-charcoal-400">Fits true to size</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {outfit.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider border transition-all ${
                selectedSize === size
                  ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                  : 'bg-white text-charcoal-700 border-champagne-300 hover:border-brand-400'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Colour Selection */}
      {outfit.colours.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-700 block">
            Colour: <span className="font-normal text-charcoal-600">{selectedColour}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {outfit.colours.map((colour) => (
              <button
                key={colour}
                type="button"
                onClick={() => onSelectColour(colour)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                  selectedColour === colour
                    ? 'border-brand-600 bg-brand-50 text-brand-900 font-semibold'
                    : 'border-champagne-300 text-charcoal-600 hover:border-charcoal-400'
                }`}
              >
                {colour}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Date Selection Controls */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-charcoal-700">
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-brand-600" />
            Select Rental Period
          </span>
          {pricing.rentalDays > 0 && (
            <span className="text-brand-700 font-semibold lowercase">
              {formatRentalDays(pricing.rentalDays)}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-charcoal-500 mb-1 font-medium">
              Event Start Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={startDate}
              onChange={(e) => {
                onStartDateChange(e.target.value);
                // If end date is now before start, bump end date
                if (endDate && e.target.value > endDate) {
                  onEndDateChange(e.target.value);
                }
              }}
              className="w-full px-3 py-2 text-xs rounded-luxury border border-champagne-300 focus:outline-none focus:border-brand-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-charcoal-500 mb-1 font-medium">
              Return Courier Date
            </label>
            <input
              type="date"
              min={minEndDate}
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-luxury border border-champagne-300 focus:outline-none focus:border-brand-500 bg-white"
            />
          </div>
        </div>

        {/* Cleaning Buffer Notice */}
        <div className="flex items-start gap-2 bg-champagne-50 p-3 rounded-lg border border-champagne-200 text-[11px] text-charcoal-600">
          <Clock className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
          <span>
            <strong>1-Day Cleaning Buffer:</strong> After your return date, this outfit automatically enters our eco-sanitization protocol before the next reservation.
          </span>
        </div>

        {/* Real-time Availability Warning / Success Banner */}
        {availability && (
          <div>
            {availability.isAvailable ? (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-200 text-xs font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dates are available for reservation!</span>
              </div>
            ) : (
              <div className="flex items-start gap-2 bg-rose-50 text-rose-800 p-2.5 rounded-lg border border-rose-200 text-xs">
                <Info className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{availability.reason}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Live Pricing Breakdown */}
      {pricing.rentalDays > 0 && (
        <div className="space-y-2.5 pt-3 border-t border-champagne-100 text-xs">
          <div className="flex justify-between text-charcoal-600">
            <span>
              Rental Subtotal ({pricing.rentalDays} days &times; {formatCurrency(pricing.dailyPrice)})
            </span>
            <span>{formatCurrency(pricing.rentalSubtotal)}</span>
          </div>

          {pricing.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Multi-Day Privilege (10% off)</span>
              <span>-{formatCurrency(pricing.discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-charcoal-600">
            <span className="flex items-center gap-1">
              Refundable Security Deposit
              <ShieldCheck className="w-3 h-3 text-brand-600" />
            </span>
            <span>{formatCurrency(pricing.securityDeposit)}</span>
          </div>

          <div className="flex justify-between text-charcoal-600">
            <span>Garment Sanitization & Care</span>
            <span>{formatCurrency(pricing.cleaningFee)}</span>
          </div>

          <div className="flex justify-between text-charcoal-600">
            <span>Estimated Taxes (8%)</span>
            <span>{formatCurrency(pricing.taxes)}</span>
          </div>

          <div className="flex justify-between text-sm font-semibold text-charcoal-900 pt-2 border-t border-champagne-200">
            <span>Estimated Total Due</span>
            <span className="font-serif text-base text-brand-700">
              {formatCurrency(pricing.grandTotal)}
            </span>
          </div>

          <p className="text-[10px] text-charcoal-400 text-center pt-1">
            * Security deposit of {formatCurrency(pricing.securityDeposit)} is refunded in full upon return inspection.
          </p>
        </div>
      )}

      {/* 5. Book Action Button */}
      <Button
        variant="luxury"
        size="lg"
        className="w-full"
        disabled={!startDate || !endDate || !availability?.isAvailable}
        onClick={onProceedToBooking}
      >
        {!startDate || !endDate
          ? 'Select Rental Dates to Reserve'
          : !availability?.isAvailable
          ? 'Dates Unavailable'
          : `Reserve Outfit — ${formatCurrency(pricing.grandTotal)}`}
      </Button>
    </div>
  );
};
