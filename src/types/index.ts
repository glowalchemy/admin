/**
 * Shared type definitions for the GlowAlchemy admin panel.
 *
 * These types mirror the MongoDB documents served by the backend API.
 * Keep them in sync with backend models when schema changes.
 */

/* ─── Product ─────────────────────────────────────────────────── */

export interface ProductVariant {
  color?: string;
  size?: string;
  image?: string;
  stock?: number;
  sku?: string;
  price?: number;
}

export interface ProductManagement {
  shipping?: {
    codAvailable?: boolean;
    freeShipping?: boolean;
    shippingCharge?: number;
  };
  inventory?: {
    trackInventory?: boolean;
    lowStockThreshold?: number;
  };
}

export interface Product {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  price: number;
  mrp?: number;
  discount?: number;
  discountPercent?: number;
  stock: number;
  sku?: string;
  images?: string[];
  image?: string;
  category?: string | { _id: string; name: string; slug?: string };
  subcategory?: string;
  tags?: string[];
  variants?: ProductVariant[];
  management?: ProductManagement;
  codAvailable?: boolean;
  codCharge?: number;
  freeShipping?: boolean;
  shippingCharge?: number;
  weight?: number;
  dimensions?: { length?: number; breadth?: number; height?: number };
  active?: boolean;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ─── Category ────────────────────────────────────────────────── */

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  active?: boolean;
  productCount?: number;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

/* ─── Banner ──────────────────────────────────────────────────── */

export interface Banner {
  _id: string;
  title?: string;
  subtitle?: string;
  image?: string;
  link?: string;
  cta?: string;
  active?: boolean;
  order?: number;
  position?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ─── Order ───────────────────────────────────────────────────── */

export interface OrderCustomer {
  name?: string;
  email?: string;
  phone?: string;
}

export interface OrderAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderItem {
  productId?: string;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
  color?: string;
  size?: string;
  selectedSize?: string;
  selectedColor?: string;
  selectedImage?: string;
  sku?: string;
  discount?: number;
  tax?: number;
  hsn?: number;
}

export interface OrderStatusHistory {
  status: string;
  at: string;
  source?: string;
  error?: string;
  note?: string;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  user?: string;
  status: string;
  currency?: string;
  subtotal?: number;
  shipping?: number;
  tax?: number;
  codCharge?: number;
  total?: number;
  paymentMethod?: string;
  items?: OrderItem[];
  customer?: OrderCustomer;
  address?: OrderAddress;
  createdAtIso?: string;
  statusHistory?: OrderStatusHistory[];
  statusTimestamps?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

/* ─── Payment ─────────────────────────────────────────────────── */

export interface Payment {
  _id: string;
  order?: string;
  user?: string;
  provider?: string;
  providerOrderId?: string;
  providerPaymentId?: string;
  amount?: number;
  currency?: string;
  status: string;
  paymentMethod?: string;
  transactionId?: string;
  paymentMode?: string;
  providerStatus?: string;
  paidAtIso?: string;
  failedAtIso?: string;
  refundedAtIso?: string;
  eventHistory?: Array<Record<string, unknown>>;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

/* ─── Shipment ────────────────────────────────────────────────── */

export interface Shipment {
  _id: string;
  order?: string;
  shiprocketOrderId?: string;
  shiprocketShipmentId?: string;
  awbNumber?: string;
  courierName?: string;
  courierId?: number;
  status: string;
  shiprocketRawStatus?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  retryCount?: number;
  lastError?: string;
  eventHistory?: Array<Record<string, unknown>>;
  createdAt?: string;
  updatedAt?: string;
}

/* ─── User ────────────────────────────────────────────────────── */

export interface User {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  active?: boolean;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ─── Admin ───────────────────────────────────────────────────── */

export interface Admin {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/* ─── Content Settings ────────────────────────────────────────── */

export interface ContentSettings {
  _id?: string;
  enableCod?: boolean;
  codCharge?: number;
  freeShippingThreshold?: number;
  defaultShippingCharge?: number;
  taxRate?: number;
  [key: string]: unknown;
}

/* ─── API Response helpers ────────────────────────────────────── */

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page?: number;
  limit?: number;
  total?: number;
}

/* ─── Analytics ───────────────────────────────────────────────── */

export interface PaymentStats {
  total?: number;
  totalAmount?: number;
  pending?: { count: number; amount: number };
  processing?: { count: number; amount: number };
  completed?: { count: number; amount: number };
  failed?: { count: number; amount: number };
  refunded?: { count: number; amount: number };
}

export interface OrderStats {
  totalOrders?: number;
  counts?: Record<string, number>;
}

/* ─── Generic table/form types ────────────────────────────────── */

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}
