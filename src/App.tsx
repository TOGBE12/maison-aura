import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { PageLoader } from './components/Loader';


function StoreShell() {
  const { customRoute, currentTheme } = useApp();
  const [initialLoading, setInitialLoading] = useState(true);

  React.useEffect(() => {
    const root = document.documentElement;
    if (currentTheme.accent) root.style.setProperty('--theme-accent', currentTheme.accent);
    if (currentTheme.accentHover) root.style.setProperty('--theme-accent-hover', currentTheme.accentHover);
    if (currentTheme.bgPageHex) root.style.setProperty('--theme-bg-page', currentTheme.bgPageHex);
    if (currentTheme.textPrimaryHex) root.style.setProperty('--theme-text-primary', currentTheme.textPrimaryHex);
    if (currentTheme.textMutedHex) root.style.setProperty('--theme-text-muted', currentTheme.textMutedHex);
    if (currentTheme.cardBgHex) root.style.setProperty('--theme-card-bg', currentTheme.cardBgHex);
    if (currentTheme.borderHex) root.style.setProperty('--theme-border', currentTheme.borderHex);
    if (currentTheme.nudeTintHex) root.style.setProperty('--theme-nude-tint', currentTheme.nudeTintHex);
  }, [currentTheme]);

  if (initialLoading) {
    return <PageLoader duration={2000} onComplete={() => setInitialLoading(false)} />;
  }

  const renderActivePage = () => {
    switch (customRoute.page) {
      case 'home':
        return <Home />;
      case 'shop':
        return <Shop />;
      case 'details':
        return <ProductDetails />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'login':
      case 'register':
        return <Auth />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <Home />;
    }
  };

  // Check if we are viewing the Admin Dashboard to customize layout bounds
  const isDashboardView = customRoute.page === 'dashboard';

  return (
    <div
      className={`min-h-screen text-neutral-800 transition-colors duration-500 overflow-x-hidden flex flex-col ${currentTheme.bgPage}`}
      id="storefront-main-layout"
    >
      {/* 1. Header Toolbar (Hidden inside administrative dashboard side views on tablet/mobile if needed, but we keep it beautifully unified) */}
      {!isDashboardView && <Header />}

      {/* 2. Page viewport with Framer Motion slide-in fade animation */}
      <main className={`flex-grow ${!isDashboardView ? 'pt-14' : ''}`}>
        <div key={customRoute.page + (customRoute.params.id || '')}>
          {renderActivePage()}
        </div>
      </main>

      {/* 3. Footer Section (Completely hidden inside administrative dashboard to leave sidebar-driven layouts full-bleed) */}
      {!isDashboardView && <Footer />}

      {/* 4. Sliding Global Toast Messages */}
      <Notification />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <StoreShell />
    </AppProvider>
  );
}
