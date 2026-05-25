import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, ShoppingBag, Eye, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart, currentTheme } = useApp();
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Active color chosen
  const activeColorValue = product.colors[selectedColorIdx] || product.colors[0];
  const activeColorName = product.colorNames ? product.colorNames[selectedColorIdx] : 'Coloris Unique';

  // Toggle wishlist
  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, activeColorValue);
  };

  // Check if out of stock
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      onClick={() => navigateTo('details', { id: product.id })}
      className="group flex flex-col gap-4 cursor-pointer relative"
      id={`product-card-${product.id}`}
    >
      
      {/* Upper Half: Luxury Image Container */}
      <div className="aspect-[4/5] w-full bg-[#FAF8F5] select-none rounded-2xl overflow-hidden relative border border-neutral-100/50">
        
        {/* Hover zoom picture */}
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Floating Tags */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.isNew && (
            <span className="px-2.5 py-1 text-[8px] tracking-[0.15em] font-mono leading-none bg-black text-white rounded-full uppercase">
              Nouveau
            </span>
          )}
          {product.isPromo && (
            <span className="px-2.5 py-1 text-[8px] tracking-[0.15em] font-mono leading-none bg-[#BF986B] text-white rounded-full uppercase">
              Privilège
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="px-2.5 py-1 text-[8px] tracking-[0.15em] font-mono leading-none bg-red-500 text-white rounded-full uppercase">
              Stock Faible
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-1 text-[8px] tracking-[0.15em] font-mono leading-none bg-neutral-400 text-white rounded-full uppercase">
              Épuisé
            </span>
          )}
        </div>

        {/* Wishlist toggle button */}
        <button
          onClick={toggleLike}
          className="absolute top-4 right-4 z-10 p-2 sm:p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md text-neutral-600 hover:text-red-500 hover:scale-110 active:scale-90 transition-all cursor-pointer"
          title="Ajouter aux favoris"
          id={`like-btn-${product.id}`}
        >
          <Heart size={14} fill={isLiked ? '#ef4444' : 'none'} className={isLiked ? 'text-red-500 animate-pulse' : ''} />
        </button>

        {/* Hover Action Sheet Overlays - Cart & Quickview */}
        <div className="absolute inset-x-4 bottom-4 z-10 hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex-1 py-2.5 px-4 text-[10px] uppercase tracking-widest font-mono font-bold leading-none rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-white text-neutral-800 hover:bg-neutral-900 hover:text-white'
            }`}
            id={`quick-add-${product.id}`}
          >
            <ShoppingBag size={12} />
            {isOutOfStock ? 'Rupture' : 'Prendre'}
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('details', { id: product.id });
            }}
            className="p-2.5 bg-white text-neutral-800 rounded-xl shadow-lg hover:bg-neutral-950 hover:text-white transition-all cursor-pointer"
            title="S'informer"
            id={`quick-view-${product.id}`}
          >
            <Eye size={12} />
          </button>
        </div>
      </div>

      {/* Lower Half: Product Metadata details */}
      <div className="flex flex-col gap-1.5 px-1 flex-1 justify-between">
        <div className="flex flex-col gap-0.5">
          {/* Category */}
          <span className="text-[9px] tracking-[0.2em] font-mono uppercase text-neutral-400">
            {product.category}
          </span>
          
          {/* Product Name Title & Rating Row */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-serif text-[15px] font-medium text-neutral-800 leading-snug group-hover:text-[#BF986B] transition-colors truncate">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-0.5 text-neutral-700 font-mono text-xs font-semibold">
              <Star size={11} fill="#BF986B" className="text-[#BF986B]" />
              <span>{product.rating}</span>
            </div>
          </div>
        </div>

        {/* Swatch & Price Row */}
        <div className="flex items-center justify-between mt-1 gap-2">
          
          {/* Color circular indicators */}
          <div className="flex items-center gap-1.5">
            {product.colors.map((c, idx) => (
              <button
                key={c + idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIdx(idx);
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  selectedColorIdx === idx
                    ? 'ring-1 ring-neutral-800 scale-110 border-white'
                    : 'border-neutral-200 scale-90'
                }`}
                style={{ backgroundColor: c }}
                title={product.colorNames ? product.colorNames[idx] : undefined}
                id={`swatch-${product.id}-${idx}`}
              />
            ))}
            <span className="hidden group-hover:inline text-[8px] text-neutral-400 font-mono tracking-wider ml-1 truncate max-w-[60px]">
              {activeColorName}
            </span>
          </div>

          {/* Pricing Details */}
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold shrink-0">
            {product.oldPrice && (
              <span className="text-neutral-400 line-through text-[11px] font-normal">
                {product.oldPrice}€
              </span>
            )}
            <span className="text-neutral-800 font-bold shrink-0">
              {product.price}€
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
