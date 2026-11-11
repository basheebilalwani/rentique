import { OutfitSize } from './outfit.types';

export type BookingStatus =
  | 'pending'     // Waiting for admin review & confirmation
  | 'confirmed'   // Confirmed & scheduled for dispatch
  | 'active'      // Currently with the customer
  | 'returned'    // Returned by customer, ready for inspection
  | 'cleaning'    // Under mandatory sanitization & care
  | 'completed'   // Fully completed & available again
  | 'cancelled'   // Cancelled by user or admin
  | 'rejected';   // Rejected by admin

export interface RentalPeriod {
  startDate: string; // ISO date format YYYY-MM-DD
  endDate: string;   // ISO date format YYYY-MM-DD
  rentalDays: number;
}

export interface PricingBreakdown {
  rentalDays: number;
  dailyPrice: number;
  rentalSubtotal: number;
  securityDeposit: number; // Fully refundable upon undamaged return
  cleaningFee: number;     // Professional eco-friendly garment sanitization
  taxes: number;           // Standard applicable tax (8%)
  discount: number;
  grandTotal: number;
}

export interface Booking {
  id: string;
  outfitId: string;
  outfitName: string;
  outfitDesigner: string;
  outfitImage: string;
  selectedSize: OutfitSize;
  selectedColour: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  period: RentalPeriod;
  cleaningBufferDays: number; // Typically 1 day
  pricing: PricingBreakdown;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface CreateBookingDTO {
  outfitId: string;
  selectedSize: OutfitSize;
  selectedColour: string;
  startDate: string;
  endDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  notes?: string;
}
