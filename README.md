# SmartStation — Online Stationery Store
> *"Everything You Need to Write, Create & Organize."*

SmartStation is a commercial-grade, full-stack e-commerce web application engineered for stationery lovers, students, artists, and institutional buyers. Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and an atomic persistent transactional database engine.

---

## 🌟 Demo Credentials & 1-Click Access

Both storefront and admin portal feature 1-click credential auto-fill for instant evaluation:

| Role | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Demo Customer** | `customer@smartstation.com` | `password123` | [Customer Login](http://localhost:3000/login) |
| **Demo Super Admin** | `admin@smartstation.com` | `admin123` | [Admin Console](http://localhost:3000/admin/login) |

*Tip:* Use the quick role toggle in the announcement banner or the 1-click demo buttons on the login screens to switch personas instantly.

---

## 🚀 Key Features

### 🛒 Customer-Facing Storefront
1. **Dynamic Homepage (`/`)**:
   - Hero banner with stationery imagery, quick stats, and value propositions.
   - Interactive **Build Your Own Stationery Kit**: 3-step interactive kit builder with dynamic bundle discount calculations.
   - **Shop by Purpose**: Requirement-based discovery (School, College, Exams, Office, Art, Journaling, Gift, Study Desk).
   - **Stationery Finder**: 3-question guided wizard recommending personalized stationery picks.
   - **Flash Deals**: Live hourly countdown timer with filter pills and special deals.
   - **Bestsellers & New Arrivals**: Badged cards with quick-view modals, ratings, and instant add-to-cart.
   - **Personalized Header**: Greets logged-in users with quick desk restock shortcuts.

2. **Advanced Catalogue & Filtering (`/shop`)**:
   - Live multi-criteria filtering: Categories, Brands, Price range, Minimum Rating, In-Stock only, Paper GSM, and Writing Tip Type.
   - Real-time search with debounce and autocomplete suggestions modal (`/api/search`).
   - Grid and List view modes.
   - Sorting by Featured, Price (Low-to-High / High-to-Low), Customer Rating, and New Arrivals.

3. **Product Details (`/product/[slug]`)**:
   - Multi-angle image gallery with interactive thumbnail switcher.
   - Variant selector (colors, tip sizes, pack quantities) with live SKU and price updates.
   - Technical specifications matrix (Paper GSM, ruling, binding, ink type, dimensions).
   - Pincode delivery availability & Cash on Delivery (COD) checker.
   - Verified customer reviews & rating distribution breakdown with review submission form.
   - "You May Also Like" & Frequently Bought Together bundle recommendations.

4. **Cart, Wishlist & Comparison**:
   - **Smart Cart (`/cart`)**: Dynamic progress bar toward free shipping (unlocked at ₹499), promo coupon validation, SmartPoints loyalty redemption, and quantity steppers.
   - **Wishlist (`/wishlist`)**: Saved stationery items with price drop tags and 1-click move to cart.
   - **Product Comparison (`/compare`)**: Side-by-side spec comparison table for up to 4 items simultaneously.

5. **Multi-Step Checkout (`/checkout`)**:
   - Step 1: Address selection or new shipping address input with Home/Work/Other tags.
   - Step 2: Delivery speed (Standard ₹40 / Express Next-Day ₹99, free over ₹499).
   - Step 3: Payment method (UPI, Credit/Debit Card, Net Banking, Cash on Delivery) with gateway abstraction ready for Razorpay/Stripe integration.
   - Step 4: Real-time stock reservation and order creation.

6. **Order Confirmation & Tracking**:
   - **Confirmation (`/order-success/[id]`)**: Celebratory confetti, complete order breakdown, printable invoice download, and tracking link.
   - **Visual Order Tracker (`/track/[id]`)**: Milestone timeline (Order Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered) with exact timestamps.

7. **Customer Account Dashboard (`/account`)**:
   - Order history with statuses, itemized previews, invoice downloads, and 1-click **Buy Again** reorder.
   - Order cancellation for pending orders.
   - Return & Refund request modal with condition reasons.
   - **Digital Study Desk ("My Desk")**: Personalized stationery checklist with real-time add/toggle/delete items.
   - SmartPoints balance and transaction history.
   - Saved shipping address management.

8. **Institutional B2B Bulk Orders (`/bulk-orders`)**:
   - Dedicated Request for Quotation (RFQ) portal for schools, colleges, coaching centres, and corporate offices.
   - Dynamic volume discount calculator (up to 25% off for 1,000+ units).
   - Instant RFQ submission connected directly to the admin procurement inbox.

9. **Help Center & Interactive Support (`/help`)**:
   - Categorized FAQ accordion (Orders, Delivery, Returns, COD, Bulk Orders).
   - Simulated interactive live support assistant.

---

### 🛡️ Admin Management Console (`/admin`)
1. **Overview Dashboard (`/admin`)**:
   - Key business performance metrics (Total Revenue, Total Orders, Active Customers, Catalog Products, Low-Stock items, Pending Orders, Return Requests).
   - Interactive revenue and order volume analytics charts across customizable date windows (7 Days, 30 Days, 1 Year).
   - Category sales breakdown percentages.
   - Top-performing products ranked by revenue and units sold.
   - Low-stock warning table with 1-click restock actions.

2. **Products Management (`/admin/products`)**:
   - Full CRUD: Add new products with image URLs, SKUs, categories, brands, specifications, and pricing.
   - Inline product editing and status toggling (Active / Draft / Archived).
   - **Bulk CSV Import & Export**: Import multiple products via CSV file or export catalog.

3. **Inventory & Stock Management (`/admin/inventory`)**:
   - Real-time stock audit table with search and category filters.
   - In-Stock, Low Stock, and Out of Stock indicators.
   - Inline `+` / `-` stock increment and decrement buttons that immediately synchronize with customer store stock.
   - Minimum stock threshold warnings.

4. **Order Management (`/admin/orders`)**:
   - Master order fulfillment ledger.
   - Lifecycle state transitions: `Pending` → `Confirmed` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered`.
   - Cancellation and return approval handling.
   - Carrier and tracking number assignments.

5. **Customer Management (`/admin/customers`)**:
   - Directory of registered customers with phone, email, registration date, and role.
   - Lifetime order counts and cumulative purchase spending.
   - Customer profile drawer showing saved addresses and past order history.

6. **Coupons & Promotions (`/admin/coupons`)**:
   - Voucher code generator (Percentage discount, Fixed amount off, Free shipping).
   - Minimum order requirements, usage limits, and expiration controls.
   - 1-click enable/disable coupon code toggle.

7. **Bulk Order RFQs (`/admin/rfq`)**:
   - Institutional quote request inbox.
   - Status pipeline management: `Pending` → `Quoted` → `Approved` → `Fulfilled` → `Cancelled`.

8. **Reports & Data Export (`/admin/reports`)**:
   - Instant CSV generation directly from the database:
     - Sales & Revenue Ledger (`smartstation-sales-report.csv`)
     - Inventory Warehouse Stock Status (`smartstation-inventory-report.csv`)
     - Customer Directory & Loyalty Points (`smartstation-customers-report.csv`)
     - Promotional Coupons & Vouchers (`smartstation-coupons-report.csv`)

9. **Security Audit Logs (`/admin/audit`)**:
   - Immutable log of administrative actions with operator name, timestamp, affected entity, action details, and origin IP.

---

## 🏗️ Technology Stack

- **Framework**: Next.js 16.4.3 (App Router, Turbopack, React 19)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4 with custom stationery color variables
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, Tailwind CSS animations
- **State Management**: React Context (`CartContext`) with persistent LocalStorage synchronizer
- **Database Engine**: Persistent JSON Document Store (`data/smartstation_db.json`) with in-memory caching, atomic stock locking, and relations
- **Runtime**: Node.js v22.14.0 LTS

---

## 📁 Project Architecture

```
web_tech_stationary/
├── data/
│   └── smartstation_db.json        # Persistent relational database file
├── scripts/
│   ├── verify.js                   # Comprehensive endpoint health test
│   └── test_order_lifecycle.js     # E2E transactional order & inventory test
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root HTML shell with font & metadata
│   │   ├── globals.css             # Stationery design tokens & typography
│   │   ├── page.tsx                # Commercial storefront homepage
│   │   ├── shop/page.tsx           # Filterable product catalogue
│   │   ├── product/[slug]/page.tsx # Detailed product specifications & reviews
│   │   ├── cart/page.tsx           # Smart cart with free delivery meter
│   │   ├── checkout/page.tsx       # Multi-step checkout & payment
│   │   ├── order-success/[id]/     # Confetti celebration & printable invoice
│   │   ├── track/[id]/page.tsx     # Visual milestone timeline tracking
│   │   ├── account/page.tsx        # Customer dashboard & My Desk checklist
│   │   ├── bulk-orders/page.tsx    # Institutional B2B RFQ portal
│   │   ├── compare/page.tsx        # Side-by-side product comparison matrix
│   │   ├── wishlist/page.tsx       # Saved items with price drop tags
│   │   ├── help/page.tsx           # FAQ accordion & live support assistant
│   │   ├── login/page.tsx          # Customer login with 1-click demo button
│   │   ├── register/page.tsx       # Customer registration with bonus points
│   │   ├── admin/
│   │   │   ├── page.tsx            # Admin dashboard KPIs & sales charts
│   │   │   ├── products/page.tsx   # Catalog CRUD & CSV bulk upload
│   │   │   ├── inventory/page.tsx  # Live inventory & inline stock updater
│   │   │   ├── orders/page.tsx     # Order fulfillment lifecycle management
│   │   │   ├── customers/page.tsx  # Customer directory & lifetime spend
│   │   │   ├── coupons/page.tsx    # Promo coupon creator & status toggle
│   │   │   ├── rfq/page.tsx        # B2B institutional inquiry manager
│   │   │   ├── reports/page.tsx    # Downloadable CSV business reports
│   │   │   ├── audit/page.tsx      # System security & administrative logs
│   │   │   └── login/page.tsx      # Admin console login
│   │   └── api/                    # Complete REST API suite
│   │       ├── products/           # Product queries & mutations
│   │       ├── categories/         # Stationery categories
│   │       ├── brands/             # Stationery brand partners
│   │       ├── orders/             # Order placement, cancel, return
│   │       ├── coupons/            # Coupon validation & management
│   │       ├── reviews/            # Verified customer reviews
│   │       ├── rfq/                # Bulk order quotations
│   │       ├── search/             # Live suggestions & autocomplete
│   │       └── admin/              # Dashboard metrics, inventory, reports
│   ├── components/
│   │   ├── AppShell.tsx            # Global client shell & layout switch
│   │   ├── Navbar.tsx              # Announcement bar, search modal, badges
│   │   ├── Footer.tsx              # Commercial footer & payment badges
│   │   ├── MobileBottomNav.tsx     # Sticky mobile bottom navigation bar
│   │   ├── ProductCard.tsx         # Product card with hover effect & quick view
│   │   ├── ProductQuickViewModal.tsx # Quick-view drawer modal
│   │   ├── BuildStationeryKit.tsx  # Custom kit builder with bundle discount
│   │   ├── ShopByPurpose.tsx       # Requirement-based collection grid
│   │   ├── StationeryFinder.tsx    # Interactive questionnaire wizard
│   │   ├── FlashDealsCountdown.tsx # Hourly countdown timer with deal pills
│   │   ├── AdminSidebar.tsx        # Collapsible dark-theme admin navigation
│   │   └── Toast.tsx               # Animated feedback toast notifications
│   └── lib/
│       ├── types.ts                # Complete TypeScript data model interfaces
│       ├── seed-data.ts            # Realistic seed catalog (30+ products, 15 brands)
│       ├── db.ts                   # Database engine with atomic transactions
│       └── cart-context.tsx        # Context provider (Cart, Wishlist, Compare, Auth)
└── package.json
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js v18+ (tested on Node.js v22.14.0 LTS)
- npm v10+

### Step-by-Step Setup
1. **Clone or enter the project directory**:
   ```bash
   cd c:\web_tech_stationary
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

4. **Production Build & Execution**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🧪 Automated Verification & Testing

SmartStation includes built-in automated test scripts:

1. **Verify all 28 storefront and admin routes respond with HTTP 200 OK**:
   ```bash
   node scripts/verify.js
   ```

2. **Verify end-to-end transactional lifecycle** (places an order, decrements stock atomically, verifies stock reduction, executes admin status transition, and creates an RFQ):
   ```bash
   node scripts/test_order_lifecycle.js
   ```

---

## 💳 Payment Gateway Architecture
The payment module is architected with a clean abstraction layer:
- Supports **UPI**, **Credit/Debit Cards**, **Net Banking**, **Wallets**, and **Cash on Delivery (COD)**.
- Sensitive credit card credentials are never stored in the database.
- Easily plug in **Razorpay** (`razorpay.open({...})`) or **Stripe** by providing client keys in standard environment variables.

---

## 📄 License
MIT License. Built for commercial stationery retail and institutional procurement.
