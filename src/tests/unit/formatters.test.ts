import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatRentalDays,
  getCategoryLabel,
  getOccasionLabel,
} from '@/utils/formatters';

describe('Formatters Unit Tests', () => {
  it('formats numeric values to USD currency strings', () => {
    expect(formatCurrency(250)).toBe('$250');
    expect(formatCurrency(1500)).toBe('$1,500');
    expect(formatCurrency(99.5, true)).toBe('$99.50');
  });

  it('formats ISO dates correctly', () => {
    expect(formatDate('2026-12-25')).toBe('Dec 25, 2026');
    expect(formatDate('2026-01-01', 'yyyy-MM-dd')).toBe('2026-01-01');
  });

  it('formats rental duration days', () => {
    expect(formatRentalDays(1)).toBe('1 Day');
    expect(formatRentalDays(4)).toBe('4 Days');
    expect(formatRentalDays(0)).toBe('0 Days');
  });

  it('translates category enums to luxury titles', () => {
    expect(getCategoryLabel('lehengas')).toBe('Bridal Lehengas');
    expect(getCategoryLabel('gowns')).toBe('Evening Gowns');
    expect(getCategoryLabel('tuxedos')).toBe('Designer Tuxedos');
    expect(getCategoryLabel('sherwanis')).toBe('Royal Sherwanis');
    expect(getCategoryLabel('sarees')).toBe('Heritage Sarees');
    expect(getCategoryLabel('cocktail_dresses')).toBe('Cocktail Dresses');
  });

  it('translates occasion enums to celebration labels', () => {
    expect(getOccasionLabel('wedding')).toBe('Weddings');
    expect(getOccasionLabel('gala')).toBe('Black Tie Galas');
    expect(getOccasionLabel('reception')).toBe('Receptions');
  });
});
