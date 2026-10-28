export type UserRole = 'customer' | 'admin' | 'inventory_manager' | 'order_manager';

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  type: 'Home' | 'Work' | 'Other';
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  dob?: string;
  gender?: string;
  addresses: UserAddress[];
  rewardPoints: number;
  totalSpent: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  displayOrder: number;
  itemCount: number;
  status: 'active' | 'inactive';
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  website: string;
  productCount: number;
  rating: number;
  status: 'active' | 'inactive';
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Blue - 0.7mm" or "A4 - 200 Pages"
  sku: string;
  color?: string;
  size?: string;
  tipSize?: string;
  packSize?: number;
  price: number;
  mrp: number;
  stock: number;
}

export interface ProductSpecifications {
  // Notebook specs
  paperSize?: string;
  pages?: number;
  paperGsm?: number;
  ruling?: 'Ruled' | 'Unruled' | 'Grid' | 'Dot Grid' | 'Plain';
  binding?: 'Spiral' | 'Hardcover' | 'Softcover' | 'Stitched';
  coverType?: string;
  dimensions?: string;
  
  // Pen / Writing specs
  writingType?: 'Ball' | 'Gel' | 'Rollerball' | 'Fountain' | 'Highlighter' | 'Marker';
  inkColor?: string;
  tipSize?: string; // 0.5mm, 0.7mm, 1.0mm
  refillable?: boolean;
  packSize?: number;

  // Art & Craft specs
  colorCount?: number;
  material?: string;
  suitableFor?: string;
  ageGroup?: string;

  // General
  countryOfOrigin?: string;
  warranty?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode: string;
  brand: string;
  brandId: string;
  category: string;
  categoryId: string;
  subcategory: string;
  subcategoryId?: string;
  description: string;
  shortDescription: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  taxPercentage: number;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isEcoFriendly?: boolean;
  purposeTags: string[]; // ["School", "College", "Office", "Art", "Exam", "Journaling", "Gift", "Study Desk"]
  specifications: ProductSpecifications;
  variants: ProductVariant[];
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  brand: string;
  price: number;
  mrp: number;
  image: string;
  quantity: number;
  stock: number;
  sku: string;
  variantName?: string;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  variantName?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'return_approved'
  | 'returned'
  | 'refunded';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: UserAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount: number;
  pointsRedeemed: number;
  pointsDiscount: number;
  shippingFee: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD' | 'Wallet';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  orderStatus: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  trackingNumber: string;
  deliveryPartner: string;
  estimatedDeliveryDate: string;
  returnReason?: string;
  returnDetails?: string;
  refundAmount?: number;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  status: 'approved' | 'pending' | 'rejected' | 'flagged';
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  perUserLimit: number;
  timesUsed: number;
  applicableCategory?: string;
  status: 'active' | 'expired' | 'disabled';
}

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  discountPercentage: number;
  countdownEnd: string;
  categoryFilter?: string;
  bannerImage: string;
  active: boolean;
}

export interface HomepageBanner {
  id: string;
  heading: string;
  subheading: string;
  tagline: string;
  badge: string;
  buttonText: string;
  buttonUrl: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  image: string;
  bgColor: string;
  active: boolean;
  displayOrder: number;
}

export interface BulkOrderRFQ {
  id: string;
  organization: string;
  contactPerson: string;
  email: string;
  phone: string;
  targetCategory: string;
  requiredProducts: string;
  estimatedQuantity: number;
  targetDeliveryDate: string;
  additionalNotes?: string;
  status: 'pending' | 'quoted' | 'approved' | 'fulfilled' | 'cancelled';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string; // 'admin' or customerId
  title: string;
  message: string;
  type: 'order' | 'price_drop' | 'stock' | 'promotion' | 'system';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminUser: string;
  action: string;
  entity: string;
  entityId?: string;
  details: string;
  ip: string;
  timestamp: string;
}

export interface DeskItem {
  id: string;
  userId: string;
  productId: string;
  note?: string;
  pinnedAt: string;
}
