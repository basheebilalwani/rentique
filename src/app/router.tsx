import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { LandingPage } from '@/features/home/LandingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'catalog',
        async lazy() {
          const { CatalogPage } = await import('@/features/catalog/pages/CatalogPage');
          return { Component: CatalogPage };
        },
      },
      {
        path: 'outfits/:id',
        async lazy() {
          const { OutfitDetailsPage } = await import('@/features/outfits/pages/OutfitDetailsPage');
          return { Component: OutfitDetailsPage };
        },
      },
      {
        path: 'wishlist',
        async lazy() {
          const { WishlistPage } = await import('@/features/wishlist/pages/WishlistPage');
          return { Component: WishlistPage };
        },
      },
      {
        path: 'profile',
        async lazy() {
          const { ProfilePage } = await import('@/features/profile/pages/ProfilePage');
          return { Component: ProfilePage };
        },
      },
      {
        path: 'login',
        async lazy() {
          const { LoginPage } = await import('@/features/auth/pages/LoginPage');
          return { Component: LoginPage };
        },
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
