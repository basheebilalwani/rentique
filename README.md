# Rentique — Luxury Fashion Rental Marketplace

> **A production-grade luxury fashion rental platform built with React 18, TypeScript, Vite, and Tailwind CSS.**

Rentique democratizes high-fashion couture by enabling customers to reserve authentic designer bridal lehengas, evening gowns, and tuxedos for weddings, galas, and milestones at a fraction of retail prices. The platform features an intelligent date-range availability engine with automated cleaning buffers, dynamic URL-synchronized filtering, and a resilient React architecture.

---

## 1. Project Overview & Business Problem

High-end designer couture (e.g., Sabyasachi lehengas, Marchesa gowns, Ralph Lauren Purple Label tuxedos) often costs \$3,000–\$7,000 and is worn only once for a specific ceremony or gala. 

**Rentique** solves this through circular luxury:
- **Discover & Filter:** Explore curated designer pieces with real-time multi-attribute filters synced to URL parameters.
- **Intelligent Availability Engine:** Verify calendar dates with automatic 1-day sanitization buffer detection preventing double bookings.
- **Transparent Pricing:** Live calculation of duration-based rental charges, multi-day discounts, refundable security deposits, and taxes.
- **Reliability First:** Protected by React Error Boundaries, comprehensive test suites (Vitest & RTL), and GitHub Actions CI.

---

## 2. Core Features Implemented

### Customer-Facing Experience
- **Editorial Luxury Landing Page:** High-fashion visual hierarchy, curated occasion highlights (Weddings, Black Tie Galas, Receptions, Cocktail Soirées), 3-step rental guide, and press reviews.
- **Dynamic Catalogue with Bookmarkable URL Filter State:**
  - Multi-faceted filtering by garment category, celebration occasion, size (`XS`–`Custom`), and maximum daily rate.
  - Debounced search query synchronized with browser URL parameters (`?category=lehengas&occasion=wedding&search=...`).
  - Active filter badges with individual removal and one-click reset.
  - Sorting by Featured Runway, Price (Low/High), Highest Rated, and New Arrivals.
- **Garment Detail & Image Gallery:**
  - Interactive multi-image gallery with thumbnail switcher.
  - Fabric, craftsmanship specifications, and care instructions.
  - Complimentary size swaps, eco-sanitization guarantees, and damage waiver terms.
  - Related couture recommendations matching category and occasion.
- **Real-Time Date Availability & Booking Engine:**
  - Double-date range selection (Event Start Date & Return Date).
  - Validation: Prevents past dates and inverted return dates.
  - **1-Day Mandatory Sanitization Buffer:** Automatically blocks the day immediately following returns before allowing subsequent bookings.
  - Conflict detection: Flags overlapping reservations in real time.
  - Live pricing breakdown: Subtotal, 10% multi-day discounts (5+ days), refundable security deposit, eco-sanitization fee, and 8% tax.
  - Multi-step reservation checkout modal with customer contact and delivery address validation.
- **Customer Account & Rental Dashboard:**
  - Profile card with membership status.
  - Active & Upcoming rentals vs. historical rentals toggle.
  - Booking status badges and reference IDs.
  - Self-service cancellation modal for pending/confirmed bookings.
- **Persistent Wishlist:**
  - Add/remove couture pieces from cards or details.
  - Badge counter in sticky navigation.
  - Dedicated Wishlist page persisted in browser storage.
- **Authentication & Persona Switching:**
  - 1-Click quick demo sign-in for effortless evaluation.
  - Client-side session management with protected route guards.
- **Fault-Tolerant Resilience:**
  - Production-ready `ErrorBoundary` catching unexpected component failures with an elegant recovery interface.

---

## 3. Technology Stack & Rationale

| Layer | Technology | Engineering Rationale |
|---|---|---|
| **Core** | React 18, TypeScript, Vite 6 | Declarative component model, compile-time type safety for monetary and date math, near-instant HMR. |
| **Styling** | Tailwind CSS v3 | Custom luxury design tokens (Playfair serif, champagne/gold accents, subtle shadows) with zero runtime CSS-in-JS penalty. |
| **Routing** | React Router v6 | Declarative layout routing, URL search params for bookmarkable filters, and protected route guards. |
| **Server State** | TanStack Query v5 | Manages asynchronous cache, background refetching, and query invalidation on booking creations. |
| **Client State** | React Context API | Lean, native state management for auth session and wishlist without third-party library bloat. |
| **Date Math** | `date-fns` | Pure, functional, tree-shakeable date difference and interval calculations. |
| **Testing** | Vitest, React Testing Library | 34 automated unit and component tests verifying date buffers, pricing math, UI interactions, and error boundaries. |
| **CI/CD** | GitHub Actions | Automated continuous integration verifying type safety, linting, tests, and production build on every push. |
| **Tooling** | `@rollup/wasm-node` | Official WebAssembly fallback preventing WDAC native DLL execution blocks on enterprise Windows environments. |

---

## 4. Architecture & Directory Layout

```
rentique/
├── .github/
│   └── workflows/ci.yml          # GitHub Actions continuous integration workflow
├── src/
│   ├── app/                      # App root, router, and query/toast/auth providers
│   ├── components/
│   │   ├── ui/                   # Atomic design system: Button, Input, Select, Modal, Badge, Card, Skeleton, Toast
│   │   ├── layout/               # Navbar, Footer, CustomerLayout
│   │   └── shared/               # ErrorBoundary with luxury fallback UI
│   ├── features/
│   │   ├── auth/                 # AuthContext, ProtectedRoute, LoginPage
│   │   ├── booking/              # BookingCalendar, BookingModal
│   │   ├── catalog/              # CatalogPage, FilterSidebar, ProductCard
│   │   ├── home/                 # LandingPage (Hero, Occasions, How It Works, Testimonials)
│   │   ├── outfits/              # OutfitDetailsPage (Gallery, Specs, Booking CTA)
│   │   ├── profile/              # ProfilePage (Rental History, Cancellation)
│   │   └── wishlist/             # WishlistContext, WishlistPage
│   ├── hooks/                    # useDebounce, custom utilities
│   ├── services/
│   │   ├── api/                  # Typed API layer (outfitApi, bookingApi, authApi, wishlistApi)
│   │   └── mock/                 # Storage repository with simulated network delays and initial seed data
│   ├── types/                    # Centralized TypeScript models (Outfit, Booking, User, Pricing)
│   ├── utils/                    # Pure, tested business logic (bookingCalculations, dateAvailability, formatters, cn)
│   └── tests/                    # Vitest unit and RTL component test suites
```

---

## 5. Getting Started & Installation

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher

### Installation Steps
```bash
# 1. Clone repository
git clone https://github.com/your-username/rentique.git
cd rentique

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will launch at `http://localhost:5173`.

### Key Scripts
```bash
npm run dev          # Starts local Vite development server with HMR
npm run build        # Executes TypeScript compile check (tsc -b) & bundles for production
npm run preview      # Previews production build locally
npm test             # Executes all 34 automated Vitest unit & component tests
```

---

## 6. Automated Test Suite

Rentique contains 34 automated tests covering business calculations, date collision algorithms, and user interface interactions:

```bash
npm test
```

**Test Coverage Summary:**
- `bookingCalculations.test.ts` (7 tests): Verifies 1-day rental math, 3-day rental totals, 10% multi-day discounts, zero duration guards, and tax calculations.
- `dateAvailability.test.ts` (10 tests): Verifies direct date overlaps, cleaning buffer collisions (blocking +1 day after return), maintenance status blocking, and cancelled booking ignores.
- `formatters.test.ts` (5 tests): Verifies currency output, date formatting, and enum translations.
- `Button.test.tsx` (4 tests): Verifies children rendering, click events, disabled state, and loading spinners.
- `Modal.test.tsx` (4 tests): Verifies render toggles, close button triggers, and Escape key listeners.
- `ProductCard.test.tsx` (3 tests): Verifies price display, designer badges, and asynchronous wishlist toggle.
- `ErrorBoundary.test.tsx` (1 test): Verifies error capture and luxury fallback UI rendering upon uncaught exceptions.

---

## 7. Limitations & Production Roadmap

- **Mock API Service Layer:** Data is stored in browser `localStorage` with synthetic network delays. In production, this would be replaced with a Node/Express, Go, or NestJS REST/GraphQL API using PostgreSQL and Redis caching.
- **Authentication:** Frontend demo session with quick role switcher. In production, this would use OAuth 2.0 / OpenID Connect with secure HttpOnly cookie tokens.
- **Payment Processing:** Pricing calculations, taxes, and security deposit authorization are fully calculated in frontend state. Production would integrate Stripe Pre-Authorization holds for deposits.
