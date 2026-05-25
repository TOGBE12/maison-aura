import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, Send, ArrowRight, Heart, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductDetails: React.FC = () => {
  const {
    customRoute,
    products,
    addToCart,
    reviews,
    addProductReview,
    navigateTo,
    currentTheme
  } = useApp();

  const productId = customRoute.params.id;

  // Retrieve matching product
  const product = useMemo(() => {
    return products.find((p) => p.id === productId) || products[0];
  }, [products, productId]);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs'>('details');
  const [showZoomModal, setShowZoomModal] = useState(false);

  // Review Form States
  const [revName, setRevName] = useState('');
  const [revEmail, setRevEmail] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  if (!product) {
    return (
      <div className="py-40 text-center" id="no-product-detail-state">
        <h2 className="font-serif text-2xl">Maroquinerie introuvable</h2>
        <button onClick={() => navigateTo('shop')} className="mt-4 px-6 py-2 bg-black text-white rounded-full">
          Retourner au catalogue
        </button>
      </div>
    );
  }

  // Related products
  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [products, product]);

  // Read reviews belonging to this item
  const productReviews = useMemo(() => {
    return reviews.filter((r) => r.productId === product.id);
  }, [reviews, product.id]);

  const activeColorValue = product.colors[selectedColorIdx] || product.colors[0];
  const activeColorName = product.colorNames ? product.colorNames[selectedColorIdx] : 'Finition Premium';

  const isOutOfStock = product.stock <= 0;

  const handleQtyAdjust = (type: 'inc' | 'dec') => {
    if (type === 'inc') {
      if (quantity >= product.stock) return;
      setQuantity((q) => q + 1);
    } else {
      if (quantity <= 1) return;
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCartSubmit = () => {
    addToCart(product, quantity, activeColorValue);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revEmail || !revComment) return;

    addProductReview(product.id, revName, revEmail, revRating, revComment);
    
    // Clear form inputs
    setRevName('');
    setRevEmail('');
    setRevRating(5);
    setRevComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-28" id={`product-details-${product.id}`}>
      
      {/* Structural layout: image panel split with buying options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Main Visual showcase */}
          <div className="aspect-[4/5] w-full bg-[#FAF8F5] rounded-2xl relative overflow-hidden border border-neutral-100/50 flex items-center justify-center group">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover select-none"
            />
            
            {/* Quick Zoom Overlay icon */}
            <button
              onClick={() => setShowZoomModal(true)}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3.5 py-2.5 rounded-xl shadow-md text-xs font-mono font-bold tracking-widest text-[#2C2621] uppercase hover:bg-black hover:text-white transition-all scale-95 hover:scale-100 flex items-center gap-1 cursor-pointer"
              title="Agrandir la pièce"
              id="gallerie-zoom-trigger"
            >
              <Eye size={13} />
              Loupe
            </button>
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-24 h-24 aspect-square shrink-0 rounded-xl overflow-hidden bg-neutral-50 border transition-all ${
                    activeImageIdx === idx
                      ? 'border-[#BF986B] ring-2 ring-[#BF986B]/20 scale-95'
                      : 'border-neutral-200 hover:border-neutral-800'
                  }`}
                  id={`gallerie-thumbnail-${idx}`}
                >
                  <img src={img} alt="Thumbnail view" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Buying panel detail */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="flex flex-col gap-1 border-b border-neutral-100 pb-5">
            <span className="text-[10px] tracking-[0.25em] text-[#BF986B] font-mono uppercase font-bold">
              {product.category}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-neutral-800 uppercase mt-1 leading-tight tracking-wide font-light">
              {product.name}
            </h1>
            
            {/* Reviews indicators */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-amber-500 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < Math.round(product.rating) ? '#BF986B' : 'none'}
                    className="text-[#BF986B]"
                  />
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-neutral-700">
                {product.rating} / 5
              </span>
              <span className="text-xs text-neutral-400 font-sans">
                ({productReviews.length} avis clients)
              </span>
            </div>
          </div>

          {/* Pricing Row */}
          <div className="flex items-center gap-3 border-b border-neutral-100 pb-5">
            {product.oldPrice && (
              <span className="text-neutral-400 font-mono text-base line-through">
                {product.oldPrice} DZD
              </span>
            )}
            <span className="text-3xl font-mono font-bold text-neutral-800">
              {product.price} DZD
            </span>
            {product.isPromo && (
              <span className="bg-[#BF986B]/15 text-[#BF986B] border border-[#BF986B]/30 px-2.5 py-0.5 text-[8px] uppercase tracking-widest font-mono font-bold rounded-full">
                Ventes Privées Aura
              </span>
            )}
          </div>

          {/* Short description with leather select */}
          <div className="flex flex-col gap-4">
            <p className="text-xs text-neutral-600 font-sans leading-relaxed">
              {product.description}
            </p>

            {/* Leather Color option selection */}
            <div className="flex flex-col gap-2 mt-2">
              <span className="text-[9px] font-mono font-semibold text-neutral-400 uppercase tracking-widest">
                Choix du cuir : <span className="text-neutral-800 ml-1 font-bold">{activeColorName}</span>
              </span>
              <div className="flex items-center gap-2.5 mt-1">
                {product.colors.map((c, idx) => (
                  <button
                    key={c + idx}
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`w-8 h-8 rounded-full border-2 transition-all relative cursor-pointer ${
                      selectedColorIdx === idx
                        ? 'border-neutral-800 scale-105'
                        : 'border-transparent hover:border-neutral-400 scale-95'
                    }`}
                    style={{ backgroundColor: c }}
                    title={product.colorNames ? product.colorNames[idx] : undefined}
                    id={`detail-color-btn-${idx}`}
                  >
                    <span className="absolute inset-0.5 rounded-full border border-white" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity selector and Cart adding button */}
          <div className="flex flex-col gap-3 pt-4 border-t border-neutral-100">
            
            <div className="flex items-center gap-4">
              
              {/* Count adjusted */}
              <div className="flex items-center border border-neutral-200 rounded-xl bg-white overflow-hidden p-1">
                <button
                  onClick={() => handleQtyAdjust('dec')}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-500 disabled:opacity-35 transition-all cursor-pointer"
                  id="detail-qty-decrement"
                >
                  <Minus size={11} />
                </button>
                <span className="w-10 text-center font-mono text-xs font-bold text-neutral-800">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQtyAdjust('inc')}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-500 disabled:opacity-35 transition-all cursor-pointer"
                  id="detail-qty-increment"
                >
                  <Plus size={11} />
                </button>
              </div>

              {/* Add trigger */}
              <button
                onClick={handleAddToCartSubmit}
                disabled={isOutOfStock}
                className={`flex-1 py-4 px-6 text-xs uppercase font-mono font-bold tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                  isOutOfStock
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
                    : 'bg-neutral-900 text-white hover:bg-[#BF986B] hover:shadow-xl'
                }`}
                id="add-to-cart-form-submit"
              >
                {isOutOfStock ? 'Hors Stock' : 'Ajouter au Panier'}
              </button>
            </div>

            {/* Micro details indicators */}
            <div className="flex flex-col gap-1.5 mt-3 text-[10px] text-neutral-500 font-sans">
              
              {product.stock <= 3 && product.stock > 0 && (
                <p className="text-red-500 font-mono font-bold uppercase tracking-wider animate-pulse">
                  ⚠️ Plus que {product.stock} articles disponibles en stock !
                </p>
              )}

              <div className="flex items-center gap-2 mt-1">
                <Truck size={13} className="text-[#BF986B]" />
                <span>Livraison Standard Offerte (3-5 jours) ou Express (24h)</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={13} className="text-[#BF986B]" />
                <span>Retours sous 30 jours dans l’emballage d’origine scellé</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-[#BF986B]" />
                <span>Modèle haut de gamme authentifié & poinçonné par l’atelier</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented detailed view tabs */}
      <section className="mt-20 border-t border-neutral-100 pt-16">
        <div className="flex border-b justify-center gap-10 font-mono text-xs uppercase tracking-widest pb-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-1 border-b cursor-pointer transition-all ${
              activeTab === 'details'
                ? 'border-neutral-900 font-bold text-neutral-800'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
            id="tab-trigger-details"
          >
            L’art de la Conception
          </button>
          
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-1 border-b cursor-pointer transition-all ${
              activeTab === 'specs'
                ? 'border-neutral-900 font-bold text-neutral-800'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
            id="tab-trigger-specs"
          >
            Fiche de l’Atelier
          </button>
        </div>

        <div className="py-8 max-w-3xl mx-auto">
          {activeTab === 'details' ? (
            /* Conception text specs */
            <div className="flex flex-col gap-4 text-xs text-neutral-600 leading-relaxed font-sans" id="conception-details-contents">
              <p className="font-serif italic text-base text-[#2C2621]">
                « La maroquinerie n’est pas un simple accessoire de mode, c’est une armure d’élégance quotidienne que l’on s’approprie au toucher. »
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {product.features.map((feat, i) => (
                  <div key={i} className="flex gap-2.5 items-start p-3 bg-neutral-50/50 rounded-xl border border-neutral-100">
                    <span className="text-[#BF986B] font-mono leading-none">0{i + 1}.</span>
                    <span className="mt-0.5">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Technical specifications table list */
            <div className="overflow-hidden bg-white rounded-xl border" id="tech-details-contents">
              <table className="w-full text-xs text-left text-neutral-600 font-sans border-collapse">
                <tbody>
                  {Object.entries(product.specifications).map(([key, val], index) => (
                    <tr key={key} className={index % 2 === 0 ? 'bg-neutral-50/40 border-b' : 'border-b'}>
                      <td className="px-6 py-4 font-mono uppercase tracking-wider font-semibold text-neutral-400 w-1/3 border-r">
                        {key}
                      </td>
                      <td className="px-6 py-4 font-normal text-neutral-800">
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Customer evaluations and reviews form submissions */}
      <section className="mt-16 border-t border-neutral-100 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Existing feedbacks */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h3 className="font-serif text-xl tracking-wide uppercase text-neutral-800 font-light">
            Avis Clients ({productReviews.length})
          </h3>

          <div className="flex flex-col gap-5">
            {productReviews.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">
                Aucun avis n'a encore été publié pour ce modèle. Soyez le premier à partager votre expérience !
              </p>
            ) : (
              productReviews.map((rev) => (
                <div key={rev.id} className="p-5 bg-neutral-50/30 rounded-xl border border-neutral-100 flex flex-col gap-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-800">
                      {rev.userName}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {new Date(rev.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Stars list */}
                  <div className="flex text-amber-500 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        fill={i < rev.rating ? '#BF986B' : 'none'}
                        className="text-[#BF986B]"
                      />
                    ))}
                  </div>

                  <p className="text-xs text-neutral-600 font-sans mt-2 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Create interactive review form */}
        <div className="lg:col-span-5 bg-neutral-50/50 p-6 md:p-8 rounded-2xl border border-neutral-100 flex flex-col gap-4">
          <h3 className="font-serif text-lg uppercase tracking-wide text-neutral-800">
            Publier une évaluation
          </h3>
          <p className="text-[11px] text-neutral-400 font-sans">
            Nous valorisons votre point de vue. Votre adresse courriel ne sera pas divulguée publiquement.
          </p>

          <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 mt-2">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                  Prénom & Nom
                </label>
                <input
                  type="text"
                  placeholder="Elise Martin"
                  value={revName}
                  onChange={(e) => setRevName(e.target.value)}
                  className="bg-white border text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-neutral-900"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                  Adresse email
                </label>
                <input
                  type="email"
                  placeholder="elise@me.com"
                  value={revEmail}
                  onChange={(e) => setRevEmail(e.target.value)}
                  className="bg-white border text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-neutral-900"
                  required
                />
              </div>
            </div>

            {/* Rating Choice Stars */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                Votre note d'appréciation
              </label>
              <div className="flex items-center gap-1.5 mt-1 scale-105 origin-left">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const rNum = idx + 1;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRevRating(rNum)}
                      className="text-[#BF986B] hover:scale-110 active:scale-95 transition-all text-xs cursor-pointer"
                    >
                      <Star size={16} fill={rNum <= revRating ? '#BF986B' : 'none'} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Area */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                Votre commentaire précieux
              </label>
              <textarea
                rows={4}
                placeholder="Rédigez un court commentaire sur la qualité du cuir, les finitions de la métallerie, ou le confort d'épaule du sac..."
                value={revComment}
                onChange={(e) => setRevComment(e.target.value)}
                className="bg-white border text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-neutral-900 leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-2 py-3 bg-[#141414] text-white font-mono hover:bg-[#BF986B] text-[10px] uppercase font-bold tracking-[0.2em] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-black/10"
              id="submit-new-review-btn"
            >
              <Send size={11} />
              Soumettre mon avis
            </button>
          </form>
        </div>
      </section>

      {/* Recommended similar related goods */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 border-t border-neutral-100 pt-20">
          <div className="text-center mb-12">
            <span className="text-neutral-400 font-mono tracking-[0.25em] uppercase text-[10px]">
              HAUTE SELECTION
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-light text-[#2C2621] uppercase mt-1 tracking-wider">
              Dans la même collection
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  navigateTo('details', { id: p.id });
                  setActiveImageIdx(0);
                  setQuantity(1);
                }}
                className="cursor-pointer group flex flex-col gap-3 p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-neutral-200/50 transition-all text-center"
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden relative bg-neutral-50 border">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="font-serif text-sm font-semibold text-neutral-800 uppercase mt-2">
                  {p.name}
                </h4>
                <p className="text-xs text-[#BF986B] font-mono leading-none">
                  {p.price} DZD
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dark interactive Zoom Lightbox Modal */}
      <AnimatePresence>
        {showZoomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark backing overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowZoomModal(false)}
              className="absolute inset-0 bg-neutral-950 cursor-zoom-out"
            />

            {/* Modal Lightbox */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full max-h-[85vh] bg-white rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl flex items-center justify-center"
              id="lightbox-zoom-container"
            >
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="max-h-[80vh] w-auto object-contain select-none p-2"
                referrerPolicy="no-referrer"
              />

              {/* Close triggers */}
              <button
                onClick={() => setShowZoomModal(false)}
                className="absolute top-4 right-4 bg-neutral-900/40 text-white p-3 rounded-full hover:bg-neutral-900 transition-all cursor-pointer"
                id="lightbox-zoom-close"
              >
                <span>✕</span>
              </button>

              <div className="absolute bottom-4 inset-x-4 bg-neutral-900/85 backdrop-blur-md p-4 text-center text-white rounded-xl">
                <p className="font-serif text-sm uppercase font-light tracking-wide">{product.name}</p>
                <p className="text-[10px] text-neutral-300 font-mono tracking-widest mt-0.5">
                  Finition {activeColorName} • {product.price} DZD
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
