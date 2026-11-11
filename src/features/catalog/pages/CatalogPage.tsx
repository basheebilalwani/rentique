import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { outfitApi } from '@/services/api/outfitApi';
import { Category, Occasion, OutfitSize } from '@/types/outfit.types';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar, FilterState } from '../components/FilterSidebar';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDebounce } from '@/hooks/useDebounce';
import { getCategoryLabel, getOccasionLabel } from '@/utils/formatters';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // 1. Single Source of Truth: Read active filters directly from URL search parameters
  const category = (searchParams.get('category') as Category | 'all') || 'all';
  const occasion = (searchParams.get('occasion') as Occasion | 'all') || 'all';
  const size = (searchParams.get('size') as OutfitSize | 'all') || 'all';
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 500;
  const sortBy = (searchParams.get('sortBy') as FilterState['sortBy']) || 'featured';

  // Local state for search text so typing remains immediate without UI lag
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Sync debounced search to URL query parameters
  useEffect(() => {
    const currentUrlSearch = searchParams.get('search') || '';
    if (debouncedSearch !== currentUrlSearch) {
      const params = new URLSearchParams(searchParams);
      if (debouncedSearch) {
        params.set('search', debouncedSearch);
      } else {
        params.delete('search');
      }
      setSearchParams(params, { replace: true });
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  // If URL search parameter changes externally (e.g. navigation back or reset), sync input
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== searchInput && urlSearch === '') {
      setSearchInput('');
    }
  }, [searchParams]);

  const filters: FilterState = useMemo(
    () => ({
      category,
      occasion,
      size,
      maxPrice,
      search: searchInput,
      sortBy,
    }),
    [category, occasion, size, maxPrice, searchInput, sortBy]
  );

  // Query outfits using TanStack Query
  const { data: outfits = [], isLoading, isError } = useQuery({
    queryKey: [
      'outfits',
      category,
      occasion,
      size,
      maxPrice,
      debouncedSearch,
      sortBy,
    ],
    queryFn: () =>
      outfitApi.getOutfits({
        category,
        occasion,
        size,
        maxPrice,
        searchQuery: debouncedSearch,
        sortBy,
      }),
  });

  const handleFilterChange = (updated: Partial<FilterState>) => {
    const params = new URLSearchParams(searchParams);

    if (updated.category !== undefined) {
      if (updated.category === 'all') params.delete('category');
      else params.set('category', updated.category);
    }
    if (updated.occasion !== undefined) {
      if (updated.occasion === 'all') params.delete('occasion');
      else params.set('occasion', updated.occasion);
    }
    if (updated.size !== undefined) {
      if (updated.size === 'all') params.delete('size');
      else params.set('size', updated.size);
    }
    if (updated.maxPrice !== undefined) {
      if (updated.maxPrice >= 500) params.delete('maxPrice');
      else params.set('maxPrice', String(updated.maxPrice));
    }
    if (updated.sortBy !== undefined) {
      if (updated.sortBy === 'featured') params.delete('sortBy');
      else params.set('sortBy', updated.sortBy);
    }
    if (updated.search !== undefined) {
      setSearchInput(updated.search);
      if (updated.search === '') {
        params.delete('search');
      }
    }

    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const headerDetails = useMemo(() => {
    if (occasion === 'wedding') {
      return {
        title: 'Weddings & Celebrations',
        description:
          'Hand-embellished bridal lehengas, regal sherwanis, and heirloom silk sarees crafted for milestone nuptials.',
      };
    }
    if (occasion === 'gala') {
      return {
        title: 'Black Tie & Gala Collection',
        description:
          'Dramatic red carpet evening gowns, crystal embellishments, and bespoke Grosgrain lapel tuxedos.',
      };
    }
    if (category !== 'all') {
      return {
        title: `${getCategoryLabel(category as Category)} Archive`,
        description: `Curated designer ${getCategoryLabel(category as Category).toLowerCase()} available for private hire.`,
      };
    }
    return {
      title: 'The Couture Archive',
      description:
        'Explore iconic garments crafted by the world’s most celebrated luxury designers.',
    };
  }, [occasion, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-charcoal-950 mb-3">
          {headerDetails.title}
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 font-normal">
          {headerDetails.description}
        </p>
      </div>

      {/* Search & Mobile Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-luxury border border-champagne-200/80 shadow-luxury">
        {/* Search input */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            placeholder="Search by designer, garment, or fabric..."
            className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-champagne-50/50 rounded-luxury border border-champagne-200 focus:outline-none focus:border-brand-500"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-600"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Mobile trigger */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-luxury border border-champagne-300 bg-white text-charcoal-800"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal-500 hidden sm:inline font-medium">Sort By:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })
              }
              aria-label="Sort outfits by"
              className="text-xs font-semibold py-2 px-3 rounded-luxury border border-champagne-300 bg-white text-charcoal-800 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="featured">Featured Runway</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Row */}
      {(filters.category !== 'all' ||
        filters.occasion !== 'all' ||
        filters.size !== 'all' ||
        filters.maxPrice < 500 ||
        debouncedSearch) && (
        <div className="flex flex-wrap items-center gap-2 mb-8 text-xs">
          <span className="text-charcoal-500 font-medium">Active:</span>
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-900 border border-brand-200">
              <span>{getCategoryLabel(filters.category)}</span>
              <button
                onClick={() => handleFilterChange({ category: 'all' })}
                className="hover:text-rose-600"
                aria-label={`Remove ${getCategoryLabel(filters.category)} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.occasion !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-900 border border-brand-200">
              <span>{getOccasionLabel(filters.occasion)}</span>
              <button
                onClick={() => handleFilterChange({ occasion: 'all' })}
                className="hover:text-rose-600"
                aria-label={`Remove ${getOccasionLabel(filters.occasion)} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.size !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal-100 text-charcoal-900 border border-charcoal-300">
              <span>Size: {filters.size}</span>
              <button
                onClick={() => handleFilterChange({ size: 'all' })}
                className="hover:text-rose-600"
                aria-label={`Remove Size ${filters.size} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.maxPrice < 500 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-900 border border-brand-200">
              <span>Max: ${filters.maxPrice}/day</span>
              <button
                onClick={() => handleFilterChange({ maxPrice: 500 })}
                className="hover:text-rose-600"
                aria-label="Remove max price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {debouncedSearch && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-900 border border-brand-200">
              <span>&ldquo;{debouncedSearch}&rdquo;</span>
              <button
                onClick={() => handleFilterChange({ search: '' })}
                className="hover:text-rose-600"
                aria-label="Clear search query"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-brand-700 hover:text-brand-900 font-semibold underline ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Grid & Desktop Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar (1 column) */}
        <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-luxury border border-champagne-200/80 shadow-luxury h-fit sticky top-28">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </aside>

        {/* Product Grid Area (3 columns) */}
        <section className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              title="Failed to Load Archive"
              description="Unable to fetch outfits from the catalogue. Please try again."
              actionLabel="Retry"
              onAction={handleResetFilters}
            />
          ) : outfits.length === 0 ? (
            <EmptyState
              title="No Couture Outfits Found"
              description="No garments matched your specific search or filter criteria. Try broadening your filters."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-charcoal-500 mb-4 px-1">
                <span>Showing {outfits.length} couture pieces</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {outfits.map((outfit) => (
                  <ProductCard key={outfit.id} outfit={outfit} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              onCloseMobile={() => setMobileFilterOpen(false)}
              isMobile
            />
            <div className="pt-6 border-t border-champagne-200 mt-6">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-charcoal-900 text-white rounded-luxury text-xs uppercase font-bold tracking-wider"
              >
                View {outfits.length} Outfits
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
