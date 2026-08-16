// Mock data initialization and utilities for Trozzi Admin

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  image: string;
  galleryImages: string[];
  category: string;
  description: string;
  featured: boolean;
  createdAt: string;
  sizes: string[];
  colors: string[];
  variants: ProductVariant[];
  tags: string[];
  keyFeatures: string[];
  warranty: string;
  warrantyDetails: string;
  saleEnabled: boolean;
  saleDiscount: number;
  saleStartDate: string;
  saleEndDate: string;
  metaTitle: string;
  metaDescription: string;
  weight: number;
  dimensions: { length: number; width: number; height: number };
  shippingCharge: number;
  badge: string;
  brand: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'returned';
  total: number;
  items: number;
  date: string;
  paymentMethod: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  status: 'active' | 'inactive';
  avatar: string;
  lastActive: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  order: number;
  active: boolean;
  productCount: number;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  module: string;
  timestamp: string;
  details: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  enabled: boolean;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  usageCount: number;
  uploadedAt: string;
}

export interface SizeGuide {
  id: string;
  category: string;
  sizes: { size: string; chest: string; waist: string; hips: string }[];
}

export interface ContentSettings {
  defaultAvatarUrl: string;
  bioMaxLength: number;
  showOrderHistory: boolean;
  showWishlistCount: boolean;
  enableProfileEditing: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  details: string;
}

export interface PaymentSettings {
  upiId: string;
  storeName: string;
  contactPhone: string;
  methods: PaymentMethod[];
}

export interface Settlement {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
  method: string;
}

export interface DashboardStats {
  today: { products: number; orders: number; revenue: number; customers: number };
  week: { products: number; orders: number; revenue: number; customers: number };
  month: { products: number; orders: number; revenue: number; customers: number };
  custom: { products: number; orders: number; revenue: number; customers: number };
}

export interface AnalyticsData {
  pageViews: { date: string; views: number }[];
  sales: { date: string; amount: number }[];
  visitors: { date: string; count: number }[];
  topProducts: { name: string; sales: number; revenue: number }[];
  lowProducts: { name: string; sales: number; revenue: number }[];
  categoryStats: { category: string; sales: number; revenue: number }[];
  conversionRate: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  metrics: string[];
  dateRange: { from: string; to: string };
  createdAt: string;
  data: unknown[];
}

export interface AIRule {
  id: string;
  name: string;
  description: string;
  type: string;
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  enabled: boolean;
  icon: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const defaultAuthUser: AuthUser = {
  id: generateId(),
  name: 'Admin User',
  email: 'admin@trozzi.com',
  password: 'admin123',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
};

const defaultProducts: Product[] = [
  { id: generateId(), name: 'Premium Wireless Headphones', sku: 'WH-001', price: 299.99, stock: 45, status: 'active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100', galleryImages: [], category: 'Electronics', description: 'High-quality wireless headphones with noise cancellation', featured: true, createdAt: '2024-01-15', sizes: [], colors: ['Black', 'White', 'Silver'], variants: [], tags: ['audio', 'wireless', 'premium'], keyFeatures: ['40-hour battery life', 'Active noise cancellation', 'Premium drivers'], warranty: '2 Years', warrantyDetails: 'Covers manufacturing defects', saleEnabled: false, saleDiscount: 0, saleStartDate: '', saleEndDate: '', metaTitle: 'Premium Wireless Headphones | Trozzi', metaDescription: 'Experience premium audio with our wireless headphones', weight: 0.3, dimensions: { length: 20, width: 18, height: 10 }, shippingCharge: 0, badge: 'bestseller', brand: 'Trozzi Audio' },
  { id: generateId(), name: 'Smart Watch Pro', sku: 'SW-002', price: 449.99, stock: 3, status: 'active', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100', galleryImages: [], category: 'Electronics', description: 'Advanced smartwatch with health monitoring', featured: true, createdAt: '2024-01-20', sizes: ['S', 'M', 'L'], colors: ['Black', 'Silver', 'Rose Gold'], variants: [], tags: ['wearable', 'smart', 'fitness'], keyFeatures: ['Heart rate monitor', 'GPS tracking', 'Water resistant'], warranty: '1 Year', warrantyDetails: 'Standard manufacturer warranty', saleEnabled: true, saleDiscount: 15, saleStartDate: '2024-12-01', saleEndDate: '2024-12-31', metaTitle: 'Smart Watch Pro | Trozzi', metaDescription: 'Stay connected with our advanced smartwatch', weight: 0.1, dimensions: { length: 5, width: 5, height: 2 }, shippingCharge: 0, badge: 'new', brand: 'Trozzi Tech' },
  { id: generateId(), name: 'Leather Laptop Bag', sku: 'LB-003', price: 189.99, stock: 28, status: 'active', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100', galleryImages: [], category: 'Accessories', description: 'Premium leather laptop bag', featured: false, createdAt: '2024-02-01', sizes: [], colors: ['Brown', 'Black', 'Tan'], variants: [], tags: ['leather', 'professional', 'laptop'], keyFeatures: ['Genuine leather', 'Padded laptop compartment', 'Multiple pockets'], warranty: '6 Months', warrantyDetails: 'Covers stitching defects', saleEnabled: false, saleDiscount: 0, saleStartDate: '', saleEndDate: '', metaTitle: 'Leather Laptop Bag | Trozzi', metaDescription: 'Carry your laptop in style', weight: 1.2, dimensions: { length: 40, width: 30, height: 10 }, shippingCharge: 0, badge: '', brand: 'Trozzi Leather' },
  { id: generateId(), name: 'Minimalist Desk Lamp', sku: 'DL-004', price: 79.99, stock: 0, status: 'inactive', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', galleryImages: [], category: 'Home', description: 'Modern LED desk lamp', featured: false, createdAt: '2024-02-10', sizes: [], colors: ['White', 'Black'], variants: [], tags: ['lighting', 'modern', 'led'], keyFeatures: ['Touch control', 'Adjustable brightness', 'USB charging port'], warranty: '1 Year', warrantyDetails: 'LED warranty', saleEnabled: false, saleDiscount: 0, saleStartDate: '', saleEndDate: '', metaTitle: 'Minimalist Desk Lamp | Trozzi', metaDescription: 'Illuminate your workspace', weight: 0.8, dimensions: { length: 15, width: 15, height: 45 }, shippingCharge: 0, badge: '', brand: 'Trozzi Home' },
  { id: generateId(), name: 'Ergonomic Office Chair', sku: 'OC-005', price: 599.99, stock: 12, status: 'active', image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=100', galleryImages: [], category: 'Furniture', description: 'Ergonomic mesh office chair', featured: true, createdAt: '2024-02-15', sizes: [], colors: ['Black', 'Gray'], variants: [], tags: ['office', 'ergonomic', 'comfort'], keyFeatures: ['Lumbar support', 'Adjustable armrests', 'Breathable mesh'], warranty: '5 Years', warrantyDetails: 'Full replacement warranty', saleEnabled: false, saleDiscount: 0, saleStartDate: '', saleEndDate: '', metaTitle: 'Ergonomic Office Chair | Trozzi', metaDescription: 'Work comfortably all day', weight: 15, dimensions: { length: 70, width: 70, height: 120 }, shippingCharge: 0, badge: 'bestseller', brand: 'Trozzi Office' },
  { id: generateId(), name: 'Portable Bluetooth Speaker', sku: 'BS-006', price: 129.99, stock: 67, status: 'active', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100', galleryImages: [], category: 'Electronics', description: 'Waterproof bluetooth speaker', featured: false, createdAt: '2024-02-20', sizes: [], colors: ['Blue', 'Red', 'Black'], variants: [], tags: ['audio', 'portable', 'waterproof'], keyFeatures: ['IPX7 waterproof', '20-hour battery', '360° sound'], warranty: '1 Year', warrantyDetails: 'Standard warranty', saleEnabled: false, saleDiscount: 0, saleStartDate: '', saleEndDate: '', metaTitle: 'Portable Bluetooth Speaker | Trozzi', metaDescription: 'Take your music anywhere', weight: 0.5, dimensions: { length: 10, width: 10, height: 15 }, shippingCharge: 0, badge: '', brand: 'Trozzi Audio' },
  { id: generateId(), name: 'Canvas Backpack', sku: 'CB-007', price: 89.99, stock: 5, status: 'active', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100', galleryImages: [], category: 'Accessories', description: 'Durable canvas backpack', featured: false, createdAt: '2024-03-01', sizes: [], colors: ['Navy', 'Green', 'Gray'], variants: [], tags: ['travel', 'casual', 'durable'], keyFeatures: ['Water-resistant canvas', 'Laptop sleeve', 'Padded straps'], warranty: '1 Year', warrantyDetails: 'Covers material defects', saleEnabled: true, saleDiscount: 20, saleStartDate: '2024-12-10', saleEndDate: '2024-12-25', metaTitle: 'Canvas Backpack | Trozzi', metaDescription: 'Your perfect travel companion', weight: 0.8, dimensions: { length: 30, width: 15, height: 45 }, shippingCharge: 0, badge: 'limited', brand: 'Trozzi Bags' },
  { id: generateId(), name: 'Mechanical Keyboard', sku: 'MK-008', price: 179.99, stock: 34, status: 'draft', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100', galleryImages: [], category: 'Electronics', description: 'RGB mechanical gaming keyboard', featured: false, createdAt: '2024-03-05', sizes: [], colors: ['Black'], variants: [], tags: ['gaming', 'mechanical', 'rgb'], keyFeatures: ['Cherry MX switches', 'RGB backlighting', 'Macro keys'], warranty: '2 Years', warrantyDetails: 'Full keyboard warranty', saleEnabled: false, saleDiscount: 0, saleStartDate: '', saleEndDate: '', metaTitle: 'Mechanical Keyboard | Trozzi', metaDescription: 'Level up your gaming setup', weight: 1.1, dimensions: { length: 45, width: 15, height: 4 }, shippingCharge: 0, badge: '', brand: 'Trozzi Gaming' },
];

const defaultOrders: Order[] = [
  { id: generateId(), orderNumber: 'ORD-2024-001', customer: 'John Smith', email: 'john@example.com', status: 'new', total: 549.98, items: 2, date: '2024-12-14', paymentMethod: 'Credit Card' },
  { id: generateId(), orderNumber: 'ORD-2024-002', customer: 'Sarah Johnson', email: 'sarah@example.com', status: 'processing', total: 299.99, items: 1, date: '2024-12-13', paymentMethod: 'PayPal' },
  { id: generateId(), orderNumber: 'ORD-2024-003', customer: 'Mike Brown', email: 'mike@example.com', status: 'shipped', total: 869.97, items: 3, date: '2024-12-12', paymentMethod: 'Credit Card' },
  { id: generateId(), orderNumber: 'ORD-2024-004', customer: 'Emily Davis', email: 'emily@example.com', status: 'delivered', total: 189.99, items: 1, date: '2024-12-10', paymentMethod: 'UPI' },
  { id: generateId(), orderNumber: 'ORD-2024-005', customer: 'Chris Wilson', email: 'chris@example.com', status: 'returned', total: 449.99, items: 1, date: '2024-12-08', paymentMethod: 'Credit Card' },
  { id: generateId(), orderNumber: 'ORD-2024-006', customer: 'Lisa Anderson', email: 'lisa@example.com', status: 'delivered', total: 679.98, items: 2, date: '2024-12-05', paymentMethod: 'PayPal' },
];

const defaultUsers: User[] = [
  { id: generateId(), name: 'Admin User', email: 'admin@glowalchemy.com', role: 'admin', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', lastActive: '2024-12-15', createdAt: '2024-01-01' },
  { id: generateId(), name: 'Sarah Manager', email: 'sarah@glowalchemy.com', role: 'staff', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', lastActive: '2024-12-15', createdAt: '2024-02-15' },
  { id: generateId(), name: 'Mike Support', email: 'mike@glowalchemy.com', role: 'staff', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', lastActive: '2024-12-14', createdAt: '2024-03-01' },
  { id: generateId(), name: 'Emily Customer', email: 'emily@customer.com', role: 'user', status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', lastActive: '2024-12-13', createdAt: '2024-04-20' },
  { id: generateId(), name: 'John Inactive', email: 'john@example.com', role: 'user', status: 'inactive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', lastActive: '2024-11-01', createdAt: '2024-05-10' },
];

const defaultCategories: Category[] = [
  { id: generateId(), name: 'Electronics', description: 'Electronic devices and accessories', parentId: null, order: 1, active: true, productCount: 4 },
  { id: generateId(), name: 'Accessories', description: 'Fashion and tech accessories', parentId: null, order: 2, active: true, productCount: 2 },
  { id: generateId(), name: 'Furniture', description: 'Home and office furniture', parentId: null, order: 3, active: true, productCount: 1 },
  { id: generateId(), name: 'Home', description: 'Home decor and appliances', parentId: null, order: 4, active: true, productCount: 1 },
  { id: generateId(), name: 'Audio', description: 'Audio equipment', parentId: null, order: 5, active: false, productCount: 0 },
];

const defaultAuditLogs: AuditLog[] = [
  { id: generateId(), user: 'Admin User', action: 'Created product', module: 'Products', timestamp: '2024-12-15 10:30:00', details: 'Created new product: Premium Wireless Headphones' },
  { id: generateId(), user: 'Sarah Manager', action: 'Updated order status', module: 'Orders', timestamp: '2024-12-15 09:45:00', details: 'Updated order ORD-2024-003 to shipped' },
  { id: generateId(), user: 'Admin User', action: 'User role changed', module: 'Users', timestamp: '2024-12-14 16:20:00', details: 'Changed Mike Support role to staff' },
  { id: generateId(), user: 'Mike Support', action: 'Inventory updated', module: 'Inventory', timestamp: '2024-12-14 14:15:00', details: 'Updated stock for Smart Watch Pro' },
  { id: generateId(), user: 'Admin User', action: 'Settings modified', module: 'Settings', timestamp: '2024-12-13 11:00:00', details: 'Updated payment settings' },
];

const defaultNotifications: Notification[] = [
  { id: generateId(), title: 'Low Stock Alert', message: 'Smart Watch Pro is running low on stock', type: 'warning', enabled: true, createdAt: '2024-12-15' },
  { id: generateId(), title: 'New Order', message: 'New order received from John Smith', type: 'success', enabled: true, createdAt: '2024-12-14' },
  { id: generateId(), title: 'Payment Failed', message: 'Payment failed for order ORD-2024-007', type: 'error', enabled: true, createdAt: '2024-12-13' },
  { id: generateId(), title: 'System Update', message: 'System maintenance scheduled for tonight', type: 'info', enabled: false, createdAt: '2024-12-12' },
];

const defaultMediaItems: MediaItem[] = [
  { id: generateId(), name: 'product-hero.jpg', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', type: 'image/jpeg', size: 245000, usageCount: 5, uploadedAt: '2024-12-10' },
  { id: generateId(), name: 'banner-sale.jpg', url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400', type: 'image/jpeg', size: 189000, usageCount: 2, uploadedAt: '2024-12-08' },
  { id: generateId(), name: 'category-electronics.jpg', url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', type: 'image/jpeg', size: 312000, usageCount: 8, uploadedAt: '2024-12-05' },
  { id: generateId(), name: 'product-bg.png', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', type: 'image/png', size: 567000, usageCount: 12, uploadedAt: '2024-12-01' },
];

const defaultSizeGuides: SizeGuide[] = [
  { id: generateId(), category: 'Apparel', sizes: [
    { size: 'S', chest: '34-36"', waist: '28-30"', hips: '34-36"' },
    { size: 'M', chest: '38-40"', waist: '32-34"', hips: '38-40"' },
    { size: 'L', chest: '42-44"', waist: '36-38"', hips: '42-44"' },
    { size: 'XL', chest: '46-48"', waist: '40-42"', hips: '46-48"' },
  ]},
  { id: generateId(), category: 'Shoes', sizes: [
    { size: '7', chest: '24cm', waist: '', hips: '' },
    { size: '8', chest: '25cm', waist: '', hips: '' },
    { size: '9', chest: '26cm', waist: '', hips: '' },
    { size: '10', chest: '27cm', waist: '', hips: '' },
  ]},
];

const defaultContentSettings: ContentSettings = {
  defaultAvatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
  bioMaxLength: 500,
  showOrderHistory: true,
  showWishlistCount: true,
  enableProfileEditing: true,
};

const defaultPaymentSettings: PaymentSettings = {
  upiId: 'store@upi',
  storeName: 'Trozzi Store',
  contactPhone: '+1 234 567 8900',
  methods: [
    { id: generateId(), name: 'Credit Card', type: 'card', enabled: true, details: 'Visa, Mastercard, Amex' },
    { id: generateId(), name: 'PayPal', type: 'paypal', enabled: true, details: 'PayPal payments' },
    { id: generateId(), name: 'UPI', type: 'upi', enabled: true, details: 'UPI payments' },
    { id: generateId(), name: 'Bank Transfer', type: 'bank', enabled: false, details: 'Direct bank transfer' },
  ],
};

const defaultSettlements: Settlement[] = [
  { id: generateId(), date: '2024-12-15', amount: 4529.50, status: 'completed', reference: 'SET-2024-001', method: 'Bank Transfer' },
  { id: generateId(), date: '2024-12-08', amount: 3875.25, status: 'completed', reference: 'SET-2024-002', method: 'Bank Transfer' },
  { id: generateId(), date: '2024-12-01', amount: 5120.00, status: 'completed', reference: 'SET-2024-003', method: 'Bank Transfer' },
  { id: generateId(), date: '2024-11-24', amount: 2980.75, status: 'pending', reference: 'SET-2024-004', method: 'Bank Transfer' },
];

const defaultDashboardStats: DashboardStats = {
  today: { products: 8, orders: 12, revenue: 3549.87, customers: 45 },
  week: { products: 8, orders: 67, revenue: 24879.50, customers: 156 },
  month: { products: 8, orders: 245, revenue: 89650.00, customers: 523 },
  custom: { products: 8, orders: 100, revenue: 45000.00, customers: 250 },
};

const defaultAnalyticsData: AnalyticsData = {
  pageViews: [
    { date: '2024-12-09', views: 1250 },
    { date: '2024-12-10', views: 1480 },
    { date: '2024-12-11', views: 1320 },
    { date: '2024-12-12', views: 1680 },
    { date: '2024-12-13', views: 1890 },
    { date: '2024-12-14', views: 2100 },
    { date: '2024-12-15', views: 1750 },
  ],
  sales: [
    { date: '2024-12-09', amount: 3200 },
    { date: '2024-12-10', amount: 4100 },
    { date: '2024-12-11', amount: 3800 },
    { date: '2024-12-12', amount: 5200 },
    { date: '2024-12-13', amount: 4800 },
    { date: '2024-12-14', amount: 6100 },
    { date: '2024-12-15', amount: 3550 },
  ],
  visitors: [
    { date: '2024-12-09', count: 890 },
    { date: '2024-12-10', count: 1020 },
    { date: '2024-12-11', count: 950 },
    { date: '2024-12-12', count: 1180 },
    { date: '2024-12-13', count: 1350 },
    { date: '2024-12-14', count: 1520 },
    { date: '2024-12-15', count: 1280 },
  ],
  topProducts: [
    { name: 'Premium Wireless Headphones', sales: 156, revenue: 46798.44 },
    { name: 'Smart Watch Pro', sales: 132, revenue: 59398.68 },
    { name: 'Ergonomic Office Chair', sales: 98, revenue: 58799.02 },
    { name: 'Leather Laptop Bag', sales: 87, revenue: 16529.13 },
    { name: 'Portable Bluetooth Speaker', sales: 76, revenue: 9879.24 },
  ],
  lowProducts: [
    { name: 'Minimalist Desk Lamp', sales: 5, revenue: 399.95 },
    { name: 'Canvas Backpack', sales: 12, revenue: 1079.88 },
    { name: 'Mechanical Keyboard', sales: 8, revenue: 1439.92 },
  ],
  categoryStats: [
    { category: 'Electronics', sales: 380, revenue: 125000 },
    { category: 'Accessories', sales: 120, revenue: 18500 },
    { category: 'Furniture', sales: 98, revenue: 58800 },
    { category: 'Home', sales: 25, revenue: 2000 },
  ],
  conversionRate: 3.8,
  bounceRate: 42.5,
  avgSessionDuration: 245,
};

const defaultReports: Report[] = [];

const defaultAIRules: AIRule[] = [
  { id: generateId(), name: 'Auto Price Adjustment', description: 'Automatically adjust prices based on demand', type: 'pricing', enabled: false, config: { threshold: 10, maxChange: 5 } },
  { id: generateId(), name: 'Low Stock Alert', description: 'Send alerts when stock falls below threshold', type: 'inventory', enabled: true, config: { threshold: 10 } },
  { id: generateId(), name: 'Smart Recommendations', description: 'AI-powered product recommendations', type: 'recommendations', enabled: true, config: { algorithm: 'collaborative' } },
  { id: generateId(), name: 'Fraud Detection', description: 'Detect suspicious orders', type: 'security', enabled: true, config: { sensitivity: 'medium' } },
];

const defaultPlugins: Plugin[] = [
  { id: generateId(), name: 'Stripe Payments', description: 'Accept credit card payments via Stripe', version: '2.1.0', author: 'Trozzi', enabled: true, icon: '💳' },
  { id: generateId(), name: 'Mailchimp Integration', description: 'Sync customers with Mailchimp', version: '1.5.2', author: 'Trozzi', enabled: false, icon: '📧' },
  { id: generateId(), name: 'Google Analytics', description: 'Track website analytics', version: '3.0.1', author: 'Trozzi', enabled: true, icon: '📊' },
  { id: generateId(), name: 'Zendesk Support', description: 'Customer support integration', version: '1.2.0', author: 'Trozzi', enabled: false, icon: '🎧' },
];

const defaultFeatureFlags: FeatureFlag[] = [
  { id: 'maintenance', name: 'Maintenance Mode', description: 'Temporarily disable store', enabled: false },
  { id: 'debug', name: 'Debug Mode', description: 'Enable detailed logging', enabled: false },
  { id: 'cache', name: 'Cache Enabled', description: 'Improve performance with caching', enabled: true },
  { id: 'ssl', name: 'Force SSL', description: 'Redirect all traffic to HTTPS', enabled: true },
];

// Initialize localStorage with default data
export const initializeMockData = () => {
  if (!localStorage.getItem('glowalchemy_auth_user')) {
    localStorage.setItem('glowalchemy_auth_user', JSON.stringify(defaultAuthUser));
  }
  if (!localStorage.getItem('glowalchemy_products')) {
    localStorage.setItem('glowalchemy_products', JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem('glowalchemy_orders')) {
    localStorage.setItem('glowalchemy_orders', JSON.stringify(defaultOrders));
  }
  if (!localStorage.getItem('glowalchemy_users')) {
    localStorage.setItem('glowalchemy_users', JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem('glowalchemy_categories')) {
    localStorage.setItem('glowalchemy_categories', JSON.stringify(defaultCategories));
  }
  if (!localStorage.getItem('glowalchemy_audit_logs')) {
    localStorage.setItem('glowalchemy_audit_logs', JSON.stringify(defaultAuditLogs));
  }
  if (!localStorage.getItem('glowalchemy_notifications')) {
    localStorage.setItem('glowalchemy_notifications', JSON.stringify(defaultNotifications));
  }
  if (!localStorage.getItem('glowalchemy_media')) {
    localStorage.setItem('glowalchemy_media', JSON.stringify(defaultMediaItems));
  }
  if (!localStorage.getItem('glowalchemy_size_guides')) {
    localStorage.setItem('glowalchemy_size_guides', JSON.stringify(defaultSizeGuides));
  }
  if (!localStorage.getItem('glowalchemy_content_settings')) {
    localStorage.setItem('glowalchemy_content_settings', JSON.stringify(defaultContentSettings));
  }
  if (!localStorage.getItem('glowalchemy_payment_settings')) {
    localStorage.setItem('glowalchemy_payment_settings', JSON.stringify(defaultPaymentSettings));
  }
  if (!localStorage.getItem('glowalchemy_settlements')) {
    localStorage.setItem('glowalchemy_settlements', JSON.stringify(defaultSettlements));
  }
  if (!localStorage.getItem('glowalchemy_dashboard_stats')) {
    localStorage.setItem('glowalchemy_dashboard_stats', JSON.stringify(defaultDashboardStats));
  }
  if (!localStorage.getItem('glowalchemy_analytics')) {
    localStorage.setItem('glowalchemy_analytics', JSON.stringify(defaultAnalyticsData));
  }
  if (!localStorage.getItem('glowalchemy_reports')) {
    localStorage.setItem('glowalchemy_reports', JSON.stringify(defaultReports));
  }
  if (!localStorage.getItem('glowalchemy_ai_rules')) {
    localStorage.setItem('glowalchemy_ai_rules', JSON.stringify(defaultAIRules));
  }
  if (!localStorage.getItem('glowalchemy_plugins')) {
    localStorage.setItem('glowalchemy_plugins', JSON.stringify(defaultPlugins));
  }
  if (!localStorage.getItem('glowalchemy_feature_flags')) {
    localStorage.setItem('glowalchemy_feature_flags', JSON.stringify(defaultFeatureFlags));
  }
};

// Data access functions
export const getData = <T>(key: string): T | null => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const setData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Auth functions
export const getAuthUser = (): AuthUser | null => getData('glowalchemy_auth_user');
export const setAuthUser = (user: AuthUser) => setData('glowalchemy_auth_user', user);
export const getLoggedInUser = (): AuthUser | null => getData('glowalchemy_logged_in_user');
export const setLoggedInUser = (user: AuthUser | null) => {
  if (user) {
    setData('glowalchemy_logged_in_user', user);
  } else {
    localStorage.removeItem('glowalchemy_logged_in_user');
  }
};
export const isAuthenticated = (): boolean => !!getLoggedInUser();

export const getProducts = (): Product[] => getData('glowalchemy_products') || [];
export const setProducts = (products: Product[]) => setData('glowalchemy_products', products);

export const getOrders = (): Order[] => getData('glowalchemy_orders') || [];
export const setOrders = (orders: Order[]) => setData('glowalchemy_orders', orders);

export const getUsers = (): User[] => getData('glowalchemy_users') || [];
export const setUsers = (users: User[]) => setData('glowalchemy_users', users);

export const getCategories = (): Category[] => getData('glowalchemy_categories') || [];
export const setCategories = (categories: Category[]) => setData('glowalchemy_categories', categories);

export const getAuditLogs = (): AuditLog[] => getData('glowalchemy_audit_logs') || [];
export const addAuditLog = (log: Omit<AuditLog, 'id'>) => {
  const logs = getAuditLogs();
  logs.unshift({ ...log, id: generateId() });
  setData('glowalchemy_audit_logs', logs.slice(0, 100));
};

export const getNotifications = (): Notification[] => getData('glowalchemy_notifications') || [];
export const setNotifications = (notifications: Notification[]) => setData('glowalchemy_notifications', notifications);

export const getMediaItems = (): MediaItem[] => getData('glowalchemy_media') || [];
export const setMediaItems = (media: MediaItem[]) => setData('glowalchemy_media', media);

export const getSizeGuides = (): SizeGuide[] => getData('glowalchemy_size_guides') || [];
export const setSizeGuides = (guides: SizeGuide[]) => setData('glowalchemy_size_guides', guides);

export const getContentSettings = (): ContentSettings => getData('glowalchemy_content_settings') || defaultContentSettings;
export const setContentSettings = (settings: ContentSettings) => setData('glowalchemy_content_settings', settings);

export const getPaymentSettings = (): PaymentSettings => getData('glowalchemy_payment_settings') || defaultPaymentSettings;
export const setPaymentSettings = (settings: PaymentSettings) => setData('glowalchemy_payment_settings', settings);

export const getSettlements = (): Settlement[] => getData('glowalchemy_settlements') || [];
export const setSettlements = (settlements: Settlement[]) => setData('glowalchemy_settlements', settlements);

export const getDashboardStats = (): DashboardStats => getData('glowalchemy_dashboard_stats') || defaultDashboardStats;
export const getAnalyticsData = (): AnalyticsData => getData('glowalchemy_analytics') || defaultAnalyticsData;

export const getReports = (): Report[] => getData('glowalchemy_reports') || [];
export const setReports = (reports: Report[]) => setData('glowalchemy_reports', reports);

export const getAIRules = (): AIRule[] => getData('glowalchemy_ai_rules') || [];
export const setAIRules = (rules: AIRule[]) => setData('glowalchemy_ai_rules', rules);

export const getPlugins = (): Plugin[] => getData('glowalchemy_plugins') || [];
export const setPlugins = (plugins: Plugin[]) => setData('glowalchemy_plugins', plugins);

export const getFeatureFlags = (): FeatureFlag[] => getData('glowalchemy_feature_flags') || [];
export const setFeatureFlags = (flags: FeatureFlag[]) => setData('glowalchemy_feature_flags', flags);

// Backup functions
export const createBackup = () => {
  const backup: Record<string, unknown> = {};
  const keys = [
    'glowalchemy_products', 'glowalchemy_orders', 'glowalchemy_users', 'glowalchemy_categories',
    'glowalchemy_audit_logs', 'glowalchemy_notifications', 'glowalchemy_media', 'glowalchemy_size_guides',
    'glowalchemy_content_settings', 'glowalchemy_payment_settings', 'glowalchemy_settlements',
    'glowalchemy_analytics', 'glowalchemy_reports', 'glowalchemy_ai_rules', 'glowalchemy_plugins', 'glowalchemy_feature_flags'
  ];
  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) backup[key] = JSON.parse(data);
  });
  localStorage.setItem('glowalchemy_backup', JSON.stringify(backup));
  return backup;
};

export const restoreBackup = () => {
  const backupStr = localStorage.getItem('glowalchemy_backup');
  if (!backupStr) return false;
  const backup = JSON.parse(backupStr);
  Object.entries(backup).forEach(([key, value]) => {
    localStorage.setItem(key, JSON.stringify(value));
  });
  return true;
};

// Export utilities
export const exportToCSV = (data: Array<Record<string, unknown>>, filename: string) => {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => {
      const val = row[h];
      if (typeof val === 'object') return JSON.stringify(val).replace(/,/g, ';');
      return String(val).replace(/,/g, ';');
    }).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export { generateId };
