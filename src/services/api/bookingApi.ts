import { Booking, BookingStatus, CreateBookingDTO } from '@/types/booking.types';
import { storageRepository, simulateNetworkDelay } from '../mock/storageRepository';
import { calculateRentalPricing, CLEANING_BUFFER_DAYS } from '@/utils/bookingCalculations';
import { checkOutfitAvailability } from '@/utils/dateAvailability';

// Valid status transitions for the booking lifecycle state machine
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'rejected', 'cancelled'],
  confirmed: ['active', 'cancelled'],
  active: ['returned'],
  returned: ['cleaning'],
  cleaning: ['completed'],
  completed: [],
  cancelled: [],
  rejected: [],
};

export const bookingApi = {
  /**
   * Retrieves all bookings (admin view).
   */
  async getAllBookings(): Promise<Booking[]> {
    await simulateNetworkDelay(200);
    return storageRepository.getBookings();
  },

  /**
   * Retrieves bookings for a specific customer.
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    await simulateNetworkDelay(200);
    return storageRepository.getBookings().filter((b) => b.userId === userId);
  },

  /**
   * Retrieves active/blocking bookings for a specific outfit.
   */
  async getBookingsByOutfit(outfitId: string): Promise<Booking[]> {
    await simulateNetworkDelay(150);
    return storageRepository.getBookings().filter((b) => b.outfitId === outfitId);
  },

  /**
   * Submits a new rental reservation.
   * Strictly validates outfit availability on the server side prior to saving.
   */
  async createBooking(dto: CreateBookingDTO, userId: string): Promise<Booking> {
    await simulateNetworkDelay(350);

    const outfit = storageRepository.getOutfitById(dto.outfitId);
    if (!outfit) {
      throw new Error('The selected outfit is no longer in our catalogue.');
    }

    // 1. Double-check availability against existing bookings
    const existingOutfitBookings = storageRepository
      .getBookings()
      .filter((b) => b.outfitId === dto.outfitId);

    const availabilityCheck = checkOutfitAvailability({
      startDate: dto.startDate,
      endDate: dto.endDate,
      outfitStatus: outfit.status,
      existingBookings: existingOutfitBookings,
      cleaningBufferDays: CLEANING_BUFFER_DAYS,
    });

    if (!availabilityCheck.isAvailable) {
      throw new Error(
        availabilityCheck.reason || 'Outfit is unavailable for the selected dates.'
      );
    }

    // 2. Compute verified pricing breakdown
    const pricing = calculateRentalPricing({
      dailyPrice: outfit.dailyRentalPrice,
      retailPrice: outfit.retailPrice,
      securityDeposit: outfit.securityDeposit,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });

    const newBooking: Booking = {
      id: `bkg-${Date.now().toString(36)}`,
      outfitId: outfit.id,
      outfitName: outfit.name,
      outfitDesigner: outfit.designer,
      outfitImage: outfit.featuredImage,
      selectedSize: dto.selectedSize,
      selectedColour: dto.selectedColour,
      userId,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      customerPhone: dto.customerPhone,
      deliveryAddress: dto.deliveryAddress,
      period: {
        startDate: dto.startDate,
        endDate: dto.endDate,
        rentalDays: pricing.rentalDays,
      },
      cleaningBufferDays: CLEANING_BUFFER_DAYS,
      pricing,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: dto.notes,
    };

    return storageRepository.addBooking(newBooking);
  },

  /**
   * Admin: Updates booking lifecycle status adhering to the state machine.
   */
  async updateStatus(bookingId: string, newStatus: BookingStatus): Promise<Booking> {
    await simulateNetworkDelay(250);
    const booking = storageRepository.getBookingById(bookingId);
    if (!booking) {
      throw new Error(`Booking "${bookingId}" not found.`);
    }

    const allowed = ALLOWED_TRANSITIONS[booking.status];
    if (!allowed.includes(newStatus)) {
      throw new Error(
        `Invalid status transition: Cannot move from "${booking.status}" to "${newStatus}".`
      );
    }

    const updated = storageRepository.updateBookingStatus(bookingId, newStatus);
    if (!updated) {
      throw new Error(`Failed to update booking status.`);
    }

    // If booking was moved to 'cleaning', mark the outfit status accordingly
    if (newStatus === 'cleaning') {
      const outfit = storageRepository.getOutfitById(booking.outfitId);
      if (outfit && outfit.status === 'available') {
        storageRepository.saveOutfit({ ...outfit, status: 'cleaning' });
      }
    } else if (newStatus === 'completed') {
      // Completed cleaning -> return outfit to available
      const outfit = storageRepository.getOutfitById(booking.outfitId);
      if (outfit && outfit.status === 'cleaning') {
        storageRepository.saveOutfit({ ...outfit, status: 'available' });
      }
    }

    return updated;
  },

  /**
   * Customer: Cancels a reservation.
   */
  async cancelBooking(bookingId: string, userId: string): Promise<Booking> {
    await simulateNetworkDelay(250);
    const booking = storageRepository.getBookingById(bookingId);
    if (!booking) {
      throw new Error('Booking not found.');
    }
    if (booking.userId !== userId) {
      throw new Error('Unauthorized to cancel this booking.');
    }
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      throw new Error(`Cannot cancel a booking with status "${booking.status}".`);
    }

    return this.updateStatus(bookingId, 'cancelled');
  },
};
