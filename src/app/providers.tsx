import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/components/ui/ToastContext';
import { AuthProvider } from '@/features/auth/AuthContext';
import { WishlistProvider } from '@/features/wishlist/WishlistContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};
