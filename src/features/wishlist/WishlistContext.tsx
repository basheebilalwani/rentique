import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistApi } from '@/services/api/wishlistApi';
import { useToast } from '@/components/ui/ToastContext';

interface WishlistContextType {
  wishlistIds: string[];
  count: number;
  isInWishlist: (outfitId: string) => boolean;
  toggleWishlist: (outfitId: string, outfitName?: string) => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadWishlist() {
      try {
        const ids = await wishlistApi.getWishlist();
        setWishlistIds(ids);
      } catch (err) {
        console.error('Error loading wishlist:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadWishlist();
  }, []);

  const isInWishlist = (outfitId: string): boolean => {
    return wishlistIds.includes(outfitId);
  };

  const toggleWishlist = async (outfitId: string, outfitName?: string) => {
    const isAdding = !isInWishlist(outfitId);
    try {
      const updated = await wishlistApi.toggleWishlist(outfitId);
      setWishlistIds(updated);
      if (isAdding) {
        toast(`Added ${outfitName || 'outfit'} to your wishlist.`, 'success');
      } else {
        toast(`Removed from your wishlist.`, 'info');
      }
    } catch (err) {
      toast('Failed to update wishlist.', 'error');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        count: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
