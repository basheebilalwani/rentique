import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  User as UserIcon,
  ShoppingBag,
  Calendar,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { bookingApi } from '@/services/api/bookingApi';
import { Booking, BookingStatus } from '@/types/booking.types';
import { formatCurrency, formatDate, formatRentalDays } from '@/utils/formatters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/ToastContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'all'>('upcoming');
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  // Fetch bookings for logged-in user
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: () => bookingApi.getUserBookings(user?.id || 'user-demo-1'),
    enabled: Boolean(user?.id),
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) =>
      bookingApi.cancelBooking(bookingId, user?.id || 'user-demo-1'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['outfit-bookings'] });
      success('Booking reservation cancelled successfully.');
      setCancellingBooking(null);
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to cancel reservation.');
    },
  });

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed' || b.status === 'active'
  );

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : bookings;

  const getStatusBadgeVariant = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
      case 'active':
        return 'emerald';
      case 'pending':
      case 'cleaning':
        return 'amber';
      case 'cancelled':
      case 'rejected':
        return 'rose';
      case 'returned':
      case 'completed':
        return 'charcoal';
      default:
        return 'brand';
    }
  };

  const getStatusLabel = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return 'Awaiting Confirmation';
      case 'confirmed':
        return 'Confirmed & Reserved';
      case 'active':
        return 'Dispatched / In Hand';
      case 'returned':
        return 'Returned & Inspected';
      case 'cleaning':
        return 'Under Sanitization';
      case 'completed':
        return 'Completed Rental';
      case 'cancelled':
        return 'Cancelled';
      case 'rejected':
        return 'Declined';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 text-left">
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-luxury border border-champagne-300 p-6 sm:p-8 shadow-luxury">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-brand-300 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-brand-200 text-brand-800 flex items-center justify-center text-xl font-bold">
                <UserIcon className="w-8 h-8" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-medium text-charcoal-950">
                  {user?.name || 'Customer Profile'}
                </h1>
                <Badge variant="brand" size="sm">
                  {user?.role?.toUpperCase()} MEMBER
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-charcoal-500 mt-1">{user?.email}</p>
              <p className="text-xs text-charcoal-400 mt-0.5">{user?.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/catalog">
              <Button variant="luxury" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Browse Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Rentals & Bookings Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-champagne-200 pb-4 gap-4">
          <div>
            <h2 className="font-serif text-2xl font-medium text-charcoal-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              My Couture Rentals
            </h2>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Review current reservations, delivery statuses, and rental history.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-charcoal-900 text-white'
                  : 'bg-champagne-100 text-charcoal-700 hover:bg-champagne-200'
              }`}
            >
              Active & Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
                activeTab === 'all'
                  ? 'bg-charcoal-900 text-white'
                  : 'bg-champagne-100 text-charcoal-700 hover:bg-champagne-200'
              }`}
            >
              All History ({bookings.length})
            </button>
          </div>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" label="Retrieving your bookings..." />
          </div>
        ) : displayedBookings.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="w-8 h-8 text-brand-500" />}
            title={activeTab === 'upcoming' ? 'No Upcoming Rentals' : 'No Rental History'}
            description="You have no reservations scheduled at this time. Explore the collection to reserve your next luxury outfit."
            actionLabel="Discover Outfits"
            onAction={() => (window.location.href = '/catalog')}
          />
        ) : (
          <div className="space-y-4">
            {displayedBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-luxury border border-champagne-200 shadow-luxury p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-brand-300"
              >
                {/* Outfit & Period Info */}
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={b.outfitImage}
                    alt={b.outfitName}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-luxury border border-champagne-300 shrink-0"
                  />
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-brand-700">
                        {b.outfitDesigner}
                      </span>
                      <Badge variant={getStatusBadgeVariant(b.status)} size="sm" dot>
                        {getStatusLabel(b.status)}
                      </Badge>
                    </div>

                    <Link to={`/outfits/${b.outfitId}`} className="block group/link">
                      <h3 className="font-serif text-base sm:text-lg font-medium text-charcoal-900 group-hover/link:text-brand-600 transition-colors">
                        {b.outfitName}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 text-charcoal-600 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-600" />
                        <strong>
                          {formatDate(b.period.startDate)} &ndash; {formatDate(b.period.endDate)}
                        </strong>
                      </span>
                      <span>&bull;</span>
                      <span>{formatRentalDays(b.period.rentalDays)}</span>
                      <span>&bull;</span>
                      <span>Size: <strong>{b.selectedSize}</strong></span>
                      <span>&bull;</span>
                      <span>Color: <strong>{b.selectedColour}</strong></span>
                    </div>

                    <p className="text-[11px] text-charcoal-400">
                      Booking Reference: #{b.id} &bull; Reserved on {formatDate(b.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Financials & Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-champagne-100 gap-3">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-charcoal-400 block font-semibold">
                      Total Rental Investment
                    </span>
                    <span className="font-serif text-xl font-bold text-charcoal-900">
                      {formatCurrency(b.pricing.grandTotal)}
                    </span>
                    <span className="text-[10px] text-emerald-600 block">
                      Includes {formatCurrency(b.pricing.securityDeposit)} refundable deposit
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/outfits/${b.outfitId}`}>
                      <Button variant="outline" size="sm">
                        View Outfit
                      </Button>
                    </Link>

                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={() => setCancellingBooking(b)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancellingBooking && (
        <Modal
          isOpen={Boolean(cancellingBooking)}
          onClose={() => setCancellingBooking(null)}
          title="Cancel Reservation?"
          maxWidth="sm"
        >
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-3 rounded-luxury">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p className="text-xs">
                Are you sure you wish to cancel reservation <strong>#{cancellingBooking.id}</strong> for{' '}
                <strong>{cancellingBooking.outfitName}</strong>?
              </p>
            </div>
            <p className="text-xs text-charcoal-500">
              Upon cancellation, your reserved dates will be returned to the archive and your deposit
              authorization will be released.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCancellingBooking(null)}
                disabled={cancelMutation.isPending}
              >
                Keep Reservation
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={cancelMutation.isPending}
                onClick={() => cancelMutation.mutate(cancellingBooking.id)}
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
