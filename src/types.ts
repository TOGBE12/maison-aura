export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  images: string[];
  stock: number;
  isNew?: boolean;
  isPromo?: boolean;
  colors: string[];
  colorNames?: string[];
  features: string[];
  specifications: { [key: string]: string };
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  postalCode: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    color: string;
    image: string;
  }[];
  totalPrice: number;
  status: 'En attente' | 'Confirmé' | 'Expédié' | 'Livré' | 'Anulé';
  paymentMethod: 'card' | 'paypal' | 'delivery';
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export type ThemeType = 'aura-luxe' | 'classic-noir' | 'nude-silk' | 'emerald-royal';

export interface AppTheme {
  id: ThemeType;
  name: string;
  bgPage: string;
  bgPageHex?: string;
  textPrimary: string;
  textPrimaryHex?: string;
  textMuted: string;
  textMutedHex?: string;
  accent: string;      // gold, deep bronze, soft coral, sparkling gold
  accentHover: string;
  cardBg: string;
  cardBgHex?: string;
  border: string;
  borderHex?: string;
  nudeTint: string;
  nudeTintHex?: string;
}
