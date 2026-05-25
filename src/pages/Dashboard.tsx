import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order } from '../types';
import {
  Briefcase,
  Layers,
  ShoppingBag,
  Bell,
  Trash2,
  Edit2,
  Plus,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Truck,
  X,
  Settings,
  Grid,
  MapPin,
  Calendar,
  Eye,
  RefreshCw,
  LogOut,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Unsplash high quality bag image presets for the admin product creator modal
const LUXURY_BAG_IMAGE_PRESETS = [
  'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop'
];

export const Dashboard: React.FC = () => {
  const {
    products,
    setProducts,
    orders,
    updateOrderStatus,
    deleteOrder,
    currentUser,
    logout,
    currentTheme,
    setThemeById,
    showToast,
    stats
  } = useApp();

  // Internal routing states
  const [activeSubView, setActiveSubView] = useState<'overview' | 'products' | 'stock' | 'orders' | 'revenue' | 'settings'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal managing states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for creating/editing product
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('Sacs de luxe');
  const [prodPrice, setProdPrice] = useState(250);
  const [prodOldPrice, setProdOldPrice] = useState<number | ''>('');
  const [prodStock, setProdStock] = useState(5);
  const [prodDesc, setProdDesc] = useState('');
  const [prodColors, setProdColors] = useState<string[]>(['#141414', '#e2ceb8']);
  const [prodImageChosen, setProdImageChosen] = useState(LUXURY_BAG_IMAGE_PRESETS[0]);
  const [prodCustomImageUrl, setProdCustomImageUrl] = useState('');
  const [prodCustomSku, setProdCustomSku] = useState('M-MV-99201');

  // Multi-input helpers for presets colors click
  const presetColorsList = [
    { name: 'Noir Satin', hex: '#141414' },
    { name: 'Sable Nude', hex: '#e2ceb8' },
    { name: 'Or Fin', hex: '#D0A352' },
    { name: 'Cognac', hex: '#8c6239' },
    { name: 'Carmin', hex: '#b83b3b' },
    { name: 'Émeraude', hex: '#1B473A' },
    { name: 'Bleu Minuit', hex: '#1f3a52' }
  ];

  const handleColorToggle = (hexCode: string) => {
    if (prodColors.includes(hexCode)) {
      if (prodColors.length <= 1) {
        showToast('Veuillez conserver au moins une couleur pour l’article.', 'info');
        return;
      }
      setProdColors(prodColors.filter(c => c !== hexCode));
    } else {
      setProdColors([...prodColors, hexCode]);
    }
  };

  // Open modal either for creation or editing
  const handleOpenProductModal = (productToEdit?: Product) => {
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setProdName(productToEdit.name);
      setProdCategory(productToEdit.category);
      setProdPrice(productToEdit.price);
      setProdOldPrice(productToEdit.oldPrice || '');
      setProdStock(productToEdit.stock);
      setProdDesc(productToEdit.description);
      setProdColors(productToEdit.colors);
      setProdImageChosen(productToEdit.images[0] || LUXURY_BAG_IMAGE_PRESETS[0]);
      setProdCustomImageUrl('');
      setProdCustomSku(productToEdit.specifications['Ref'] || 'M-MV-' + Math.floor(10000 + Math.random() * 90000));
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdCategory('Sacs de luxe');
      setProdPrice(290);
      setProdOldPrice('');
      setProdStock(10);
      setProdDesc('Une nouvelle création de maroquinerie issue de l’Atelier MV LUXURY.');
      setProdColors(['#141414', '#e2ceb8']);
      setProdImageChosen(LUXURY_BAG_IMAGE_PRESETS[Math.floor(Math.random() * LUXURY_BAG_IMAGE_PRESETS.length)]);
      setProdCustomImageUrl('');
      setProdCustomSku('M-MV-' + Math.floor(10000 + Math.random() * 90000));
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodDesc) return;

    if (editingProduct) {
      // Modify active product inside products list
      setProducts(prev =>
        prev.map(p =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: prodName,
                category: prodCategory,
                price: prodPrice,
                oldPrice: prodOldPrice ? Number(prodOldPrice) : undefined,
                stock: prodStock,
                description: prodDesc,
                images: [prodImageChosen, ...p.images.slice(1)],
                colors: prodColors,
                specifications: {
                  ...p.specifications,
                  'Ref': prodCustomSku,
                  'Mise à jour': 'Mai 2026'
                }
              }
            : p
        )
      );
      showToast(`Le sac "${prodName}" a été actualisé dans le catalogue.`, 'success');
    } else {
      // Create and inject a brand-new luxury model
      const nextId = 'bag_' + Date.now();
      const newBag: Product = {
        id: nextId,
        name: prodName,
        category: prodCategory,
        description: prodDesc,
        price: prodPrice,
        oldPrice: prodOldPrice ? Number(prodOldPrice) : undefined,
        rating: 5.0,
        images: [prodImageChosen, LUXURY_BAG_IMAGE_PRESETS[1]],
        stock: prodStock,
        isNew: true,
        colors: prodColors,
        colorNames: prodColors.map(c => presetColorsList.find(pc => pc.hex === c)?.name || 'Opacité Satin'),
        features: [
          'Cuir de vachette rigide sélectionné',
          'Intérieur logoté toucher velours',
          'Série numérotée poinçonnée'
        ],
        specifications: {
          'Ref': prodCustomSku,
          'Dimensions': '25 x 18 x 10 cm',
          'Poids': '490g',
          'Fermoir': 'Aimanté doré'
        }
      };

      setProducts(prev => [newBag, ...prev]);
      showToast(`Le chef-d'œuvre "${prodName}" rejoint la collection !`, 'success');
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (productId: string, name: string) => {
    if (window.confirm(`Voulez-vous vraiment retirer definitivement le sac "${name}" du catalogue de la boutique ?`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast(`Le modèle "${name}" a été définitivement retiré.`, 'info');
    }
  };

  // Quick adjust stock levels directement dans le tableau Stock
  const handleQuickStockAdjust = (productId: string, amount: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const updatedStock = Math.max(0, p.stock + amount);
          showToast(`Stock de "${p.name}" mis à jour : ${updatedStock} articles.`, 'info');
          return { ...p, stock: updatedStock };
        }
        return p;
      })
    );
  };

  // Helper values for revenue breakdowns
  const ordersCompleted = useMemo(() => orders.filter(o => o.status !== 'Anulé'), [orders]);
  const averageBasketValue = useMemo(() => {
    if (ordersCompleted.length === 0) return 0;
    const sum = ordersCompleted.reduce((acc, current) => acc + current.totalPrice, 0);
    return Math.round(sum / ordersCompleted.length);
  }, [ordersCompleted]);

  return (
    <div className="min-h-screen bg-neutral-100/50 flex flex-col md:flex-row" id="admin-dashboard-root-layout">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside
        className={`hidden md:flex flex-col bg-[#141414] text-white shrink-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } border-r border-neutral-900 select-none p-5`}
      >
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          {!isSidebarCollapsed && (
            <div className="overflow-hidden">
              <span className="font-serif text-lg tracking-[0.2em] font-light">MV LUXURY</span>
              <p className="text-[8px] uppercase tracking-widest text-[#BF986B] font-mono mt-0.5 font-bold">MODE ADMINISTRATEUR</p>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 px-1.5 rounded bg-neutral-800 text-neutral-300 hover:text-white mx-auto"
            title="Ajuste la largeur"
            id="sidebar-collapse-btn"
          >
            {isSidebarCollapsed ? '›' : '‹'}
          </button>
        </div>

        {/* Navigation items list */}
        <nav className="flex flex-col gap-2 mt-8 flex-1 font-sans">
          
          <button
            onClick={() => {
              setActiveSubView('overview');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              activeSubView === 'overview'
                ? 'bg-[#BF986B] text-white'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
            id="sidemenu-overview"
          >
            <Grid size={16} />
            {!isSidebarCollapsed && <span>Synthèse</span>}
          </button>
          
          <button
            onClick={() => {
              setActiveSubView('products');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              activeSubView === 'products'
                ? 'bg-[#BF986B] text-white'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
            id="sidemenu-products"
          >
            <Layers size={16} />
            {!isSidebarCollapsed && <span>Catégorie</span>}
          </button>
          
          <button
            onClick={() => {
              setActiveSubView('stock');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider relative ${
              activeSubView === 'stock'
                ? 'bg-[#BF986B] text-white'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
            id="sidemenu-stock"
          >
            <AlertTriangle size={16} />
            {!isSidebarCollapsed && <span>Stocks & Alertes</span>}
            {stats.lowStockCount > 0 && !isSidebarCollapsed && (
              <span className="absolute right-3 top-3.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono">
                {stats.lowStockCount}
              </span>
            )}
          </button>
          
          <button
            onClick={() => {
              setActiveSubView('orders');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider relative ${
              activeSubView === 'orders'
                ? 'bg-[#BF986B] text-white'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
            id="sidemenu-orders"
          >
            <ShoppingBag size={16} />
            {!isSidebarCollapsed && <span>Expéditions</span>}
            {orders.filter(o => o.status === 'En attente').length > 0 && !isSidebarCollapsed && (
              <span className="absolute right-3 top-3.5 bg-[#BF986B] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold font-mono">
                {orders.filter(o => o.status === 'En attente').length}
              </span>
            )}
          </button>
          
          <button
            onClick={() => {
              setActiveSubView('revenue');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              activeSubView === 'revenue'
                ? 'bg-[#BF986B] text-white'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
            id="sidemenu-revenue"
          >
            <TrendingUp size={16} />
            {!isSidebarCollapsed && <span>Caisse</span>}
          </button>
          
          <button
            onClick={() => {
              setActiveSubView('settings');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              activeSubView === 'settings'
                ? 'bg-[#BF986B] text-white'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
            id="sidemenu-settings"
          >
            <Settings size={16} />
            {!isSidebarCollapsed && <span>Configurations</span>}
          </button>

        </nav>

        {/* Lower footer profile */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col gap-3 font-sans">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#BF986B]/20 flex items-center justify-center text-[#BF986B] font-mono text-xs font-bold shrink-0">
                M
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate text-neutral-200">Marilyn Aura</p>
                <p className="text-[10px] text-neutral-500 truncate mt-0.5">Propriétaire</p>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full py-2 border border-neutral-800 hover:border-red-500/30 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut size={12} />
            {!isSidebarCollapsed && <span>Sortir</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE FLOATING TAB HEADER */}
      <div className="md:hidden bg-[#141414] text-white px-4 py-3 flex items-center justify-between z-30 shadow-md">
        <span className="font-serif text-lg tracking-widest font-light">MV LUXURY</span>
        
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 px-1.5 bg-neutral-800 rounded text-neutral-300 text-xs font-bold uppercase"
        >
          {mobileMenuOpen ? 'Fermer ×' : 'Sections ☰'}
        </button>
      </div>

      {/* MOBILE COLLAPSIBLE DRAWER SELECTOR */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-neutral-900 text-white flex flex-col border-b border-neutral-800"
          >
            {['overview', 'products', 'stock', 'orders', 'revenue', 'settings'].map((view) => {
              const labels: Record<string, string> = {
                overview: 'Synthèse',
                products: 'Catalogue Catégorie',
                stock: 'Gestion des Stocks',
                orders: 'Bordereaux Expéditions',
                revenue: 'Caisse',
                settings: 'Configurations boutique'
              };
              return (
                <button
                  key={view}
                  onClick={() => {
                    setActiveSubView(view as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-4 text-xs font-bold text-left uppercase tracking-wider border-b border-neutral-800/50 ${
                    activeSubView === view ? 'text-[#BF986B] bg-neutral-800' : 'text-neutral-400'
                  }`}
                >
                  {labels[view]}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CORE BACKOFFICE VIEWS PANEL */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full transition-all">
        
        {/* VIEW A: OVERVIEW / SYNTHESE */}
        {activeSubView === 'overview' && (
          <div className="flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out]" id="dashboard-view-overview">
            
            {/* Header toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-light text-neutral-800 uppercase tracking-wide">
                  Synthèse d’Atelier Boutique
                </h1>
                <p className="text-xs text-neutral-400 font-mono tracking-widest mt-1">
                  Revue des indicateurs clés et activités de la semaine en temps réel.
                </p>
              </div>

              {/* Status active banner */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#BF986B]/10 text-[#BF986B] border border-[#BF986B]/30 rounded-full text-[10px] uppercase tracking-widest font-mono font-bold w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#BF986B] animate-ping" />
                Atelier En Ligne
              </div>
            </div>

            {/* Simulated Bento Key KPI Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              
              {/* Card 1: Revenue Total */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-150 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#BF986B]/5 rounded-full blur-xl" />
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-[10px] tracking-widest font-mono uppercase font-bold">Chiffre d'Affaire</span>
                  <TrendingUp size={16} className="text-[#BF986B]" />
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-mono font-black text-neutral-900">{stats.totalSales} DZD</h3>
                  <p className="text-[9px] text-emerald-600 font-mono font-semibold mt-1">✓ +14.5% cette semaine</p>
                </div>
              </div>

              {/* Card 2: Revenue Monthly */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-150 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/20 rounded-full blur-xl" />
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-[10px] tracking-widest font-mono uppercase font-bold">Caisse Mensuelle</span>
                  <CreditCard size={16} className="text-blue-500" />
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-mono font-black text-neutral-900">{stats.monthlyRevenue} DZD</h3>
                  <p className="text-[9px] text-neutral-400 font-sans mt-1">Objectif fixé : 5,000 DZD</p>
                </div>
              </div>

              {/* Card 3: Total Orders received */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-150 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/30 rounded-full blur-xl" />
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-[10px] tracking-widest font-mono uppercase font-bold">Commandes</span>
                  <ShoppingBag size={16} className="text-emerald-500" />
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-mono font-black text-neutral-900">{stats.totalOrdersCount}</h3>
                  <p className="text-[9px] text-emerald-600 font-mono font-semibold mt-1">✓ 100% traitées</p>
                </div>
              </div>

              {/* Card 4: Low Stock alerts count */}
              <div className="bg-white p-5 rounded-2xl border border-neutral-150 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/20 rounded-full blur-xl" />
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-[10px] tracking-widest font-mono uppercase font-bold">Ruptures / Critiques</span>
                  <AlertTriangle size={16} className={stats.lowStockCount > 0 ? 'text-red-500 animate-pulse' : 'text-neutral-300'} />
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-mono font-black text-neutral-900">{stats.lowStockCount}</h3>
                  <p className={`text-[9px] font-semibold mt-1 ${stats.lowStockCount > 0 ? 'text-red-500 font-mono' : 'text-neutral-400 font-sans'}`}>
                    {stats.lowStockCount > 0 ? '⚠️ Alerte approvisionnement' : 'Toutes les étagères sont pleines'}
                  </p>
                </div>
              </div>

            </div>

            {/* Interactive Analytical SVG line charts drawing revenues */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-150 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4 mb-6">
                <div>
                  <h3 className="font-serif text-base uppercase text-neutral-800 tracking-wide font-semibold">
                    Évolution hebdomadaire des recettes d'art
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider mt-0.5">
                    Simulation basée sur les 5 dernières ventes concrétisées
                  </p>
                </div>

                {/* Legend indicator */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-[#BF986B] rounded-full inline-block" />
                    <span>Caisse</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-neutral-300 rounded-full inline-block" />
                    <span>Projection</span>
                  </div>
                </div>
              </div>

              {/* Native animated SVG charts, gorgeous, fully responsive */}
              <div className="w-full h-64 relative bg-neutral-50/40 rounded-2xl p-4 overflow-hidden select-none">
                
                {/* Horizontal grid guide lines */}
                <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-neutral-200" />
                <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-neutral-200" />
                <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-neutral-200" />

                {/* SVG drawings */}
                <svg viewBox="0 0 500 200" className="w-full h-full" preserveAspectRatio="none">
                  {/* Fill Gradient Area under line */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#BF986B" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#BF986B" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient Area Polygon path */}
                  <polygon
                    points="50,150 150,110 250,130 350,70 450,40 450,190 50,190"
                    fill="url(#chartGradient)"
                  />

                  {/* Projected target lines */}
                  <line
                    x1="50" y1="150" x2="450" y2="150"
                    stroke="#e5e5e5"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Main line graph drawing */}
                  <polyline
                    fill="none"
                    stroke="#BF986B"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="50,150 150,110 250,130 350,70 450,40"
                    className="stroke-dash"
                  />

                  {/* Data Point Circles */}
                  <circle cx="50" cy="150" r="5" fill="#141414" stroke="#BF986B" strokeWidth="2" />
                  <circle cx="150" cy="110" r="5" fill="#141414" stroke="#BF986B" strokeWidth="2" />
                  <circle cx="250" cy="130" r="5" fill="#141414" stroke="#BF986B" strokeWidth="2" />
                  <circle cx="350" cy="70" r="5" fill="#141414" stroke="#BF986B" strokeWidth="2" />
                  <circle cx="450" cy="40" r="5" fill="#141414" stroke="#BF986B" strokeWidth="2" />
                </svg>

                {/* X Axis label overlay block */}
                <div className="absolute bottom-1 inset-x-6 flex justify-between text-[9px] font-mono tracking-wider text-neutral-400 uppercase pt-2">
                  <span>Lu 13 Mai</span>
                  <span>Ma 14 Mai</span>
                  <span>Je 16 Mai</span>
                  <span>Di 18 Mai</span>
                  <span>Ma 19 Mai (Aujourd'hui)</span>
                </div>
              </div>
            </div>

            {/* List of Recent Order activities */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-150 shadow-sm flex flex-col gap-4">
              <h3 className="font-serif text-base uppercase text-neutral-800 tracking-wide font-semibold">
                Activité des Expéditions Récentes
              </h3>

              <div className="flex flex-col gap-3">
                {orders.slice(0, 3).map((ord) => {
                  let badgeColor = 'bg-neutral-100 text-neutral-600';
                  if (ord.status === 'Livré') badgeColor = 'bg-emerald-100 text-emerald-700';
                  if (ord.status === 'Expédié') badgeColor = 'bg-blue-100 text-blue-700';
                  if (ord.status === 'En attente') badgeColor = 'bg-amber-100 text-amber-700 animate-pulse';

                  return (
                    <div key={ord.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-neutral-50/50 rounded-xl border border-neutral-100/55 text-xs">
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-neutral-100 border text-neutral-500 shrink-0 font-mono font-bold">
                          #
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-neutral-800 font-mono">{ord.id}</p>
                          <p className="text-[10px] text-neutral-500 font-sans mt-0.5">{ord.customerName} • {ord.city}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="font-mono font-bold text-neutral-700 shrink-0">
                          {ord.totalPrice} DZD
                        </span>
                        <span className={`px-2.5 py-1 text-[9px] uppercase tracking-widest font-mono font-bold rounded-full ${badgeColor}`}>
                          {ord.status}
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* VIEW B: PRODUCTS / GESTION PRODUITS */}
        {activeSubView === 'products' && (
          <div className="flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out]" id="dashboard-view-products">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl md:text-3xl font-light text-neutral-800 uppercase tracking-wide">
                  Catalogue Catégorie
                </h1>
                <p className="text-xs text-neutral-400 font-mono tracking-widest mt-1">
                  Créez, éditez ou retirez des sacs haut de gamme de la boutique en ligne.
                </p>
              </div>

              {/* Add product button trigger */}
              <button
                onClick={() => handleOpenProductModal()}
                className="px-6 py-3 bg-[#BF986B] text-white hover:bg-[#A88056] text-xs font-mono font-bold tracking-widest uppercase rounded-full flex items-center gap-2 transition-all shadow-md cursor-pointer"
                id="add-product-table-trigger"
              >
                <Plus size={14} />
                Nouveau Modèle
              </button>
            </div>

            {/* Catalog list in high-end administrative row-cards */}
            <div className="flex flex-col gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-white p-5 rounded-2xl border border-neutral-150 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden"
                  id={`admin-product-row-${p.id}`}
                >
                  {/* Left: Product Picture detail */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-14 h-16 rounded-xl overflow-hidden bg-neutral-50 shrink-0 border border-neutral-100">
                      <img src={p.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    <div className="min-w-0 flex flex-col gap-0.5">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-[#BF986B]">
                        {p.category}
                      </span>
                      <h4 className="font-serif text-[15px] font-bold text-neutral-800 truncate uppercase">
                        {p.name}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-mono">
                        Ref: {p.specifications['Ref'] || 'M-AURA'} • Stock: <span className={`font-bold ${p.stock <= 3 ? 'text-red-500' : 'text-neutral-700'}`}>{p.stock} pcs</span>
                      </p>
                    </div>
                  </div>

                  {/* Middle: Colors palette indicators */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {p.colors.map((c, idx) => (
                      <div
                        key={c + idx}
                        className="w-3.5 h-3.5 rounded-full border border-neutral-200"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>

                  {/* Right: Price list + Admin Action controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    
                    <div className="text-right font-mono text-sm uppercase">
                      <p className="font-bold text-neutral-800">{p.price} DZD</p>
                      {p.oldPrice && <p className="text-[10px] text-neutral-400 line-through">{p.oldPrice} DZD</p>}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenProductModal(p)}
                        className="p-2.5 bg-neutral-50 hover:bg-[#BF986B]/10 hover:text-[#BF986B] text-neutral-500 rounded-lg transition-colors border"
                        title="Éditer l'article"
                        id={`edit-item-${p.id}`}
                      >
                        <Edit2 size={13} />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-2.5 bg-neutral-50 hover:bg-red-50 hover:text-red-500 text-neutral-400 rounded-lg transition-colors border"
                        title="Supprimer l'article"
                        id={`delete-item-${p.id}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* VIEW C: STOCK / GESTION STOCKS */}
        {activeSubView === 'stock' && (
          <div className="flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out]" id="dashboard-view-stock">
            
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-light text-neutral-800 uppercase tracking-wide">
                Indicateurs de Stock d’Atelier
              </h1>
              <p className="text-xs text-neutral-400 font-mono tracking-widest mt-1">
                Ajustez rapidement les quantités pour anticiper les demandes d'achat des initiés.
              </p>
            </div>

            {/* Quick stock adjust matrix table details */}
            <div className="bg-white rounded-3xl border border-neutral-150 shadow-sm overflow-hidden">
              <table className="w-full text-xs text-left text-neutral-600 border-collapse font-sans">
                <thead>
                  <tr className="bg-neutral-50 border-b text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    <th className="px-6 py-4">Nom du Sac</th>
                    <th className="px-6 py-4">Catégorie</th>
                    <th className="px-6 py-4 text-center">Statut Appro</th>
                    <th className="px-6 py-4 text-center">Quantité</th>
                    <th className="px-6 py-4 text-center">Ajustements Express</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const isCritLow = p.stock <= 3;
                    const isOut = p.stock === 0;

                    return (
                      <tr key={p.id} className="border-b hover:bg-neutral-50/50">
                        <td className="px-6 py-4 font-serif font-semibold text-neutral-800 uppercase text-[13px] border-r">
                          {p.name}
                        </td>
                        
                        <td className="px-6 py-4 border-r">
                          {p.category}
                        </td>

                        <td className="px-6 py-4 text-center border-r">
                          {isOut ? (
                            <span className="px-2.5 py-1 bg-neutral-100 text-neutral-500 rounded-full font-mono text-[9px] uppercase font-bold">Rupture</span>
                          ) : isCritLow ? (
                            <span className="px-2.5 py-1 bg-red-100 text-red-500 rounded-full font-mono text-[9px] uppercase font-bold animate-pulse">Critique ({p.stock})</span>
                          ) : (
                            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-mono text-[9px] uppercase font-bold">Optimal</span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-center font-mono font-bold text-sm border-r">
                          {p.stock}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleQuickStockAdjust(p.id, -1)}
                              disabled={p.stock <= 0}
                              className="px-2.5 py-1 text-xs border rounded-lg bg-neutral-50 hover:bg-neutral-100 disabled:opacity-40"
                              id={`quick-sub-${p.id}`}
                            >
                              -1
                            </button>
                            <button
                              onClick={() => handleQuickStockAdjust(p.id, 5)}
                              className="px-2.5 py-1 text-xs border rounded-lg bg-white text-[#BF986B] border-[#BF986B]/40 hover:bg-[#BF986B]/10"
                              id={`quick-add-5-${p.id}`}
                            >
                              +5 Re-stock
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* VIEW D: ORDERS / GESTION COMMANDES */}
        {activeSubView === 'orders' && (
          <div className="flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out]" id="dashboard-view-orders">
            
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-light text-neutral-800 uppercase tracking-wide">
                Bordereaux d’Expéditions & Statuts
              </h1>
              <p className="text-xs text-neutral-400 font-mono tracking-widest mt-1">
                Gérez les d'expéditions, retracez les historiques et basculez les statuts au transporteur.
              </p>
            </div>

            {/* List of Orders with interactive dispatcher selectors */}
            <div className="flex flex-col gap-6">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-6 rounded-2xl border border-neutral-150 shadow-sm flex flex-col gap-4 relative overflow-hidden"
                  id={`admin-order-card-${ord.id}`}
                >
                  
                  {/* Card top banner metadata */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3 text-xs">
                    
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-black text-neutral-800">{ord.id}</span>
                      <span className="text-neutral-300">|</span>
                      <span className="text-neutral-400">
                        {new Date(ord.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Deliver status combobox dispatcher */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-neutral-400">Statut Traitement:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                        className="px-3 py-1.5 border border-neutral-200 rounded-xl bg-white text-xs outline-none focus:border-neutral-900 font-bold"
                        id={`order-status-select-${ord.id}`}
                      >
                        <option value="En attente">En Attente de l'Atelier</option>
                        <option value="Confirmé">Emballage Confirmé</option>
                        <option value="Expédié">Remis au Transporteur</option>
                        <option value="Livré">Remis en Main Propre</option>
                        <option value="Anulé">Annulé / Retourné</option>
                      </select>
                    </div>

                  </div>

                  {/* Card mid: items purchased */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-xs text-neutral-600">
                    
                    {/* Customer Delivery info */}
                    <div className="flex flex-col gap-1.5">
                      <h4 className="font-semibold text-neutral-800 uppercase font-mono tracking-wide text-[10px]">Coordonnées Privées</h4>
                      <p className="text-neutral-800 font-bold">{ord.customerName}</p>
                      <p className="text-neutral-500">{ord.customerEmail}</p>
                      <p className="text-neutral-500">{ord.customerPhone}</p>
                      <p className="text-neutral-400 italic">{ord.address}, {ord.postalCode} {ord.city}</p>
                    </div>

                    {/* Bought Articles List */}
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <h4 className="font-semibold text-neutral-800 uppercase font-mono tracking-wide text-[10px]">Panier d'Art</h4>
                      <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex gap-2.5 items-center justify-between bg-neutral-50 p-2 rounded-lg border">
                            <div className="flex gap-2 items-center min-w-0">
                              <div className="w-8 h-10 bg-neutral-100 rounded overflow-hidden shrink-0">
                                <img src={it.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <span className="font-serif font-medium uppercase truncate text-neutral-850">{it.name}</span>
                            </div>
                            <span className="font-mono font-bold shrink-0">
                              Qty: {it.quantity} x {it.price} DZD (<span className="inline-block w-2.5 h-2.5 rounded-full align-middle border" style={{ backgroundColor: it.color }} />)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Card footer: Financial summary values */}
                  <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-xs">
                    <span className="text-[#BF986B] font-mono uppercase font-bold">
                      Méthode: {ord.paymentMethod === 'card' ? 'Visa/Mastercard' : ord.paymentMethod === 'paypal' ? 'Paypal Secure' : 'Contre remboursement'}
                    </span>
                    <span className="font-mono font-bold text-sm text-neutral-850">
                      Montant Versé : <span className="text-lg font-black text-neutral-900">{ord.totalPrice} DZD</span>
                    </span>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* VIEW E: REVENUE / SOLDE ET RAPPORTS */}
        {activeSubView === 'revenue' && (
          <div className="flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out]" id="dashboard-view-revenue">
            
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-light text-neutral-800 uppercase tracking-wide">
                Solde & Chiffre d’Affaires
              </h1>
              <p className="text-xs text-neutral-400 font-mono tracking-widest mt-1">
                Analyse de rentabilité de la boutique MV LUXURY et suivi des performances de vente.
              </p>
            </div>

            {/* Simulated Animated Financial Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-6 rounded-3xl border border-neutral-150 shadow-sm flex flex-col gap-4">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Encaissements Totaux</span>
                <span className="text-3xl font-mono font-black text-neutral-900">{stats.totalSales} DZD</span>
                <div className="pt-3 border-t border-neutral-100 flex justify-between text-neutral-500 text-xs">
                  <span>Panier Moyen par client :</span>
                  <span className="font-bold text-neutral-700 font-mono">{averageBasketValue} DZD</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-neutral-150 shadow-sm flex flex-col gap-4">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Dettes & Taxes Prélevées</span>
                <span className="text-3xl font-mono font-black text-neutral-900">{Math.round(stats.totalSales * 0.05)} DZD</span>
                <div className="pt-3 border-t border-neutral-100 flex justify-between text-neutral-500 text-xs">
                  <span>Impôt d'art (5%) :</span>
                  <span className="font-bold text-neutral-700 font-mono">Collecté d'office</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-neutral-150 shadow-sm flex flex-col gap-4">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold">Marge nette estimée</span>
                <span className="text-3xl font-mono font-black text-neutral-900">{Math.round(stats.totalSales * 0.85)} DZD</span>
                <div className="pt-3 border-t border-neutral-100 flex justify-between text-neutral-500 text-xs">
                  <span>Efficacité Opérationnelle :</span>
                  <span className="font-semibold text-emerald-600 font-mono">85% Margé</span>
                </div>
              </div>

            </div>

            {/* Receipts detail table simulation */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-150 shadow-sm flex flex-col gap-4">
              <h3 className="font-serif text-base uppercase text-neutral-800 tracking-wide font-semibold">
                Journal Comptable des Mouvements
              </h3>

              <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-xs text-left text-neutral-600 border-collapse font-sans">
                  <thead className="bg-[#141414] text-white font-mono text-[9px] uppercase tracking-widest text-[#BF986B]">
                    <tr>
                      <th className="px-6 py-3">Réf Mouvement</th>
                      <th className="px-6 py-3">Acheteur</th>
                      <th className="px-6 py-3 text-center">Moyen</th>
                      <th className="px-6 py-3 text-right">Versement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersCompleted.map((ord) => (
                      <tr key={ord.id} className="border-b hover:bg-neutral-50/50">
                        <td className="px-6 py-4 font-mono font-bold text-neutral-800">{ord.id}</td>
                        <td className="px-6 py-4">{ord.customerName}</td>
                        <td className="px-6 py-4 text-center font-mono text-neutral-400 uppercase">{ord.paymentMethod}</td>
                        <td className="px-6 py-4 text-right font-mono font-bold text-neutral-900">{ord.totalPrice} DZD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* VIEW F: CONFIGURATIONS / SETTINGS */}
        {activeSubView === 'settings' && (
          <div className="flex flex-col gap-8 animate-[fadeIn_0.5s_ease-out]" id="dashboard-view-settings">
            
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-light text-neutral-800 uppercase tracking-wide">
                Configurations de la Boutique
              </h1>
              <p className="text-xs text-neutral-400 font-mono tracking-widest mt-1">
                Ajustez les paramètres système, le thème de couleur par défaut de l'interface et vos coordonnées.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Box 1: Profile configurations */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-150 shadow-sm flex flex-col gap-4">
                <h3 className="font-serif text-base uppercase text-neutral-800">Coordonnées Vendeuse</h3>
                
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1.5 text-xs">
                    <span className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">Nom d'enseigne</span>
                    <input
                      type="text"
                      defaultValue="MV LUXURY (Vendeuse)"
                      className="bg-neutral-50 px-3 py-2 border rounded-lg focus:outline"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs">
                    <span className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">Adresse email d'expédition de facture</span>
                    <input
                      type="email"
                      defaultValue="marilyn.aura@maisonaura.com"
                      className="bg-neutral-50 px-3 py-2 border rounded-lg focus:outline"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast('Changements de configuration enregistrés de manière durable.', 'success')}
                    className="mt-2 py-3 bg-neutral-900 hover:bg-[#BF986B] text-white text-[10px] uppercase font-mono tracking-widest font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Mettre à jour les informations
                  </button>
                </div>
              </div>

              {/* Box 2: Visual options configs */}
              <div className="bg-white p-6 rounded-3xl border border-neutral-150 shadow-sm flex flex-col gap-4">
                <h3 className="font-serif text-base uppercase text-neutral-800">Thème de l’Atelier</h3>
                
                <div className="flex flex-col gap-4 mt-2">
                  <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                    Basculez facilement la coloration de votre site. Les clients hériteront de la thématique sélectionnée ci-dessous en temps réel.
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {['aura-luxe', 'classic-noir', 'nude-silk', 'emerald-royal'].map((tID) => {
                      const names: Record<string, string> = {
                        'aura-luxe': 'Or & Beige',
                        'classic-noir': 'Noir Ébène',
                        'nude-silk': 'Nude & Soie',
                        'emerald-royal': 'Émeraude Impériale'
                      };
                      return (
                        <button
                          key={tID}
                          onClick={() => setThemeById(tID as any)}
                          className={`px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all border shrink-0 ${
                            currentTheme.id === tID
                              ? 'bg-neutral-900 border-neutral-950 text-[#BF986B]'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-900'
                          }`}
                        >
                          {names[tID]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* 3. PRODUCT CREATION/EDITING MODAL DRAWER OVERLAY */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark frame backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />

            {/* Dialog Panel modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-white max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl p-6 md:p-8 border shadow-2xl z-10"
              id="admin-product-modal-dialog"
            >
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
                <div>
                  <span className="text-[10px] tracking-[0.2em] font-mono text-[#BF986B] uppercase font-bold">MODE CONCEPTION</span>
                  <h3 className="font-serif text-xl uppercase mt-0.5">
                    {editingProduct ? `Modifier "${prodName}"` : 'Créer un nouveau sac'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600"
                  id="admin-product-modal-close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleSaveProduct} className="flex flex-col gap-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                      Nom du produit
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: L'Aura Impériale"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="bg-neutral-50 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-neutral-900"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                      Catégorie des sacs
                    </label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="bg-neutral-50 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-neutral-900"
                    >
                      <option value="Sacs de luxe">Sacs de luxe</option>
                      <option value="Sacs à main">Sacs à main</option>
                      <option value="Sacs de voyage">Sacs de voyage</option>
                      <option value="Sacs fashion">Sacs fashion</option>
                      <option value="Sacs scolaires">Sacs scolaires</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                      Prix d’achat (DZD)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 550"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="bg-neutral-50 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-neutral-900"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                      Ancien Prix (DZD)
                    </label>
                    <input
                      type="number"
                      placeholder="Laisser vide sinon"
                      value={prodOldPrice}
                      onChange={(e) => setProdOldPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="bg-neutral-50 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                      Stock initial
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 10"
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="bg-neutral-50 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-neutral-900"
                      required
                    />
                  </div>
                </div>

                {/* SKU Code generation */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                    Code SKU d’Enregistrement
                  </label>
                  <input
                    type="text"
                    value={prodCustomSku}
                    onChange={(e) => setProdCustomSku(e.target.value)}
                    className="bg-neutral-50 px-3 py-2 text-xs border rounded-lg font-mono focus:outline-none"
                    required
                  />
                </div>

                {/* Select colors circular dots */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                    Sélectionner les râteliers cuir disponibles:
                  </span>
                  <div className="flex items-center gap-3 flex-wrap mt-1">
                    {presetColorsList.map((col) => {
                      const isActive = prodColors.includes(col.hex);
                      return (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() => handleColorToggle(col.hex)}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                            isActive
                              ? 'bg-neutral-900 border-neutral-900 text-white font-bold ring-2 ring-[#BF986B]/20'
                              : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-900'
                          }`}
                        >
                          <span className="w-2.5 h-2.5 rounded-full border border-white" style={{ backgroundColor: col.hex }} />
                          {col.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Previews preset select image bag */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                    Sélectionner l’image de présentation :
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 bg-neutral-50 p-2.5 rounded-xl border">
                    {LUXURY_BAG_IMAGE_PRESETS.map((imgUrl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setProdImageChosen(imgUrl); setProdCustomImageUrl(''); }}
                        className={`aspect-square rounded-lg overflow-hidden border transition-all relative ${
                          prodImageChosen === imgUrl && !prodCustomImageUrl
                            ? 'border-[#BF986B] ring-2 ring-[#BF986B]/30 scale-95 font-bold'
                            : 'border-transparent hover:scale-95'
                        }`}
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        {prodImageChosen === imgUrl && !prodCustomImageUrl && (
                          <div className="absolute inset-0 bg-[#BF986B]/15 flex items-center justify-center font-mono text-[8px] text-[#2C2621]">
                            Focus
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                      Ou ajouter une image personnalisée (URL)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={prodCustomImageUrl}
                        onChange={(e) => { setProdCustomImageUrl(e.target.value); if (e.target.value) setProdImageChosen(e.target.value); }}
                        className="flex-1 bg-neutral-50 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-neutral-900"
                      />
                      {prodCustomImageUrl && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden border shrink-0 bg-neutral-100">
                          <img src={prodCustomImageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description complet */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                    Description atelier et poésie du cuir
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Saisissez la composition poétique du modèle, l’origine de la peausserie et les spécificités de couture..."
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="bg-neutral-50 px-3.5 py-2.5 text-xs border rounded-lg focus:outline-none focus:border-neutral-900 leading-relaxed font-sans"
                    required
                  />
                </div>

                {/* Add/Edit Submit trigger */}
                <button
                  type="submit"
                  className="mt-2 py-4 bg-[#141414] text-white hover:bg-[#BF986B] text-[10px] uppercase font-mono tracking-[0.2em] rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  id="admin-save-product-form-submit"
                >
                  <CheckCircle size={13} />
                  {editingProduct ? 'Sauvegarder les Changements' : 'Injecter le sac au catalogue'}
                </button>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
