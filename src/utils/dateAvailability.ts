import {
  parseISO,
  isBefore,
  isAfter,
  addDays,
  startOfDay,
  isValid,
  format,
  eachDayOfInterval,
} from 'date-fns';
import { Booking, BookingStatus } from '@/types/booking.types';
import { OutfitStatus } from '@/types/outfit.types';
import { CLEANING_BUFFER_DAYS } from './bookingCalculations';

// Statuses that represent active reservations reserving inventory
const BLOCKING_STATUSES: BookingStatus[] = [
  'pending',
  'confirmed',
  'active',
  'returned',
  'cleaning',
];

export interface BlockedDateRange {
  startDate: string;
  endDate: string;
  cleaningEndDate: string;
  reason: 'rental' | 'cleaning' | 'maintenance';
}

/**
 * Checks if a given date string is in the past relative to today (start of day).
 */
export function isDateInPast(dateStr: string): boolean {
  if (!dateStr) return false;
  const date = parseISO(dateStr);
  if (!isValid(date)) return false;
  const today = startOfDay(new Date());
  return isBefore(startOfDay(date), today);
}

/**
 * Determines whether two date intervals overlap, taking cleaning buffer into account.
 * Blocked interval for an existing booking is [existingStart, existingEnd + cleaningBufferDays].
 */
export function doesDateRangeOverlap(
  startAStr: string,
  endAStr: string,
  startBStr: string,
  endBStr: string,
  bufferDays: number = CLEANING_BUFFER_DAYS
): boolean {
  const startA = startOfDay(parseISO(startAStr));
  const endA = startOfDay(parseISO(endAStr));
  const startB = startOfDay(parseISO(startBStr));
  // The existing booking holds the outfit until endB + bufferDays
  const endBWithBuffer = startOfDay(addDays(parseISO(endBStr), bufferDays));

  if (!isValid(startA) || !isValid(endA) || !isValid(startB) || !isValid(endBWithBuffer)) {
    return false;
  }

  // Range A is completely before Range B (including buffer)
  if (isBefore(endA, startB)) {
    return false;
  }

  // Range A is completely after Range B (including buffer)
  if (isAfter(startA, endBWithBuffer)) {
    return false;
  }

  // Otherwise, there is a date collision
  return true;
}

/**
 * Validates whether an outfit is available for a requested rental period.
 */
export function checkOutfitAvailability({
  startDate,
  endDate,
  outfitStatus,
  existingBookings = [],
  cleaningBufferDays = CLEANING_BUFFER_DAYS,
}: {
  startDate: string;
  endDate: string;
  outfitStatus: OutfitStatus;
  existingBookings?: Booking[];
  cleaningBufferDays?: number;
}): {
  isAvailable: boolean;
  reason?: string;
} {
  // 1. Check outfit overall inventory status
  if (outfitStatus === 'cleaning') {
    return { isAvailable: false, reason: 'Outfit is currently undergoing scheduled deep cleaning.' };
  }
  if (outfitStatus === 'maintenance') {
    return { isAvailable: false, reason: 'Outfit is temporarily under repair and preservation.' };
  }
  if (outfitStatus === 'retired') {
    return { isAvailable: false, reason: 'This outfit has been retired from the collection.' };
  }

  // 2. Validate valid dates
  if (!startDate || !endDate) {
    return { isAvailable: false, reason: 'Please select both start and return dates.' };
  }

  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (!isValid(start) || !isValid(end)) {
    return { isAvailable: false, reason: 'Invalid date selection.' };
  }

  // 3. Prevent past dates
  if (isDateInPast(startDate)) {
    return { isAvailable: false, reason: 'Rental start date cannot be in the past.' };
  }

  // 4. Return date must be on or after start date
  if (isBefore(end, start)) {
    return { isAvailable: false, reason: 'Return date must be on or after rental start date.' };
  }

  // 5. Check conflicts against active bookings
  const conflictingBooking = existingBookings.find((booking) => {
    if (!BLOCKING_STATUSES.includes(booking.status)) {
      return false;
    }

    return doesDateRangeOverlap(
      startDate,
      endDate,
      booking.period.startDate,
      booking.period.endDate,
      cleaningBufferDays
    );
  });

  if (conflictingBooking) {
    return {
      isAvailable: false,
      reason: `Dates conflict with an existing reservation (includes 1-day sanitization buffer).`,
    };
  }

  return { isAvailable: true };
}

/**
 * Returns a list of all individual blocked dates (formatted as 'YYYY-MM-DD')
 * for an outfit given its existing bookings, including cleaning buffer days.
 */
export function getBlockedDatesList(
  existingBookings: Booking[],
  cleaningBufferDays: number = CLEANING_BUFFER_DAYS
): string[] {
  const blockedDates = new Set<string>();

  existingBookings
    .filter((b) => BLOCKING_STATUSES.includes(b.status))
    .forEach((booking) => {
      try {
        const start = parseISO(booking.period.startDate);
        const endWithBuffer = addDays(parseISO(booking.period.endDate), cleaningBufferDays);

        if (isValid(start) && isValid(endWithBuffer)) {
          const days = eachDayOfInterval({ start, end: endWithBuffer });
          days.forEach((day) => {
            blockedDates.add(format(day, 'yyyy-MM-dd'));
          });
        }
      } catch {
        // Skip malformed booking dates safely
      }
    });

  return Array.from(blockedDates);
}
