import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const Cart: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    navigateTo,
    currentTheme
  } = useApp();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Custom luxury services configuration
  const shippingCharge = subtotal >= 300 ? 0 : 25;
  const ecoTaxes = Math.round(subtotal * 0.05 * 100) / 100;
  const totalAmount = subtotal + shippingCharge;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 min-h-screen" id="cart-page-wrapper">
      
      {/* Page Title */}
      <div className="pt-8 pb-12 text-center md:text-left">
        <span className="text-[10px] tracking-[0.25em] text-[#BF986B] font-mono uppercase">
          PANIER SIGNÉ AURA
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-light text-neutral-800 uppercase mt-1 tracking-wider">
          Votre Sélection d’Art
        </h1>
        <p className="text-xs text-neutral-400 mt-2 font-mono tracking-widest max-w-sm">
          Finition des coutures et certification scellée par l'atelier en cours d'attribution.
        </p>
      </div>

      {cart.length === 0 ? (
        /* Empty Basket State page */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center text-center py-24 bg-white border border-dashed rounded-3xl p-6"
        >
          <div className="p-5 rounded-full bg-neutral-50 text-neutral-400 mb-4 animate-bounce">
            <ShoppingBag size={28} />
          </div>
          <h2 className="font-serif text-xl font-medium text-neutral-800 uppercase">
            Votre panier est vide
          </h2>
          <p className="text-xs text-neutral-400 max-w-xs mt-2 leading-relaxed">
            Vos plus belles sélections de sacs de luxe, de voyage ou de créateurs apparaîtront ici dès que vous les aurez ajoutées.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="mt-6 px-8 py-3.5 bg-neutral-900 hover:bg-[#BF986B] text-white text-[10px] uppercase font-mono font-bold tracking-widest rounded-full transition-all cursor-pointer shadow-md"
          >
            Découvrir nos créations
          </button>
        </motion.div>
      ) : (
        /* Actual Basket contents */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left panel: List of items */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {cart.map((item, idx) => {
              const productTotal = item.product.price * item.quantity;
              
              return (
                <motion.div
                  key={`${item.product.id}-${item.selectedColor}-${idx}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-neutral-100 shadow-sm relative"
                  id={`cart-item-row-${item.product.id}`}
                >
                  
                  {/* Left: Picture and basic detail info */}
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-24 aspect-[4/5] bg-neutral-50 rounded-xl overflow-hidden shrink-0 border border-neutral-150 relative">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-[8px] font-mono uppercase tracking-widest text-[#BF986B]">
                        {item.product.category}
                      </span>
                      <h3
                        onClick={() => navigateTo('details', { id: item.product.id })}
                        className="font-serif text-[15px] font-semibold text-neutral-800 hover:text-[#BF986B] transition-colors truncate cursor-pointer uppercase"
                      >
                        {item.product.name}
                      </h3>
                      
                      {/* Swatch detail */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] text-neutral-400 font-sans">
                          Finition:
                        </span>
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white ring-1 ring-neutral-300"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Middle: Quantity adjusts & Pricing details */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    
                    {/* Qty increments */}
                    <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50/50 overflow-hidden p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity - 1)}
                        className="p-1.5 hover:bg-white rounded-md text-neutral-500 transition-all cursor-pointer"
                        id={`qty-dec-${item.product.id}`}
                      >
                        <Minus size={10} />
                      </button>
                      
                      <span className="w-8 text-center font-mono text-xs font-bold text-neutral-800">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.quantity + 1)}
                        className="p-1.5 hover:bg-white rounded-md text-neutral-500 transition-all cursor-pointer"
                        id={`qty-inc-${item.product.id}`}
                      >
                        <Plus size={10} />
                      </button>
                    </div>

                    {/* Pricing */}
                    <div className="flex flex-col text-right font-mono min-w-[70px]">
                      <span className="text-xs font-bold text-neutral-800">
                        {productTotal} DZD
                      </span>
                      <span className="text-[9px] text-neutral-400">
                        ({item.product.price} DZD / u)
                      </span>
                    </div>

                    {/* Deletion Bin button */}
                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedColor)}
                      className="p-2 text-neutral-300 hover:text-red-500 transition-colors"
                      title="Enlever du panier"
                      id={`remove-cart-${item.product.id}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right panel: Summary Calculations and trigger checkouts */}
          <div className="lg:col-span-4 bg-neutral-50/50 p-6 md:p-8 rounded-2xl border border-neutral-100 flex flex-col gap-6">
            <h3 className="font-serif text-lg uppercase tracking-wide text-neutral-800">
              Résumé de la Commande
            </h3>

            <div className="flex flex-col gap-3 font-mono text-xs border-b border-neutral-200 pb-5">
              
              <div className="flex justify-between text-neutral-600">
                <span>Nombre de sacs :</span>
                <span className="font-semibold">{totalItems}</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Sous-total articles :</span>
                <span className="font-semibold">{subtotal} DZD</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Assurances & Taxes d'art (5%) :</span>
                <span className="font-semibold">{ecoTaxes} DZD</span>
              </div>

              <div className="flex justify-between text-neutral-600">
                <span>Livraison sécurisée :</span>
                {shippingCharge === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">
                    Offerte (Aura Privé)
                  </span>
                ) : (
                  <span className="font-semibold">{shippingCharge} DZD</span>
                )}
              </div>

              {shippingCharge > 0 && (
                <p className="text-[10px] text-[#BF986B] font-sans leading-relaxed pt-1 select-none">
                  💡 Ajoutez encore {300 - subtotal} DZD de maroquinerie pour obtenir la <strong>livraison privée express gratuite</strong> !
                </p>
              )}
            </div>

            {/* Total Section */}
            <div className="flex justify-between items-center font-mono text-sm uppercase tracking-wider">
              <span className="font-bold text-neutral-800">Estimation totale :</span>
              <span className="text-2xl font-black text-neutral-900">
                {totalAmount + ecoTaxes} DZD
              </span>
            </div>

            {/* Secure payment shield */}
            <div className="p-3 bg-white rounded-xl border border-neutral-100 flex gap-2.5 items-start mt-1 select-none">
              <ShieldCheck size={16} className="text-[#BF986B] shrink-0 mt-0.5" />
              <div className="overflow-hidden">
                <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-700 font-mono">
                  Paiement 100% Sécurisé
                </p>
                <p className="text-[9px] text-neutral-400 font-sans mt-0.5">
                  Protocoles de cryptag SSL haut niveau. Écrin scellé de l'atelier à votre adresse.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateTo('checkout')}
              className="w-full py-4 bg-neutral-900 hover:bg-[#BF986B] text-white text-[10px] uppercase font-mono font-bold tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-black/10 hover:shadow-xl cursor-pointer"
              id="cart-checkout-trigger"
            >
              Étape Facturation
              <ArrowRight size={12} />
            </button>
            
            <button
              onClick={() => navigateTo('shop')}
              className="w-full py-3.5 border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:text-neutral-950 text-[10px] uppercase font-mono tracking-widest font-semibold rounded-xl bg-white transition-all text-center cursor-pointer"
            >
              Continuer les achats
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
