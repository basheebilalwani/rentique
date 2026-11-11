import { Outfit, OutfitFilterOptions, OutfitSize } from '@/types/outfit.types';
import { storageRepository, simulateNetworkDelay } from '../mock/storageRepository';

export const outfitApi = {
  /**
   * Retrieves all outfits matching optional filter & sorting criteria.
   */
  async getOutfits(filters?: OutfitFilterOptions): Promise<Outfit[]> {
    await simulateNetworkDelay(200);
    let items = storageRepository.getOutfits();

    if (!filters) return items;

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      items = items.filter((o) => o.category === filters.category);
    }

    // Filter by occasion
    if (filters.occasion && filters.occasion !== 'all') {
      items = items.filter((o) => o.occasion === filters.occasion);
    }

    // Filter by size
    if (filters.size && filters.size !== 'all') {
      const targetSize = filters.size as OutfitSize;
      items = items.filter((o) => o.sizes.includes(targetSize));
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      items = items.filter((o) => o.dailyRentalPrice >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      items = items.filter((o) => o.dailyRentalPrice <= filters.maxPrice!);
    }

    // Search query by name, designer, description, fabric
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      items = items.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.designer.toLowerCase().includes(q) ||
          o.fabric.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          items = [...items].sort((a, b) => a.dailyRentalPrice - b.dailyRentalPrice);
          break;
        case 'price-desc':
          items = [...items].sort((a, b) => b.dailyRentalPrice - a.dailyRentalPrice);
          break;
        case 'rating':
          items = [...items].sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          items = [...items].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case 'featured':
        default:
          items = [...items].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    return items;
  },

  /**
   * Fetches single outfit by ID with detailed specs and images.
   */
  async getOutfitById(id: string): Promise<Outfit> {
    await simulateNetworkDelay(150);
    const outfit = storageRepository.getOutfitById(id);
    if (!outfit) {
      throw new Error(`Outfit with id "${id}" was not found.`);
    }
    return outfit;
  },

  /**
   * Fetches curated featured outfits for landing page highlights.
   */
  async getFeaturedOutfits(): Promise<Outfit[]> {
    await simulateNetworkDelay(150);
    return storageRepository.getOutfits().filter((o) => o.isFeatured);
  },

  /**
   * Admin: Creates a new outfit in inventory.
   */
  async createOutfit(data: Omit<Outfit, 'id' | 'createdAt'>): Promise<Outfit> {
    await simulateNetworkDelay(300);
    const newOutfit: Outfit = {
      ...data,
      id: `outfit-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    return storageRepository.saveOutfit(newOutfit);
  },

  /**
   * Admin: Updates outfit details, status, or pricing.
   */
  async updateOutfit(id: string, updates: Partial<Outfit>): Promise<Outfit> {
    await simulateNetworkDelay(250);
    const existing = storageRepository.getOutfitById(id);
    if (!existing) {
      throw new Error(`Cannot update: outfit "${id}" not found.`);
    }
    const updated = { ...existing, ...updates };
    return storageRepository.saveOutfit(updated);
  },

  /**
   * Admin: Deletes an outfit from catalogue.
   */
  async deleteOutfit(id: string): Promise<boolean> {
    await simulateNetworkDelay(250);
    return storageRepository.deleteOutfit(id);
  },
};
