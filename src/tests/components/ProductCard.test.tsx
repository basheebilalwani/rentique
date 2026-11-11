import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '@/features/catalog/components/ProductCard';
import { WishlistProvider } from '@/features/wishlist/WishlistContext';
import { ToastProvider } from '@/components/ui/ToastContext';
import { Outfit } from '@/types/outfit.types';

const mockOutfit: Outfit = {
  id: 'test-1',
  name: 'Gold Embellished Lehenga',
  designer: 'Tarun Tahiliani',
  description: 'Pure georgette lehenga with antique gold embroidery.',
  category: 'lehengas',
  occasion: 'wedding',
  sizes: ['S', 'M', 'L'],
  colours: ['Gold'],
  retailPrice: 4500,
  dailyRentalPrice: 190,
  securityDeposit: 350,
  featuredImage: '/images/lehenga.jpg',
  images: ['/images/lehenga.jpg'],
  fabric: 'Georgette & Zari',
  careInstructions: ['Dry clean only'],
  rentalPolicies: ['Return in 3 days'],
  status: 'available',
  rating: 4.9,
  reviewCount: 12,
  isFeatured: true,
  createdAt: '2026-01-01',
};

const renderCard = (outfit: Outfit = mockOutfit) => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <WishlistProvider>
          <ProductCard outfit={outfit} />
        </WishlistProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('ProductCard Component', () => {
  it('renders outfit name, designer, and daily rental price', () => {
    renderCard();

    expect(screen.getByText('Gold Embellished Lehenga')).toBeInTheDocument();
    expect(screen.getByText('Tarun Tahiliani')).toBeInTheDocument();
    expect(screen.getByText('$190')).toBeInTheDocument();
    expect(screen.getByText(/retail \$4,500/i)).toBeInTheDocument();
  });

  it('renders runway edit badge when isFeatured is true', () => {
    renderCard();
    expect(screen.getByText(/runway edit/i)).toBeInTheDocument();
  });

  it('toggles wishlist status when heart button is clicked', async () => {
    renderCard();
    const heartBtn = screen.getByLabelText(/add gold embellished lehenga to wishlist/i);
    expect(heartBtn).toBeInTheDocument();

    fireEvent.click(heartBtn);

    // After clicking, the accessible label reflects removal state
    await waitFor(() => {
      expect(
        screen.getByLabelText(/remove gold embellished lehenga from wishlist/i)
      ).toBeInTheDocument();
    });
  });
});
