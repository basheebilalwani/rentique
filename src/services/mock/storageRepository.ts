import { Outfit } from '@/types/outfit.types';
import { Booking, BookingStatus } from '@/types/booking.types';
import { User } from '@/types/user.types';
import { INITIAL_OUTFITS } from './initialOutfits';

const STORAGE_KEYS = {
  OUTFITS: 'rentique_outfits_v3',
  BOOKINGS: 'rentique_bookings_v3',
  WISHLIST: 'rentique_wishlist_v3',
  AUTH_USER: 'rentique_auth_user_v2',
};

// Initial sample bookings to demonstrate availability blocking, status badges, and history
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bkg-101',
    outfitId: 'outfit-1',
    outfitName: 'Emerald Heritage Velvet Lehenga',
    outfitDesigner: 'Sabyasachi',
    outfitImage: 'https://images.unsplash.com/photo-1756483510767-35245638c057?auto=format&fit=crop&w=1200&q=80',
    selectedSize: 'M',
    selectedColour: 'Emerald Green',
    userId: 'user-demo-1',
    customerName: 'Maya Patel',
    customerEmail: 'maya.patel@example.com',
    customerPhone: '+1-555-0144',
    deliveryAddress: '740 Park Avenue, Apt 8B, New York, NY 10021',
    period: {
      startDate: '2026-12-18',
      endDate: '2026-12-21',
      rentalDays: 4,
    },
    cleaningBufferDays: 1,
    pricing: {
      rentalDays: 4,
      dailyPrice: 220,
      rentalSubtotal: 880,
      securityDeposit: 450,
      cleaningFee: 25,
      taxes: 70,
      discount: 0,
      grandTotal: 1425,
    },
    status: 'confirmed',
    createdAt: '2026-11-02T10:30:00Z',
    updatedAt: '2026-11-03T14:15:00Z',
    notes: 'Please ensure matching embroidered potli bag is included.',
  },
  {
    id: 'bkg-102',
    outfitId: 'outfit-3',
    outfitName: 'Midnight Silk Grosgrain Peak Tuxedo',
    outfitDesigner: 'Ralph Lauren Purple Label',
    outfitImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    selectedSize: 'L',
    selectedColour: 'Midnight Navy',
    userId: 'user-demo-1',
    customerName: 'Maya Patel',
    customerEmail: 'maya.patel@example.com',
    customerPhone: '+1-555-0144',
    deliveryAddress: '740 Park Avenue, Apt 8B, New York, NY 10021',
    period: {
      startDate: '2026-11-20',
      endDate: '2026-11-22',
      rentalDays: 3,
    },
    cleaningBufferDays: 1,
    pricing: {
      rentalDays: 3,
      dailyPrice: 160,
      rentalSubtotal: 480,
      securityDeposit: 300,
      cleaningFee: 25,
      taxes: 38,
      discount: 0,
      grandTotal: 843,
    },
    status: 'pending',
    createdAt: '2026-11-09T08:00:00Z',
    updatedAt: '2026-11-09T08:00:00Z',
    notes: 'Renting for annual Metropolitan Gala.',
  },
  {
    id: 'bkg-103',
    outfitId: 'outfit-9',
    outfitName: 'Crimson Royal Silk Bridal Lehenga',
    outfitDesigner: 'Manish Malhotra',
    outfitImage: 'https://images.unsplash.com/photo-1756483488645-5973a1a92e33?auto=format&fit=crop&w=1200&q=80',
    selectedSize: 'S',
    selectedColour: 'Crimson Red',
    userId: 'user-demo-2',
    customerName: 'Priyanka Sen',
    customerEmail: 'priyanka.sen@luxury.com',
    customerPhone: '+1-555-0298',
    deliveryAddress: '15 Central Park West, New York, NY',
    period: {
      startDate: '2026-11-10',
      endDate: '2026-11-13',
      rentalDays: 4,
    },
    cleaningBufferDays: 1,
    pricing: {
      rentalDays: 4,
      dailyPrice: 260,
      rentalSubtotal: 1040,
      securityDeposit: 500,
      cleaningFee: 25,
      taxes: 83,
      discount: 0,
      grandTotal: 1648,
    },
    status: 'active',
    createdAt: '2026-10-25T11:00:00Z',
    updatedAt: '2026-11-08T09:00:00Z',
    notes: 'Dispatched in reinforced bridal travel vault.',
  },
  {
    id: 'bkg-104',
    outfitId: 'outfit-2',
    outfitName: 'Celestial Embellished Tulle Evening Gown',
    outfitDesigner: 'Marchesa Notte',
    outfitImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80',
    selectedSize: 'XS',
    selectedColour: 'Champagne Blush',
    userId: 'user-demo-3',
    customerName: 'Eleanor Vance',
    customerEmail: 'eleanor@vanceart.org',
    customerPhone: '+1-555-0811',
    deliveryAddress: '888 5th Ave, New York, NY',
    period: {
      startDate: '2026-11-05',
      endDate: '2026-11-07',
      rentalDays: 3,
    },
    cleaningBufferDays: 1,
    pricing: {
      rentalDays: 3,
      dailyPrice: 180,
      rentalSubtotal: 540,
      securityDeposit: 360,
      cleaningFee: 25,
      taxes: 43,
      discount: 0,
      grandTotal: 968,
    },
    status: 'cleaning',
    createdAt: '2026-10-20T14:00:00Z',
    updatedAt: '2026-11-08T16:00:00Z',
    notes: 'Under post-event eco-dry clean inspection.',
  },
  {
    id: 'bkg-105',
    outfitId: 'outfit-16',
    outfitName: 'Royal Crimson & Gold Embroidered Groom Sherwani',
    outfitDesigner: 'Rohit Bal',
    outfitImage: 'https://images.unsplash.com/photo-1781106784087-d6f4432ad721?auto=format&fit=crop&w=1200&q=80',
    selectedSize: 'L',
    selectedColour: 'Crimson Red',
    userId: 'user-demo-1',
    customerName: 'Maya Patel',
    customerEmail: 'maya.patel@example.com',
    customerPhone: '+1-555-0144',
    deliveryAddress: '740 Park Avenue, Apt 8B, New York, NY 10021',
    period: {
      startDate: '2026-10-12',
      endDate: '2026-10-15',
      rentalDays: 4,
    },
    cleaningBufferDays: 1,
    pricing: {
      rentalDays: 4,
      dailyPrice: 205,
      rentalSubtotal: 820,
      securityDeposit: 420,
      cleaningFee: 25,
      taxes: 66,
      discount: 0,
      grandTotal: 1331,
    },
    status: 'completed',
    createdAt: '2026-10-01T12:00:00Z',
    updatedAt: '2026-10-17T11:00:00Z',
  },
];

// Default demo customer user
export const DEMO_CUSTOMER: User = {
  id: 'user-demo-1',
  name: 'Maya Patel',
  email: 'maya.patel@example.com',
  role: 'customer',
  phone: '+1-555-0144',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  address: '740 Park Avenue, Apt 8B, New York, NY 10021',
  createdAt: '2026-01-10T00:00:00Z',
};

// Default demo admin user
export const DEMO_ADMIN: User = {
  id: 'user-admin-1',
  name: 'Victoria Hastings',
  email: 'admin@rentique.luxury',
  role: 'admin',
  phone: '+1-555-0999',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  address: 'Rentique HQ, 5th Avenue, New York, NY',
  createdAt: '2025-10-01T00:00:00Z',
};

/**
 * Utility to simulate realistic asynchronous network latency (150ms - 400ms).
 */
export async function simulateNetworkDelay(ms: number = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Outfits Repository
export const storageRepository = {
  getOutfits(): Outfit[] {
    const raw = localStorage.getItem(STORAGE_KEYS.OUTFITS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(INITIAL_OUTFITS));
      return INITIAL_OUTFITS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length < INITIAL_OUTFITS.length) {
        localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(INITIAL_OUTFITS));
        return INITIAL_OUTFITS;
      }
      return parsed;
    } catch {
      return INITIAL_OUTFITS;
    }
  },

  saveOutfits(outfits: Outfit[]): void {
    localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(outfits));
  },

  getOutfitById(id: string): Outfit | undefined {
    return this.getOutfits().find((item) => item.id === id);
  },

  saveOutfit(outfit: Outfit): Outfit {
    const outfits = this.getOutfits();
    const existingIndex = outfits.findIndex((o) => o.id === outfit.id);
    if (existingIndex >= 0) {
      outfits[existingIndex] = outfit;
    } else {
      outfits.unshift(outfit);
    }
    this.saveOutfits(outfits);
    return outfit;
  },

  deleteOutfit(id: string): boolean {
    const outfits = this.getOutfits();
    const filtered = outfits.filter((o) => o.id !== id);
    if (filtered.length !== outfits.length) {
      this.saveOutfits(filtered);
      return true;
    }
    return false;
  },

  // Bookings Repository
  getBookings(): Booking[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length < INITIAL_BOOKINGS.length) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
        return INITIAL_BOOKINGS;
      }
      return parsed;
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  saveBookings(bookings: Booking[]): void {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  },

  getBookingById(id: string): Booking | undefined {
    return this.getBookings().find((b) => b.id === id);
  },

  addBooking(booking: Booking): Booking {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    this.saveBookings(bookings);
    return booking;
  },

  updateBookingStatus(id: string, status: BookingStatus): Booking | null {
    const bookings = this.getBookings();
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return null;

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    this.saveBookings(bookings);
    return booking;
  },

  // Wishlist Repository
  getWishlist(): string[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (!raw) {
      // Default with outfit-1 and outfit-2
      const defaults = ['outfit-1', 'outfit-2'];
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(defaults));
      return defaults;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  toggleWishlist(outfitId: string): string[] {
    const current = this.getWishlist();
    const exists = current.includes(outfitId);
    const updated = exists ? current.filter((id) => id !== outfitId) : [...current, outfitId];
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updated));
    return updated;
  },

  // Auth User Repository
  getAuthUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!raw) {
      // Initialize with demo customer session
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(DEMO_CUSTOMER));
      return DEMO_CUSTOMER;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEMO_CUSTOMER;
    }
  },

  setAuthUser(user: User | null): void {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    }
  },

  // Reset demo storage to fresh state
  resetAll(): void {
    localStorage.setItem(STORAGE_KEYS.OUTFITS, JSON.stringify(INITIAL_OUTFITS));
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(['outfit-1', 'outfit-2']));
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(DEMO_CUSTOMER));
  },
};
