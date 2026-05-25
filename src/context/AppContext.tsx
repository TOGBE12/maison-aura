import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Review, User, ThemeType, AppTheme } from '../types';
import { INITIAL_PRODUCTS, AVAILABLE_THEMES } from '../data/products';

interface BackofficeStats {
  totalSales: number;
  totalOrdersCount: number;
  lowStockCount: number;
  monthlyRevenue: number;
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, color: string) => void;
  removeFromCart: (productId: string, color: string) => void;
  updateCartQuantity: (productId: string, color: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  reviews: Review[];
  addProductReview: (productId: string, userName: string, userEmail: string, rating: number, comment: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, name: string, isAdmin: boolean) => boolean;
  logout: () => void;
  currentTheme: AppTheme;
  setThemeById: (id: ThemeType) => void;
  customRoute: { page: string; params: Record<string, string> };
  navigateTo: (page: string, params?: Record<string, string>) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  stats: BackofficeStats;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Core Seed Data for Orders
const SEED_ORDERS: Order[] = [
  {
    id: 'MV-29471',
    customerName: 'Clémence Dubois',
    customerEmail: 'clemence.dubois@me.com',
    customerPhone: '+33 6 45 89 23 11',
    address: '14 Rue du Faubourg Saint-Honoré',
    city: 'Paris',
    postalCode: '75008',
    items: [
      {
        productId: 'bag_1',
        name: 'L’Aura Classique',
        price: 950,
        quantity: 1,
        color: '#8c6239',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop'
      }
    ],
    totalPrice: 950,
    status: 'Livré',
    paymentMethod: 'card',
    createdAt: '2026-05-14T14:32:00Z'
  },
  {
    id: 'MV-29472',
    customerName: 'Sophie Martin',
    customerEmail: 'sophie.martin@gmail.com',
    customerPhone: '+33 7 12 34 56 78',
    address: '8 Boulevard de la Croisette',
    city: 'Cannes',
    postalCode: '06400',
    items: [
      {
        productId: 'bag_4',
        name: 'Le Minuit Clutch',
        price: 320,
        quantity: 2,
        color: '#141414',
        image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=800&auto=format&fit=crop'
      }
    ],
    totalPrice: 640,
    status: 'Expédié',
    paymentMethod: 'card',
    createdAt: '2026-05-16T10:15:00Z'
  },
  {
    id: 'MV-29473',
    customerName: 'Marc-Antoine de la Roche',
    customerEmail: 'ma.roche@chateau.fr',
    customerPhone: '+33 6 88 99 00 11',
    address: 'Château du Clos, Route des Vins',
    city: 'Bordeaux',
    postalCode: '33000',
    items: [
      {
        productId: 'bag_3',
        name: 'L’Échappée Weekend',
        price: 750,
        quantity: 1,
        color: '#5a3a1f',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop'
      }
    ],
    totalPrice: 750,
    status: 'Confirmé',
    paymentMethod: 'paypal',
    createdAt: '2026-05-18T09:44:00Z'
  },
  {
    id: 'MV-29474',
    customerName: 'Léa Chevalier',
    customerEmail: 'lea.chevalier@sciencespo.fr',
    customerPhone: '+33 6 44 21 89 77',
    address: '42 Rue des Écoles',
    city: 'Paris',
    postalCode: '75005',
    items: [
      {
        productId: 'bag_7',
        name: 'L’Aventurier Urbain',
        price: 240,
        quantity: 1,
        color: '#3c3c3c',
        image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop'
      }
    ],
    totalPrice: 240,
    status: 'En attente',
    paymentMethod: 'delivery',
    createdAt: '2026-05-19T11:20:00Z'
  },
  {
    id: 'MV-29475',
    customerName: 'Chloé Bernard',
    customerEmail: 'chloe.bern@yahoo.fr',
    customerPhone: '+33 7 98 76 54 32',
    address: '12 Avenue des Alpes',
    city: 'Chamonix',
    postalCode: '74400',
    items: [
      {
        productId: 'bag_2',
        name: 'Le Cabas Horizon',
        price: 490,
        quantity: 1,
        color: '#e2ceb8',
        image: 'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?q=80&w=800&auto=format&fit=crop'
      },
      {
        productId: 'bag_6',
        name: 'Le Studio Minimal',
        price: 420,
        quantity: 1,
        color: '#a82020',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop'
      }
    ],
    totalPrice: 910,
    status: 'En attente',
    paymentMethod: 'card',
    createdAt: '2026-05-19T17:05:00Z'
  }
];

// Core Seed Data for Reviews
const SEED_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    productId: 'bag_1',
    userName: 'Emilie R.',
    userEmail: 'emilie@luxe.fr',
    rating: 5,
    comment: 'Un sac absolument divin. Le cuir sent divinement bon, les finitions sont irréprochables. On sent le savoir-faire de l’atelier. Le fermoir or brille magnifiquement.',
    createdAt: '2026-05-10T08:00:00Z'
  },
  {
    id: 'rev_2',
    productId: 'bag_1',
    userName: 'Camille L.',
    userEmail: 'camille@luxury-world.com',
    rating: 4,
    comment: 'Très belle pièce, classe et intemporelle. Reçu élégamment emballé dans son coffret et pochon en satin. Légèrement plus petit en vrai que sur l’image mais merveilleux.',
    createdAt: '2026-05-12T15:20:00Z'
  },
  {
    id: 'rev_3',
    productId: 'bag_2',
    userName: 'Aurélie D.',
    userEmail: 'aurelie.d@mac.com',
    rating: 5,
    comment: 'Mon sac de bureau quotidien. Spacieux, discret mais très premium. Mon macbook pro 13 s’y glisse sans forcer. Les coutures croisées sont superbes.',
    createdAt: '2026-05-13T18:45:00Z'
  },
  {
    id: 'rev_4',
    productId: 'bag_8',
    userName: 'Victoire P.',
    userEmail: 'victoire.p@nice.fr',
    rating: 5,
    comment: 'Le clou du spectacle pour mes vacances ! Ce tressage est d’une finesse incroyable combiné à ce cuir jaune d’or somptueux. Un vrai coup de cœur.',
    createdAt: '2026-05-18T12:00:00Z'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products storage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mv_luxury_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Cart storage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mv_luxury_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders storage
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mv_luxury_orders');
    return saved ? JSON.parse(saved) : SEED_ORDERS;
  });

  // Reviews storage
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('mv_luxury_reviews');
    return saved ? JSON.parse(saved) : SEED_REVIEWS;
  });

  // User auth state (Simulated: administrator login out-of-the-box makes checking easy)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mv_luxury_user');
    if (saved) return JSON.parse(saved);
    // Default to admin so it is ready to analyze right away, or they can toggle back.
    return {
      id: 'usr_admin',
      name: 'Marilyn (Vendeuse)',
      email: 'marilyn@mvluxury.com',
      isAdmin: true,
      createdAt: '2026-01-01T00:00:00Z'
    };
  });

  // Theme selection
  const [themeId, setThemeId] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('mv_luxury_theme');
    return (saved as ThemeType) || 'aura-luxe';
  });

  // Setup Routing based on URL hashes `#home`, `#shop`, etc.
  const [customRoute, setCustomRoute] = useState<{ page: string; params: Record<string, string> }>(() => {
    return parseHash(window.location.hash);
  });

  // Notification Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Filtering and sorting state for Shop Page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [sortBy, setSortBy] = useState('popularité');

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem('mv_luxury_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mv_luxury_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('mv_luxury_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mv_luxury_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mv_luxury_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mv_luxury_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mv_luxury_theme', themeId);
  }, [themeId]);

  // Read theme object by ID
  const currentTheme = AVAILABLE_THEMES.find(t => t.id === themeId) || AVAILABLE_THEMES[0];

  const setThemeById = (id: ThemeType) => {
    setThemeId(id);
    showToast(`Thème changé : ${AVAILABLE_THEMES.find(t => t.id === id)?.name}`, 'info');
  };

  // Parsing helper for Hash URL
  function parseHash(hash: string) {
    if (!hash || hash === '#') {
      return { page: 'home', params: {} };
    }
    const hashClean = hash.replace(/^#/, '');
    const [path, queryStr] = hashClean.split('?');
    const params: Record<string, string> = {};
    if (queryStr) {
      queryStr.split('&').forEach(param => {
        const [k, v] = param.split('=');
        if (k && v) params[k] = decodeURIComponent(v);
      });
    }
    return { page: path, params };
  }

  // Monitor hash changes for back/forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      setCustomRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Custom router function
  const navigateTo = (page: string, params?: Record<string, string>) => {
    let query = '';
    if (params && Object.keys(params).length > 0) {
      query = '?' + Object.entries(params)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&');
    }
    window.location.hash = `${page}${query}`;
  };

  // Toast System
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Logic
  const addToCart = (product: Product, quantity: number, color: string) => {
    if (product.stock <= 0) {
      showToast('Ce produit est actuellement en rupture de stock.', 'error');
      return;
    }

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === color
      );

      if (existingIdx > -1) {
        const newQty = prev[existingIdx].quantity + quantity;
        if (newQty > product.stock) {
          showToast(`Stock limité. Vous ne pouvez pas ajouter plus de ${product.stock} articles.`, 'error');
          return prev;
        }
        const updated = [...prev];
        updated[existingIdx].quantity = newQty;
        showToast(`${quantity} x "${product.name}" ajouté avec succès.`, 'success');
        return updated;
      } else {
        if (quantity > product.stock) {
          showToast(`Stock limité. Vous pouvez ajouter max. ${product.stock} articles.`, 'error');
          return prev;
        }
        showToast(`"${product.name}" ajouté au panier.`, 'success');
        return [...prev, { product, quantity, selectedColor: color }];
      }
    });
  };

  const removeFromCart = (productId: string, color: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedColor === color)));
    showToast('Article retiré du panier.', 'info');
  };

  const updateCartQuantity = (productId: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }

    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId && item.selectedColor === color) {
          if (quantity > item.product.stock) {
            showToast(`Désolé, seulement ${item.product.stock} articles disponibles en stock.`, 'error');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Orders Logic
  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const nextId = 'MV-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...orderData,
      id: nextId,
      status: 'En attente',
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Fast subtract stock
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        const orderItem = orderData.items.find((item) => item.productId === p.id);
        if (orderItem) {
          const refinedStock = Math.max(0, p.stock - orderItem.quantity);
          return { ...p, stock: refinedStock };
        }
        return p;
      });
    });

    showToast(`Commande ${nextId} enregistrée avec succès !`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Le statut de la commande ${orderId} est désormais: ${status}`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Commande ${orderId} effacée du système.`, 'info');
  };

  // Reviews Logic
  const addProductReview = (productId: string, userName: string, userEmail: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: 'rev_' + Date.now().toString(),
      productId,
      userName,
      userEmail,
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    setReviews((prev) => [newReview, ...prev]);

    // Update Average Rating of product
    setProducts((prevProds) => {
      return prevProds.map((p) => {
        if (p.id === productId) {
          const pReviews = [newReview, ...reviews.filter((r) => r.productId === productId)];
          const sum = pReviews.reduce((acc, current) => acc + current.rating, 0);
          const averageReview = Math.round((sum / pReviews.length) * 10) / 10;
          return { ...p, rating: averageReview };
        }
        return p;
      });
    });

    showToast('Votre avis précieux a été publié.', 'success');
  };

  // Login/Register
  const login = (email: string, name: string, isAdmin: boolean) => {
    setCurrentUser({
      id: 'usr_' + Date.now(),
      name,
      email,
      isAdmin,
      createdAt: new Date().toISOString()
    });
    showToast(`Bienvenue de retour, ${name}`, 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Vous êtes déconnecté.', 'info');
    navigateTo('home');
  };

  // Computed Dash Stats
  const [stats, setStats] = useState<BackofficeStats>({
    totalSales: 0,
    totalOrdersCount: 0,
    lowStockCount: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    const paidOrders = orders.filter((o) => o.status !== 'Anulé');
    const totalSalesSum = paidOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const lowStockItems = products.filter((p) => p.stock <= 3).length;

    // Monthly calculations
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthSales = paidOrders.reduce((sum, o) => {
      const oDate = new Date(o.createdAt);
      if (oDate.getMonth() === currentMonth && oDate.getFullYear() === currentYear) {
        return sum + o.totalPrice;
      }
      return sum;
    }, 0);

    setStats({
      totalSales: totalSalesSum,
      totalOrdersCount: orders.length,
      lowStockCount: lowStockItems,
      monthlyRevenue: currentMonthSales || totalSalesSum * 0.4 // default simulation fallback
    });
  }, [orders, products]);

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        reviews,
        addProductReview,
        currentUser,
        setCurrentUser,
        login,
        logout,
        currentTheme,
        setThemeById,
        customRoute,
        navigateTo,
        toasts,
        showToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        sortBy,
        setSortBy,
        stats
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp doit être utilisé à l’intérieur de AppProvider');
  }
  return context;
};
