export type Category =
  | 'gowns'
  | 'lehengas'
  | 'sherwanis'
  | 'tuxedos'
  | 'cocktail_dresses'
  | 'sarees';

export type Occasion =
  | 'wedding'
  | 'reception'
  | 'gala'
  | 'cocktail'
  | 'engagement'
  | 'sangeet';

export type OutfitSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Custom';

export type OutfitStatus =
  | 'available'
  | 'cleaning'
  | 'maintenance'
  | 'retired';

export interface Outfit {
  id: string;
  name: string;
  designer: string;
  description: string;
  category: Category;
  occasion: Occasion;
  sizes: OutfitSize[];
  colours: string[];
  retailPrice: number;        // Original retail MSRP
  dailyRentalPrice: number;   // Daily rental rate
  securityDeposit: number;    // Refundable security deposit
  images: string[];           // Gallery images
  featuredImage: string;      // Main display thumbnail
  fabric: string;             // E.g. Raw silk, Organza, Velvet
  careInstructions: string[];
  rentalPolicies: string[];
  status: OutfitStatus;
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  createdAt: string;
}

export interface OutfitFilterOptions {
  category?: Category | 'all';
  occasion?: Occasion | 'all';
  size?: OutfitSize | 'all';
  colour?: string | 'all';
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
