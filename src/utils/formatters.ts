import { format, parseISO } from 'date-fns';
import { Category, Occasion } from '@/types/outfit.types';

/**
 * Formats a numeric value into a USD currency string.
 * Example: 250 -> "$250"
 */
export function formatCurrency(amount: number, showDecimals: boolean = false): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

/**
 * Formats an ISO date string or Date object into human-readable format.
 * Example: "2026-12-05" -> "Dec 5, 2026"
 */
export function formatDate(date: string | Date, formatPattern: string = 'MMM d, yyyy'): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, formatPattern);
  } catch {
    return String(date);
  }
}

/**
 * Formats a rental duration count into readable string.
 * Example: 4 -> "4 Days Rental"
 */
export function formatRentalDays(days: number): string {
  if (days <= 0) return '0 Days';
  return `${days} ${days === 1 ? 'Day' : 'Days'}`;
}

/**
 * Maps category enum keys to display names.
 */
export function getCategoryLabel(category: Category): string {
  const map: Record<Category, string> = {
    gowns: 'Evening Gowns',
    lehengas: 'Bridal Lehengas',
    sherwanis: 'Royal Sherwanis',
    tuxedos: 'Designer Tuxedos',
    cocktail_dresses: 'Cocktail Dresses',
    sarees: 'Heritage Sarees',
  };
  return map[category] || category;
}

/**
 * Maps occasion enum keys to display names.
 */
export function getOccasionLabel(occasion: Occasion): string {
  const map: Record<Occasion, string> = {
    wedding: 'Weddings',
    reception: 'Receptions',
    gala: 'Black Tie Galas',
    cocktail: 'Cocktail Soirées',
    engagement: 'Engagements',
    sangeet: 'Sangeet & Mehendi',
  };
  return map[occasion] || occasion;
}
