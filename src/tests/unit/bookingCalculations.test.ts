import { describe, it, expect } from 'vitest';
import {
  calculateRentalDays,
  calculateRentalPricing,
  STANDARD_CLEANING_FEE,
  TAX_RATE,
} from '@/utils/bookingCalculations';

describe('Booking Calculations Unit Tests', () => {
  describe('calculateRentalDays', () => {
    it('returns 1 day for a same-day rental', () => {
      const days = calculateRentalDays('2026-12-10', '2026-12-10');
      expect(days).toBe(1);
    });

    it('returns 3 days for a 3-day weekend rental (e.g. Dec 10 to Dec 12)', () => {
      const days = calculateRentalDays('2026-12-10', '2026-12-12');
      expect(days).toBe(3);
    });

    it('returns 0 when end date is before start date', () => {
      const days = calculateRentalDays('2026-12-15', '2026-12-10');
      expect(days).toBe(0);
    });

    it('returns 0 for missing or invalid dates', () => {
      expect(calculateRentalDays('', '2026-12-10')).toBe(0);
      expect(calculateRentalDays('invalid', 'dates')).toBe(0);
    });
  });

  describe('calculateRentalPricing', () => {
    it('calculates standard 3-day rental pricing accurately', () => {
      const pricing = calculateRentalPricing({
        dailyPrice: 150,
        retailPrice: 2000,
        securityDeposit: 300,
        startDate: '2026-12-10',
        endDate: '2026-12-12', // 3 days
      });

      expect(pricing.rentalDays).toBe(3);
      expect(pricing.rentalSubtotal).toBe(450); // 3 * 150
      expect(pricing.securityDeposit).toBe(300);
      expect(pricing.cleaningFee).toBe(STANDARD_CLEANING_FEE);
      expect(pricing.taxes).toBe(Math.round(450 * TAX_RATE)); // 36
      expect(pricing.discount).toBe(0);
      expect(pricing.grandTotal).toBe(450 + 300 + STANDARD_CLEANING_FEE + 36);
    });

    it('applies a 10% multi-day discount for rentals of 5 days or longer', () => {
      const pricing = calculateRentalPricing({
        dailyPrice: 100,
        retailPrice: 1500,
        securityDeposit: 250,
        startDate: '2026-12-01',
        endDate: '2026-12-05', // 5 days
      });

      expect(pricing.rentalDays).toBe(5);
      const subtotal = 500;
      expect(pricing.rentalSubtotal).toBe(subtotal);
      expect(pricing.discount).toBe(50); // 10% of 500
      const discountedSubtotal = 450;
      const expectedTaxes = Math.round(discountedSubtotal * TAX_RATE); // 36
      expect(pricing.taxes).toBe(expectedTaxes);
      expect(pricing.grandTotal).toBe(discountedSubtotal + 250 + STANDARD_CLEANING_FEE + expectedTaxes);
    });

    it('handles zero or invalid duration gracefully', () => {
      const pricing = calculateRentalPricing({
        dailyPrice: 100,
        retailPrice: 1000,
        startDate: '2026-12-05',
        endDate: '2026-12-01', // End before start
      });

      expect(pricing.rentalDays).toBe(0);
      expect(pricing.rentalSubtotal).toBe(0);
      expect(pricing.grandTotal).toBe(0);
    });
  });
});
