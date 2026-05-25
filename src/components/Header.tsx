import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Menu, X, User, Search, Palette, Key, LogOut, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AVAILABLE_THEMES } from '../data/products';
import { ThemeType } from '../types';

export const Header: React.FC = () => {
  const {
    cart,
    navigateTo,
    customRoute,
    currentTheme,
    setThemeById,
    currentUser,
    logout,
    login,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);

  // Monitor Scroll for Glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Quick switch role
  const handleToggleAdminMode = () => {
    if (currentUser?.isAdmin) {
      // Degrade to regular buyer
      login('acheteur@maisonaura.com', 'Client Privilégié', false);
    } else {
      // Re-accéder à l'admin
      login('marilyn@maisonaura.com', 'Marilyn Aura (Vendeuse)', true);
    }
  };

  const activePage = customRoute.page;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md shadow-sm border-b py-3'
            : 'bg-transparent py-5'
        } ${isScrolled ? 'border-neutral-100' : 'border-transparent'}`}
        id="main-app-header"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Menu Hamburger Mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-1.5 rounded-full text-neutral-800 hover:bg-neutral-100 transition-colors"
            id="mobile-menu-trigger"
          >
            <Menu size={20} />
          </button>

          {/* Left: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.2em] font-medium text-neutral-800">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:opacity-100 transition-all cursor-pointer ${
                activePage === 'home' ? 'font-semibold tracking-[0.25em]' : 'opacity-70'
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => navigateTo('shop')}
              className={`hover:opacity-100 transition-all cursor-pointer ${
                activePage === 'shop' ? 'font-semibold tracking-[0.25em]' : 'opacity-70'
              }`}
            >
              Boutique
            </button>
            <button
              onClick={() => {
                // Focus on categories directly
                navigateTo('shop');
              }}
              className="hover:opacity-100 transition-all opacity-70 cursor-pointer"
            >
              Collections
            </button>

            {currentUser?.isAdmin && (
              <button
                onClick={() => navigateTo('dashboard')}
                className={`text-[#D0A352] font-semibold tracking-[0.25em] flex items-center gap-1 cursor-pointer`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#BF986B] animate-ping" />
                Tableau de bord
              </button>
            )}
          </nav>

          {/* Center: Brand Name Logo */}
          <div className="text-center flex flex-col items-center">
            <button
              onClick={() => navigateTo('home')}
              className="font-serif text-lg md:text-2xl tracking-[0.3em] font-light uppercase select-none cursor-pointer"
            >
              MV LUXURY
            </button>
            <span className="hidden md:block text-[8px] tracking-[0.35em] text-neutral-400 uppercase mt-0.5">
              Haute Maroquinerie
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* Quick search button */}
            <div className="relative">
              <button
                onClick={() => setShowSearchBox(!showSearchBox)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-700 transition-all"
                id="search-icon-btn"
              >
                <Search size={18} />
              </button>
              
              <AnimatePresence>
                {showSearchBox && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 bg-white border p-3 rounded-lg shadow-xl min-w-[260px] flex items-center gap-2 border-neutral-100"
                  >
                    <input
                      type="text"
                      placeholder="Rechercher un sac..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (activePage !== 'shop') navigateTo('shop');
                      }}
                      className="text-xs bg-neutral-50 px-3 py-1.5 rounded-md flex-1 focus:outline-none"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="text-neutral-400 hover:text-neutral-600 p-0.5"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Simulated Theme Palette Button */}
            <div className="relative">
              <button
                onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-700 transition-all flex items-center gap-0.5"
                title="Changer de thème"
                id="theme-selector-btn"
              >
                <Palette size={18} />
              </button>

              <AnimatePresence>
                {isThemeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-12 bg-white/95 backdrop-blur-md border border-neutral-100 p-3 rounded-xl shadow-2xl min-w-[220px]"
                  >
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 mb-2 px-1">
                      Thème Lumineux Luxe
                    </p>
                    <div className="flex flex-col gap-1">
                      {AVAILABLE_THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setThemeById(theme.id as ThemeType);
                            setIsThemeDropdownOpen(false);
                          }}
                          className={`flex items-center gap-2.5 w-full text-left p-1.5 rounded-lg text-xs hover:bg-neutral-50 transition-all ${
                            currentTheme.id === theme.id ? 'font-semibold bg-neutral-100/50' : 'text-neutral-700'
                          }`}
                        >
                          <div
                            className="w-4 h-4 rounded-full border border-neutral-200"
                            style={{ backgroundColor: theme.accent }}
                          />
                          <span className="flex-1">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Admin/Seller Switcher */}
            <button
              onClick={handleToggleAdminMode}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest transition-all font-mono font-bold ${
                currentUser?.isAdmin
                  ? 'bg-[#BF986B]/10 text-[#BF986B] border border-[#BF986B]/30'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
              title={currentUser?.isAdmin ? 'Revenir en mode acheteur' : 'Passer en mode vendeuse'}
              id="admin-mode-toggle"
            >
              <Key size={11} />
              {currentUser?.isAdmin ? 'Vendeuse' : 'Acheteur'}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => navigateTo('cart')}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-700 transition-all relative cursor-pointer"
              id="header-cart-icon"
            >
              <ShoppingBag size={18} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#141414] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Account / Admin Panel directly */}
            <div className="hidden md:block">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (currentUser.isAdmin) {
                        navigateTo('dashboard');
                      } else {
                        navigateTo('dashboard'); // custom overview settings
                      }
                    }}
                    className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-700 transition-all"
                    title={currentUser.name}
                  >
                    <User size={18} />
                  </button>
                  <button
                    onClick={logout}
                    className="p-1.5 rounded-full hover:bg-red-50 text-red-400 transition-all"
                    title="Déconnexion"
                    id="logout-btn"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigateTo('login')}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-700 transition-all"
                  title="Connexion"
                >
                  <User size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            
            {/* Dark background backing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 bottom-0 left-0 w-4/5 max-w-[320px] bg-white p-6 shadow-2xl flex flex-col justify-between"
              id="mobile-drawer-body"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                  <span className="font-serif text-lg tracking-[0.25em] text-neutral-800">
                    AURA
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-neutral-400 hover:text-neutral-600"
                    id="mobile-drawer-close"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Links */}
                <div className="flex flex-col gap-6 mt-8 font-sans">
                  <button
                    onClick={() => {
                      navigateTo('home');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left py-1 text-sm font-medium text-neutral-800 uppercase tracking-widest border-b border-transparent hover:border-neutral-800 transition-all"
                  >
                    Accueil
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('shop');
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left py-1 text-sm font-medium text-neutral-800 uppercase tracking-widest border-b border-transparent hover:border-neutral-800 transition-all"
                  >
                    Boutique
                  </button>

                  {currentUser?.isAdmin && (
                    <button
                      onClick={() => {
                        navigateTo('dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-left py-1 text-sm font-bold text-[#BF986B] uppercase tracking-widest flex items-center gap-1.5"
                    >
                      <Briefcase size={16} />
                      Dashboard Vendeuse
                    </button>
                  )}
                </div>
              </div>

              {/* Drawer Footer controls */}
              <div className="pt-6 border-t border-neutral-100 flex flex-col gap-4">
                {currentUser ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#BF986B]/10 flex items-center justify-center text-[#BF986B] font-mono text-xs font-bold">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-semibold truncate text-neutral-800">
                          {currentUser.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleToggleAdminMode}
                      className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-neutral-700 text-xs font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Key size={12} />
                      {currentUser.isAdmin ? 'Mode Acheteur' : 'Mode Vendeuse'}
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full py-2 border border-red-100 text-red-500 rounded-lg text-xs font-medium tracking-widest uppercase flex items-center justify-center gap-1.5 hover:bg-red-50 transition-all"
                    >
                      <LogOut size={12} />
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      navigateTo('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2 bg-[#141414] text-white text-xs tracking-widest uppercase font-medium rounded-lg text-center"
                  >
                    Se connecter
                  </button>
                )}
                
                <p className="text-[9px] text-center text-neutral-400 tracking-wider">
                  MV LUXURY © All Rights Reserved.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
