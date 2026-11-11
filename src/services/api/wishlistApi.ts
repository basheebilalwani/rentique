import { storageRepository, simulateNetworkDelay } from '../mock/storageRepository';

export const wishlistApi = {
  async getWishlist(): Promise<string[]> {
    await simulateNetworkDelay(100);
    return storageRepository.getWishlist();
  },

  async toggleWishlist(outfitId: string): Promise<string[]> {
    await simulateNetworkDelay(150);
    return storageRepository.toggleWishlist(outfitId);
  },
};
