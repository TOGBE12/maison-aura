import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, Search, RotateCcw, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Shop: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    categories,
  } = useApp();

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Categories list
  const categoriesList = React.useMemo(() => {
    const cats = categories.length > 0 ? categories : ['Sacs de luxe', 'Sacs à main', 'Sacs de voyage', 'Sacs fashion', 'Sacs scolaires'];
    return ['Tous', ...cats];
  }, [categories]);

  // Handle category shift
  const handleCategoryShift = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1); // Reset page to first
  };

  // Safe Price Max threshold calculation
  const maxAvailableProductPrice = useMemo(() => {
    if (products.length === 0) return 1500;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  // Combined Searching & Filtering Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter matching name or description
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Category matching
        const matchesCategory = selectedCategory === 'Tous' || p.category === selectedCategory;

        // Price range matching
        const matchesPrice = p.price <= priceRange[1];

        return matchesSearch && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        // Sorting
        if (sortBy === 'prix-asc') return a.price - b.price;
        if (sortBy === 'prix-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'new') {
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        }
        // Default: popularité (ranking)
        return b.rating - a.rating;
      });
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  // Pagination maths
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handlePageSelect = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Tous');
    setPriceRange([0, maxAvailableProductPrice]);
    setSortBy('popularité');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 min-h-screen" id="shop-page-wrapper">
      
      {/* Editorial Header */}
      <div className="text-center pt-8 pb-12">
        <span className="text-[10px] tracking-[0.25em] text-[#BF986B] font-mono uppercase">
          HAUTE COUTURE CATALOGUE
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-light uppercase text-neutral-800 tracking-wider mt-2">
          Le Vestiaire des Sacs
        </h1>
        <p className="text-xs text-neutral-400 mt-2 font-mono tracking-widest max-w-sm mx-auto">
          Découvrez des créations uniques façonnées à l'épaule et dotées d’une âme singulière.
        </p>
      </div>

      {/* Filtering Row toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between border-y border-neutral-100 py-5 gap-4">
        
        {/* Category Pill Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none scroll-smooth">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryShift(cat)}
              className={`px-4 py-1.5 text-[11px] uppercase tracking-wider font-mono shrink-0 rounded-full transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-900 border-neutral-900 text-white'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-900'
              }`}
              id={`cat-pill-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sorting Dropdowns and Filter Toggles */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 py-2 px-4 border border-neutral-200 hover:border-neutral-900 rounded-xl text-neutral-700 hover:text-neutral-900 text-xs font-mono tracking-wider uppercase transition-all bg-white cursor-pointer"
            id="toggle-collapsible-filters"
          >
            <SlidersHorizontal size={13} />
            Ajustements {showFilters ? '▼' : '▲'}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest hidden sm:inline">
              Trier:
            </span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-neutral-200 rounded-xl bg-white text-xs text-neutral-700 outline-none focus:border-neutral-900"
              id="sort-select-combobox"
            >
              <option value="popularité">Recommandations</option>
              <option value="prix-asc">Prix : Croissant</option>
              <option value="prix-desc">Prix : Décroissant</option>
              <option value="rating">Moyenne des avis</option>
              <option value="new">Nouveautés en premier</option>
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Collapsible Filter Sidebar Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-neutral-50/50 p-6 rounded-2xl border border-neutral-100 my-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Filter Section 1: Search Inputs */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#BF986B]">
                  Recherche textuelle
                </span>
                <div className="relative mt-2">
                  <input
                    type="text"
                    placeholder="Chercher maroquinerie, cuir, or..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-white border border-neutral-200 text-xs px-4 py-2.5 pl-9 rounded-xl focus:outline-none focus:border-neutral-900"
                  />
                  <Search size={13} className="absolute left-3 top-3.5 text-neutral-400" />
                </div>
              </div>

              {/* Filter Section 2: Max Price Limit Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#BF986B]">
                    Prix maximum accordé
                  </span>
                  <span className="text-xs font-mono font-bold text-neutral-800">
                    {priceRange[1]} DZD
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-[11px] font-mono text-neutral-400">0 DZD</span>
                  <input
                    type="range"
                    min="0"
                    max={maxAvailableProductPrice}
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([0, parseInt(e.target.value)]);
                      setCurrentPage(1);
                    }}
                    className="w-full accent-neutral-850 h-1 bg-neutral-200 rounded-lg cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-neutral-400">{maxAvailableProductPrice} DZD</span>
                </div>
              </div>

              {/* Filter Section 3: Reset Panel Options */}
              <div className="flex flex-col gap-2 justify-end">
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2.5 border border-dashed border-neutral-300 hover:border-neutral-900 text-[10px] font-mono tracking-widest uppercase font-bold text-neutral-600 hover:text-neutral-900 flex items-center justify-center gap-2 transition-all bg-white rounded-xl cursor-pointer"
                >
                  <RotateCcw size={11} />
                  Réinitialiser tous les filtres
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Catalog Grid of Products */}
      <div className="mt-8">
        
        {/* Results Counter text */}
        <p className="text-[11px] font-mono text-neutral-400 mb-6 uppercase tracking-wider">
          {filteredProducts.length} articles correspondent à vos préférences
        </p>

        {filteredProducts.length === 0 ? (
          /* Empty Search and Filter States */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white border border-dashed rounded-3xl"
          >
            <div className="p-4 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-400 mb-4 animate-bounce">
              <Filter size={24} />
            </div>
            <h3 className="font-serif text-xl font-medium text-neutral-800 uppercase">
              Aucune trouvaille
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mt-2 leading-relaxed font-sans">
              Nous n'avons trouvé aucun sac correspondant à vos filtres actuels. Essayez de desserrer vos critères ou d'effacer la recherche.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-6 py-2.5 bg-neutral-900 text-white hover:bg-[#BF986B] text-[10px] uppercase font-mono tracking-widest font-bold rounded-full transition-all cursor-pointer"
            >
              Effacer la recherche
            </button>
          </motion.div>
        ) : (
          /* Items Display Grid */
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {paginatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Modern custom paginator block */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-20 border-t border-neutral-100 pt-8">
          
          <button
            onClick={() => handlePageSelect(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 border border-neutral-200 hover:border-neutral-900 rounded-lg text-neutral-600 disabled:opacity-30 disabled:hover:border-neutral-200 transition-all cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageSelect(pageNum)}
                className={`w-9 h-9 rounded-full text-xs font-semibold font-mono tracking-wider transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#141414] text-white shadow-md'
                    : 'bg-white border text-neutral-600 hover:border-neutral-900'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageSelect(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 border border-neutral-200 hover:border-neutral-900 rounded-lg text-neutral-600 disabled:opacity-30 disabled:hover:border-neutral-200 transition-all cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
