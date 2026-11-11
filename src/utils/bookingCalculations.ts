import { differenceInCalendarDays, parseISO, isValid } from 'date-fns';
import { PricingBreakdown } from '@/types/booking.types';

export const STANDARD_CLEANING_FEE = 25; // Standard eco-friendly dry-cleaning & inspection
export const TAX_RATE = 0.08;             // 8% state luxury rental tax
export const CLEANING_BUFFER_DAYS = 1;    // 1-day turnaround for professional sanitization

/**
 * Calculates rental duration in days inclusive of start and end date.
 * E.g., June 1st to June 3rd = 3 days (June 1, 2, 3).
 */
export function calculateRentalDays(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  
  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);

  if (!isValid(start) || !isValid(end)) return 0;

  const diff = differenceInCalendarDays(end, start);
  if (diff < 0) return 0;

  return diff + 1;
}

/**
 * Calculates comprehensive pricing breakdown for an outfit rental.
 */
export function calculateRentalPricing({
  dailyPrice,
  retailPrice,
  securityDeposit,
  startDate,
  endDate,
  discountPercent = 0,
}: {
  dailyPrice: number;
  retailPrice: number;
  securityDeposit?: number;
  startDate: string;
  endDate: string;
  discountPercent?: number;
}): PricingBreakdown {
  const rentalDays = calculateRentalDays(startDate, endDate);
  
  if (rentalDays <= 0) {
    return {
      rentalDays: 0,
      dailyPrice,
      rentalSubtotal: 0,
      securityDeposit: securityDeposit ?? Math.round(retailPrice * 0.25),
      cleaningFee: STANDARD_CLEANING_FEE,
      taxes: 0,
      discount: 0,
      grandTotal: 0,
    };
  }

  const rentalSubtotal = rentalDays * dailyPrice;

  // Auto 10% discount on rentals of 5 days or longer
  const effectiveDiscountPercent = discountPercent > 0 ? discountPercent : (rentalDays >= 5 ? 10 : 0);
  const discount = Math.round((rentalSubtotal * effectiveDiscountPercent) / 100);
  
  const discountedSubtotal = rentalSubtotal - discount;
  const taxes = Math.round(discountedSubtotal * TAX_RATE);
  const deposit = securityDeposit ?? Math.max(100, Math.round(retailPrice * 0.25));
  
  const grandTotal = discountedSubtotal + deposit + STANDARD_CLEANING_FEE + taxes;

  return {
    rentalDays,
    dailyPrice,
    rentalSubtotal,
    securityDeposit: deposit,
    cleaningFee: STANDARD_CLEANING_FEE,
    taxes,
    discount,
    grandTotal,
  };
}
