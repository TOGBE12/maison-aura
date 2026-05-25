import { Product, Order, Review } from '../types';

interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  old_price: number | null;
  rating: number;
  stock: number;
  is_new: boolean;
  is_promo: boolean;
  sku: string;
  features: string[];
  specifications: Record<string, string>;
  images: { id: number; url: string; sort_order: number }[];
  colors: { id: number; hex_code: string; name: string }[];
  category: { id: number; name: string; slug: string };
  created_at: string;
  updated_at: string;
}

interface ApiOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  postal_code: string;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  total_price: number;
  payment_method: string;
  status: string;
  coupon_code: string | null;
  notes: string | null;
  items: {
    id: number;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    color: string;
    image: string;
    subtotal: number;
  }[];
  created_at: string;
  updated_at: string;
}

interface ApiReview {
  id: number;
  product_id: number;
  user_name: string;
  user_email: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  products_count: number;
}

export function mapProduct(api: ApiProduct): Product {
  return {
    id: String(api.id),
    name: api.name,
    category: api.category.name,
    description: api.description,
    price: api.price,
    oldPrice: api.old_price ?? undefined,
    rating: api.rating,
    images: api.images.sort((a, b) => a.sort_order - b.sort_order).map(i => i.url),
    stock: api.stock,
    isNew: api.is_new,
    isPromo: api.is_promo,
    colors: api.colors.map(c => c.hex_code),
    colorNames: api.colors.map(c => c.name),
    features: api.features,
    specifications: api.specifications,
  };
}

export function mapProducts(apiProducts: ApiProduct[]): Product[] {
  return apiProducts.map(mapProduct);
}

const STATUS_MAP: Record<string, Order['status']> = {
  'en_attente': 'En attente',
  'confirmé': 'Confirmé',
  'Confirmé': 'Confirmé',
  'expédié': 'Expédié',
  'Expédié': 'Expédié',
  'livré': 'Livré',
  'Livré': 'Livré',
  'anulé': 'Anulé',
  'Anulé': 'Anulé',
};

const PAYMENT_MAP: Record<string, Order['paymentMethod']> = {
  'card': 'card',
  'paypal': 'paypal',
  'delivery': 'delivery',
};

export function mapOrder(api: ApiOrder): Order {
  return {
    id: api.order_number,
    customerName: api.customer_name,
    customerEmail: api.customer_email,
    customerPhone: api.customer_phone,
    address: api.address,
    city: api.city,
    postalCode: api.postal_code,
    items: api.items.map(item => ({
      productId: String(item.product_id),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      color: item.color,
      image: item.image,
    })),
    totalPrice: api.total_price,
    status: (STATUS_MAP[api.status] || api.status) as Order['status'],
    paymentMethod: (PAYMENT_MAP[api.payment_method] || api.payment_method) as Order['paymentMethod'],
    createdAt: api.created_at,
  };
}

export function mapOrders(apiOrders: ApiOrder[]): Order[] {
  return apiOrders.map(mapOrder);
}

export function mapReview(api: ApiReview): Review {
  return {
    id: String(api.id),
    productId: String(api.product_id),
    userName: api.user_name,
    userEmail: api.user_email,
    rating: api.rating,
    comment: api.comment,
    createdAt: api.created_at,
  };
}

export function mapReviews(apiReviews: ApiReview[]): Review[] {
  return apiReviews.map(mapReview);
}

export function mapCategory(api: ApiCategory): string {
  return api.name;
}

export function mapCategories(apiCategories: ApiCategory[]): string[] {
  return apiCategories.map(mapCategory);
}
