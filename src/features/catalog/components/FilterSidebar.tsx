import React from 'react';
import { Category, Occasion, OutfitSize } from '@/types/outfit.types';
import { getCategoryLabel, getOccasionLabel } from '@/utils/formatters';
import { RotateCcw, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface FilterState {
  category: Category | 'all';
  occasion: Occasion | 'all';
  size: OutfitSize | 'all';
  maxPrice: number;
  search: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  onCloseMobile?: () => void;
  isMobile?: boolean;
}

const CATEGORIES: (Category | 'all')[] = [
  'all',
  'lehengas',
  'gowns',
  'tuxedos',
  'sherwanis',
  'cocktail_dresses',
  'sarees',
];

const OCCASIONS: (Occasion | 'all')[] = [
  'all',
  'wedding',
  'gala',
  'reception',
  'cocktail',
  'engagement',
  'sangeet',
];

const SIZES: (OutfitSize | 'all')[] = ['all', 'XS', 'S', 'M', 'L', 'XL', 'Custom'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  onCloseMobile,
  isMobile = false,
}) => {
  const isAnyFilterActive =
    filters.category !== 'all' ||
    filters.occasion !== 'all' ||
    filters.size !== 'all' ||
    filters.maxPrice < 500 ||
    filters.search !== '';

  return (
    <div className="space-y-8 text-left">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-champagne-200">
        <h3 className="font-serif text-lg font-medium text-charcoal-900">Filter Archive</h3>
        <div className="flex items-center gap-2">
          {isAnyFilterActive && (
            <button
              onClick={onReset}
              className="text-xs text-brand-700 hover:text-brand-900 font-semibold flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
          {isMobile && onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-full text-charcoal-500 hover:bg-champagne-100"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-bold text-charcoal-700">
          Garment Category
        </h4>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            const label = cat === 'all' ? 'All Collections' : getCategoryLabel(cat);
            return (
              <button
                key={cat}
                onClick={() => onChange({ category: cat })}
                className={cn(
                  'w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between',
                  isSelected
                    ? 'bg-brand-500 text-white font-semibold shadow-sm'
                    : 'text-charcoal-600 hover:bg-champagne-100/70 hover:text-charcoal-900'
                )}
              >
                <span>{label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Occasion Filter */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-bold text-charcoal-700">
          Celebration Occasion
        </h4>
        <div className="space-y-1.5">
          {OCCASIONS.map((occ) => {
            const isSelected = filters.occasion === occ;
            const label = occ === 'all' ? 'All Occasions' : getOccasionLabel(occ);
            return (
              <button
                key={occ}
                onClick={() => onChange({ occasion: occ })}
                className={cn(
                  'w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between',
                  isSelected
                    ? 'bg-brand-500 text-white font-semibold shadow-sm'
                    : 'text-charcoal-600 hover:bg-champagne-100/70 hover:text-charcoal-900'
                )}
              >
                <span>{label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Size Filter */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-bold text-charcoal-700">
          Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((sz) => {
            const isSelected = filters.size === sz;
            return (
              <button
                key={sz}
                onClick={() => onChange({ size: sz })}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all',
                  isSelected
                    ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                    : 'bg-white text-charcoal-700 border-champagne-300 hover:border-brand-400'
                )}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Daily Rental Price Range */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs uppercase tracking-wider font-bold text-charcoal-700">
            Max Daily Rate
          </h4>
          <span className="text-xs font-bold text-brand-700">
            ${filters.maxPrice} / day
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="500"
          step="10"
          value={filters.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-brand-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-charcoal-400 font-semibold">
          <span>$100</span>
          <span>$250</span>
          <span>$500</span>
        </div>
      </div>
    </div>
  );
};
