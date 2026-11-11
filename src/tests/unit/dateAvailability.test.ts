import { describe, it, expect } from 'vitest';
import {
  doesDateRangeOverlap,
  checkOutfitAvailability,
  getBlockedDatesList,
} from '@/utils/dateAvailability';
import { Booking } from '@/types/booking.types';

// Mock test booking: Dec 10 to Dec 12. With 1 day buffer, outfit is blocked until Dec 13.
const mockBooking: Booking = {
  id: 'bkg-1',
  outfitId: 'outfit-1',
  outfitName: 'Emerald Silk Lehenga',
  outfitDesigner: 'Sabyasachi',
  outfitImage: '/images/lehenga-1.jpg',
  selectedSize: 'M',
  selectedColour: 'Emerald Green',
  userId: 'user-1',
  customerName: 'Aria Sharma',
  customerEmail: 'aria@example.com',
  customerPhone: '+1-555-0192',
  deliveryAddress: '123 Park Ave, New York, NY',
  period: {
    startDate: '2026-12-10',
    endDate: '2026-12-12',
    rentalDays: 3,
  },
  cleaningBufferDays: 1,
  pricing: {
    rentalDays: 3,
    dailyPrice: 150,
    rentalSubtotal: 450,
    securityDeposit: 300,
    cleaningFee: 25,
    taxes: 36,
    discount: 0,
    grandTotal: 811,
  },
  status: 'confirmed',
  createdAt: '2026-11-01',
  updatedAt: '2026-11-01',
};

describe('Date Availability & Cleaning Buffer Unit Tests', () => {
  describe('doesDateRangeOverlap', () => {
    it('detects direct overlap during rental dates', () => {
      // Overlaps Dec 11-13 with existing Dec 10-12
      const overlaps = doesDateRangeOverlap('2026-12-11', '2026-12-13', '2026-12-10', '2026-12-12', 1);
      expect(overlaps).toBe(true);
    });

    it('detects collision on cleaning buffer day (Dec 13)', () => {
      // Existing booking ends Dec 12. Dec 13 is cleaning buffer.
      // New requested start is Dec 13. Should collide!
      const overlaps = doesDateRangeOverlap('2026-12-13', '2026-12-15', '2026-12-10', '2026-12-12', 1);
      expect(overlaps).toBe(true);
    });

    it('allows booking immediately after cleaning buffer ends (Dec 14)', () => {
      // Dec 10-12 (rental), Dec 13 (cleaning). Dec 14 is fully available!
      const overlaps = doesDateRangeOverlap('2026-12-14', '2026-12-16', '2026-12-10', '2026-12-12', 1);
      expect(overlaps).toBe(false);
    });

    it('allows booking completely before existing rental (Dec 5-8)', () => {
      const overlaps = doesDateRangeOverlap('2026-12-05', '2026-12-08', '2026-12-10', '2026-12-12', 1);
      expect(overlaps).toBe(false);
    });
  });

  describe('checkOutfitAvailability', () => {
    it('flags unavailable if outfit is in maintenance status', () => {
      const result = checkOutfitAvailability({
        startDate: '2026-12-20',
        endDate: '2026-12-22',
        outfitStatus: 'maintenance',
      });
      expect(result.isAvailable).toBe(false);
      expect(result.reason).toContain('repair');
    });

    it('flags unavailable if outfit is in cleaning status', () => {
      const result = checkOutfitAvailability({
        startDate: '2026-12-20',
        endDate: '2026-12-22',
        outfitStatus: 'cleaning',
      });
      expect(result.isAvailable).toBe(false);
      expect(result.reason).toContain('cleaning');
    });

    it('rejects if return date is earlier than start date', () => {
      const result = checkOutfitAvailability({
        startDate: '2026-12-25',
        endDate: '2026-12-20',
        outfitStatus: 'available',
      });
      expect(result.isAvailable).toBe(false);
      expect(result.reason).toContain('Return date must be on or after');
    });

    it('rejects dates that conflict with active reservations', () => {
      const result = checkOutfitAvailability({
        startDate: '2026-12-12',
        endDate: '2026-12-14',
        outfitStatus: 'available',
        existingBookings: [mockBooking],
      });
      expect(result.isAvailable).toBe(false);
      expect(result.reason).toContain('conflict');
    });

    it('allows booking when existing booking has cancelled or rejected status', () => {
      const cancelledBooking = { ...mockBooking, status: 'cancelled' as const };
      const result = checkOutfitAvailability({
        startDate: '2026-12-10',
        endDate: '2026-12-12',
        outfitStatus: 'available',
        existingBookings: [cancelledBooking],
      });
      expect(result.isAvailable).toBe(true);
    });
  });

  describe('getBlockedDatesList', () => {
    it('includes all rental days plus cleaning buffer day', () => {
      const blocked = getBlockedDatesList([mockBooking], 1);
      // Dec 10, 11, 12 (rental) + Dec 13 (cleaning)
      expect(blocked).toContain('2026-12-10');
      expect(blocked).toContain('2026-12-11');
      expect(blocked).toContain('2026-12-12');
      expect(blocked).toContain('2026-12-13');
      expect(blocked).not.toContain('2026-12-14');
    });
  });
});
