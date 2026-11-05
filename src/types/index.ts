export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  ratingCount: number;
  image: string;
  additionalImages?: string[];
  isJumiaExpress: boolean;
  isOfficialStore: boolean;
  inStock: boolean;
  stockCount: number;
  isFlashSale?: boolean;
  flashSaleRemaining?: number;
  flashSaleTotal?: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  sellerId?: string;
  seller: {
    name: string;
    score: number; // e.g. 88%
    joinDate: string;
    verified: boolean;
    fulfillmentRate: number; // e.g. 96%
  };
  reviews: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  subcategories: string[];
}

export interface DeliveryAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  state: string;
  cityLGA: string;
  isDefault: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';

export interface Order {
  id: string;
  userId?: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  deliveryMethod: 'door' | 'pickup';
  paymentMethod: 'jumiapay' | 'card' | 'bank_transfer' | 'cod';
  status: OrderStatus;
  estimatedDelivery: string;
  trackingSteps: {
    title: string;
    description: string;
    completed: boolean;
    timestamp?: string;
  }[];
}

export type UserRole = 'customer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  walletBalance: number;
  addresses: DeliveryAddress[];
  savedItemIds: string[];
}
