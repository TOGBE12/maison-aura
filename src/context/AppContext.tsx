import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, Review, User, ThemeType, AppTheme } from '../types';
import { INITIAL_PRODUCTS, AVAILABLE_THEMES } from '../data/products';
import { get, post, put, del, loginUser, registerUser } from '../api/client';
import { mapProducts, mapOrders, mapReviews, mapCategories } from '../api/mappers';

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
  addOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;
  reviews: Review[];
  addProductReview: (productId: string, userName: string, userEmail: string, rating: number, comment: string) => void;
  fetchProductReviews: (productId: string) => Promise<void>;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
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
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  loading: boolean;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('mv_luxury_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('mv_luxury_categories');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('mv_luxury_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mv_luxury_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('mv_luxury_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('mv_luxury_user');
    const savedToken = localStorage.getItem('mv_luxury_token');
    if (saved && savedToken) return JSON.parse(saved);
    return null;
  });

  const [themeId, setThemeId] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('mv_luxury_theme');
    return (saved as ThemeType) || 'aura-luxe';
  });

  const [customRoute, setCustomRoute] = useState<{ page: string; params: Record<string, string> }>(() => {
    return parseHash(window.location.hash);
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1500]);
  const [sortBy, setSortBy] = useState('popularité');

  // Fetch initial data from API
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          get<{ products: any[] }>('/products'),
          get<{ categories: any[] }>('/categories'),
        ]);
        if (productsData.products?.length) {
          const mapped = mapProducts(productsData.products);
          setProducts(mapped);
          localStorage.setItem('mv_luxury_products', JSON.stringify(mapped));
        }
        if (categoriesData.categories?.length) {
          const mapped = mapCategories(categoriesData.categories);
          setCategories(mapped);
          localStorage.setItem('mv_luxury_categories', JSON.stringify(mapped));
        }
      } catch {
        // Silently fall back to localStorage/seed data
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  // Fetch orders if user is logged in
  useEffect(() => {
    if (!currentUser) return;
    const token = localStorage.getItem('mv_luxury_token');
    if (!token) return;

    async function fetchOrders() {
      try {
        const data = await get<{ orders: any[] }>('/orders');
        if (data.orders?.length) {
          const mapped = mapOrders(data.orders);
          setOrders(mapped);
          localStorage.setItem('mv_luxury_orders', JSON.stringify(mapped));
        }
      } catch {
        // Fall back to localStorage
      }
    }
    fetchOrders();
  }, [currentUser]);

  // Persist products to localStorage
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
      localStorage.removeItem('mv_luxury_token');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mv_luxury_theme', themeId);
  }, [themeId]);

  useEffect(() => {
    localStorage.setItem('mv_luxury_categories', JSON.stringify(categories));
  }, [categories]);

  const currentTheme = AVAILABLE_THEMES.find(t => t.id === themeId) || AVAILABLE_THEMES[0];

  const setThemeById = (id: ThemeType) => {
    setThemeId(id);
    showToast(`Thème changé : ${AVAILABLE_THEMES.find(t => t.id === id)?.name}`, 'info');
  };

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

  useEffect(() => {
    const handleHashChange = () => {
      setCustomRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string, params?: Record<string, string>) => {
    let query = '';
    if (params && Object.keys(params).length > 0) {
      query = '?' + Object.entries(params)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&');
    }
    window.location.hash = `${page}${query}`;
  };

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

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    const token = localStorage.getItem('mv_luxury_token');

    try {
      if (token) {
        const payload = {
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
          customer_phone: orderData.customerPhone,
          address: orderData.address,
          city: orderData.city,
          postal_code: orderData.postalCode,
          subtotal: orderData.totalPrice,
          tax_amount: Math.round(orderData.totalPrice * 0.05 * 100) / 100,
          shipping_cost: orderData.totalPrice >= 300 ? 0 : 25,
          discount_amount: 0,
          total_price: orderData.totalPrice,
          payment_method: orderData.paymentMethod,
          items: orderData.items.map(item => ({
            product_id: parseInt(item.productId) || item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            color: item.color,
            image: item.image,
          })),
        };
        const response = await post<{ order: any; message?: string }>('/orders', payload);
        if (response.order) {
          const mapped = mapOrders([response.order]);
          const newOrder = mapped[0];
          setOrders((prev) => [newOrder, ...prev]);
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
          showToast(`Commande ${newOrder.id} enregistrée avec succès !`, 'success');
          return newOrder;
        }
      }
    } catch {
      // Fall back to local order creation
    }

    const nextId = 'MV-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...orderData,
      id: nextId,
      status: 'En attente',
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);
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

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const token = localStorage.getItem('mv_luxury_token');

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );

    if (token) {
      try {
        await put(`/orders/${encodeURIComponent(orderId)}`, { status });
      } catch {
        // Revert on error would be complex; just show toast
      }
    }

    showToast(`Le statut de la commande ${orderId} est désormais: ${status}`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Commande ${orderId} effacée du système.`, 'info');
  };

  const fetchProductReviews = async (productId: string) => {
    try {
      const apiId = parseInt(productId);
      if (!isNaN(apiId)) {
        const data = await get<{ reviews: any[] }>(`/products/${apiId}/reviews`);
        if (data.reviews?.length) {
          const mapped = mapReviews(data.reviews);
          setReviews((prev) => {
            const filtered = prev.filter(r => r.productId !== productId);
            return [...filtered, ...mapped];
          });
        }
      }
    } catch {
      // Keep existing reviews
    }
  };

  const addProductReview = async (productId: string, userName: string, userEmail: string, rating: number, comment: string) => {
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await loginUser(email, password);
      localStorage.setItem('mv_luxury_token', response.token);
      setCurrentUser({
        id: String(response.user.id),
        name: response.user.name,
        email: response.user.email,
        isAdmin: response.user.is_admin,
        createdAt: response.user.created_at,
      });
      showToast(`Bienvenue de retour, ${response.user.name}`, 'success');
      return true;
    } catch (err: unknown) {
      const apiMsg = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Email ou mot de passe incorrect.';
      showToast(apiMsg, 'error');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await registerUser(name, email, password);
      localStorage.setItem('mv_luxury_token', response.token);
      setCurrentUser({
        id: String(response.user.id),
        name: response.user.name,
        email: response.user.email,
        isAdmin: response.user.is_admin,
        createdAt: response.user.created_at,
      });
      showToast(`Bienvenue, ${response.user.name} !`, 'success');
      return true;
    } catch (err: unknown) {
      const apiMsg = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : 'Erreur lors de l\'inscription.';
      showToast(apiMsg, 'error');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mv_luxury_token');
    showToast('Vous êtes déconnecté.', 'info');
    navigateTo('home');
  };

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
      monthlyRevenue: currentMonthSales || totalSalesSum * 0.4
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
        fetchProductReviews,
        currentUser,
        setCurrentUser,
        login,
        register,
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
        stats,
        categories,
        setCategories,
        loading,
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
