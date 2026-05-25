import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, CheckCircle, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Checkout: React.FC = () => {
  const {
    cart,
    addOrder,
    clearCart,
    navigateTo,
    showToast,
    currentTheme
  } = useApp();

  // Redirect if basket is empty
  if (cart.length === 0) {
    navigateTo('cart');
  }

  // Delivery state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');

  // Payment method
  const [payMethod] = useState<'delivery'>('delivery');

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [discountMultiplier, setDiscountMultiplier] = useState(1); // 1 = 0% discount

  // Sum calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const taxAmount = Math.round(subtotal * 0.05 * 100) / 100;
  const deliveryExpense = subtotal >= 300 ? 0 : 25;

  const discountAmount = useMemo(() => {
    if (!isCouponApplied) return 0;
    return Math.round(subtotal * 0.1 * 100) / 100; // 10% off
  }, [isCouponApplied, subtotal]);

  const rawFinalPrice = subtotal + taxAmount + deliveryExpense - discountAmount;
  const finalPrice = Math.max(0, Math.round(rawFinalPrice * 100) / 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'MV10') {
      setIsCouponApplied(true);
      setDiscountMultiplier(0.9); // 10%
      showToast('Code promo "MV10" appliqué : 10% de réduction immédiate !', 'success');
    } else {
      showToast('Ce code de réduction n’existe pas.', 'error');
    }
  };

  const handleFinalOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !city || !postal) {
      showToast('Veuillez remplir l’ensemble des informations de livraison.', 'error');
      return;
    }

    // Prepare items schema structure
    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      color: item.selectedColor,
      image: item.product.images[0]
    }));

    // Trigger order dispatch context
    const registeredOrder = addOrder({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      address,
      city,
      postalCode: postal,
      items: orderItems,
      totalPrice: finalPrice,
      paymentMethod: payMethod
    });

    // Clear Basket
    clearCart();

    // Transition directly to orders management list or standard success congrats screen!
    navigateTo('dashboard', { view: 'orders', highlight: registeredOrder.id });
    showToast(`Merci pour votre confiance. Commande ${registeredOrder.id} validée.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 min-h-screen" id="checkout-root-wrapper">
      
      {/* Editorial Title */}
      <div className="pt-8 pb-12 text-center md:text-left">
        <span className="text-[10px] tracking-[0.25em] text-[#BF986B] font-mono uppercase">
          PROCESSUS SECURED CHECKOUT
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-light text-neutral-800 uppercase mt-1 tracking-wider">
          Validation d’Écrin
        </h1>
        <p className="text-xs text-neutral-400 mt-2 font-mono tracking-widest max-w-sm">
          Saisissez vos coordonnées de livraison privée et effectuez votre règlement crypté.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Delivery and Bank inputs form validation */}
        <div className="lg:col-span-7">
          <form onSubmit={handleFinalOrderSubmit} className="flex flex-col gap-8">
            
            {/* Delivery address details card */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-100 shadow-sm flex flex-col gap-4">
              <h2 className="font-serif text-lg uppercase tracking-wide text-neutral-800 border-b border-neutral-100 pb-3">
                01 • Adresse de livraison scellée
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                    Prénom & Nom du destinataire
                  </label>
                  <input
                    type="text"
                    placeholder="Aimée de Beauvoir"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#FAF8F5]/50 border text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-neutral-900"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                    Adresse Courriel
                  </label>
                  <input
                    type="email"
                    placeholder="aimee.beauvoir@icloud.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#FAF8F5]/50 border text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-neutral-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                    Téléphone personnel (Suivi Express)
                  </label>
                  <input
                    type="tel"
                    placeholder="+213 6 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-[#FAF8F5]/50 border text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-neutral-900"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                    Rue & Numéro d'immeuble
                  </label>
                  <input
                    type="text"
                    placeholder="12 Avenue Montaigne"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-[#FAF8F5]/50 border text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-neutral-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                    Ville de destination
                  </label>
                  <input
                    type="text"
                    placeholder="Paris"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-[#FAF8F5]/50 border text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-neutral-900"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                    Code Postal
                  </label>
                  <input
                    type="text"
                    placeholder="75008"
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    className="bg-[#FAF8F5]/50 border text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-neutral-900"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Paiement à la livraison */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-100 shadow-sm flex flex-col gap-4">
              <h2 className="font-serif text-lg uppercase tracking-wide text-neutral-800 border-b border-neutral-100 pb-3">
                02 • Mode de paiement
              </h2>
              <div className="p-6 bg-amber-50/60 rounded-xl border border-amber-200/60 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-neutral-800">Paiement à la livraison</h3>
                    <p className="text-xs text-neutral-500 font-sans mt-0.5">
                      Vous réglez directement à la réception de votre commande
                    </p>
                  </div>
                </div>
                <div className="text-xs text-neutral-600 font-sans leading-relaxed pl-11">
                  Notre livreur privé se présentera à l'adresse indiquée avec votre écrin scellé. 
                  Vous pourrez inspecter votre article avant de procéder au paiement en espèces 
                  ou par carte bancaire. Aucun frais supplémentaire.
                </div>
                <div className="pl-11 flex items-center gap-2 text-[10px] text-emerald-700 font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Option sélectionnée par défaut
                </div>
              </div>
            </div>

              {/* Collapsible banking validation fields */}
              <AnimatePresence mode="wait">
                {payMethod === 'card' ? (
                  <motion.div
                    key="card-pane"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-4 mt-4"
                  >
                    
                    {/* Visual Card preview */}
                    <div className="aspect-[1.58/1] w-full max-w-[340px] bg-gradient-to-tr from-neutral-850 to-neutral-700 text-white p-5 rounded-xl shadow-xl border border-neutral-750 flex flex-col justify-between relative overflow-hidden shrink-0 mx-auto sm:mx-0 select-none">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#BF986B]/15 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[8px] uppercase tracking-widest text-[#BF986B] font-mono font-bold leading-none">
                            ÉCRIN COMPANION CARD
                          </p>
                          <h4 className="font-serif text-sm tracking-widest mt-1 font-light italic">MV LUXURY</h4>
                        </div>
                        <CreditCard size={20} className="text-[#BF986B]" />
                      </div>
                      
                      <p className="font-mono text-base md:text-lg tracking-[0.2em] font-medium my-3 truncate">
                        {cardNumber ? cardNumber : '••••  ••••  ••••  ••••'}
                      </p>

                      <div className="flex justify-between items-end">
                        <div className="min-w-0">
                          <p className="text-[7px] text-neutral-400 font-mono uppercase tracking-widest font-bold">Titulaire</p>
                          <p className="text-xs font-mono tracking-wide truncate max-w-[150px] font-semibold mt-0.5 uppercase">
                            {cardHolder ? cardHolder : 'ALINE DE CHANCEL'}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-[7px] text-neutral-400 font-mono uppercase tracking-widest font-bold">Expiration</p>
                          <p className="text-xs font-mono font-semibold mt-0.5">
                            {cardExpiry ? cardExpiry : 'MM/AA'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Numerical Card Inputs with automatic constraints */}
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                          Numéro de carte de crédit
                        </label>
                        <input
                          type="text"
                          placeholder="4970 8282 0011 2293"
                          value={cardNumber}
                          onChange={(e) => {
                            // limit length and numeric characters
                            const val = e.target.value.replace(/[^\d\s]/g, '').substring(0, 19);
                            setCardNumber(val);
                          }}
                          className="bg-neutral-50 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-neutral-900"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                          Nom du titulaire
                        </label>
                        <input
                          type="text"
                          placeholder="Aline de Chancel"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="bg-neutral-50 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                          Date d'expiration (MM/AA)
                        </label>
                        <input
                          type="text"
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => {
                            const val = e.target.value.substring(0, 5);
                            setCardExpiry(val);
                          }}
                          className="bg-neutral-50 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-neutral-900"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                          Code CVV (3 chiffres)
                        </label>
                        <input
                          type="password"
                          placeholder="•••"
                          value={cardCVV}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').substring(0, 3);
                            setCardCVV(val);
                          }}
                          className="bg-neutral-50 px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                    </div>

                  </motion.div>
                ) : payMethod === 'paypal' ? (
                  <motion.div
                    key="paypal-pane"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-blue-700 leading-relaxed font-sans mt-4"
                  >
                    🚀 Après avoir cliqué sur "Confirmer l’empreinte", vous serez redirigé(e) vers la passerelle sécurisée Paypal® pour authentifier l'empreinte de paiement sans frais additionnels.
                  </motion.div>
                ) : (
                  <motion.div
                    key="delivery-pane"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 text-xs text-amber-800 leading-relaxed font-sans mt-4"
                  >
                    🤝 Réglez commodément à la livraison par carte bancaire ou espèces directement auprès de notre transporteur privé spécialisé lors de la remise sécurisée de votre écrin.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Final Action triggers row */}
            <div className="flex items-center justify-between gap-4 mt-4">
              <button
                type="button"
                onClick={() => navigateTo('cart')}
                className="text-xs uppercase tracking-widest font-mono font-bold text-neutral-500 hover:text-neutral-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft size={12} />
                Retour au Panier
              </button>
              
              <button
                type="submit"
                className="px-8 py-4 bg-neutral-900 font-mono hover:bg-[#BF986B] text-white text-[10px] uppercase font-bold tracking-[0.25em] rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                id="final-submit-order-form"
              >
                Confirmer l'empreinte & Régler
                <ArrowRight size={12} />
              </button>
            </div>

          </form>
        </div>

        {/* Right Side: Product summary and promotions/incentives coupon code */}
        <div className="lg:col-span-4 bg-neutral-50/50 p-6 md:p-8 rounded-2xl border border-neutral-100 flex flex-col gap-6">
          <h3 className="font-serif text-base uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-3">
            Contenu de votre Signature
          </h3>

          <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-3 justify-between items-center text-xs">
                <div className="flex gap-2.5 items-center min-w-0">
                  <div className="w-10 h-12 rounded-lg bg-neutral-100 border overflow-hidden shrink-0">
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif font-semibold text-neutral-800 truncate">{item.product.name}</p>
                    <p className="text-[10px] text-neutral-400 font-mono">
                      Qté: {item.quantity} • Finition <span className="inline-block w-2 h-2 rounded-full align-middle border border-white mx-0.5" style={{ backgroundColor: item.selectedColor }} />
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold shrink-0">{item.product.price * item.quantity} DZD</span>
              </div>
            ))}
          </div>

          {/* Coupon interactive forms coupon applied */}
          <div className="border-t border-neutral-200 pt-5">
            <span className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold block mb-2">
              Code Privilège / Carte Cadeau
            </span>
            <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Ex: MV10 (10% de réduction)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={isCouponApplied}
                className="bg-white border text-xs px-3 py-2 rounded-lg flex-1 outline-none text-neutral-700 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isCouponApplied}
                className="px-4 py-2 bg-neutral-800 text-white hover:bg-black rounded-lg text-[9px] uppercase font-mono tracking-widest font-bold disabled:opacity-40 transition-colors cursor-pointer"
              >
                Appliquer
              </button>
            </form>
            {isCouponApplied && (
              <p className="text-[10px] text-emerald-600 font-mono mt-2 font-semibold">
                ✓ Code de réduction MV10 appliqué (-10% sur les articles) !
              </p>
            )}
          </div>

          {/* Calculation final pricing list */}
          <div className="border-t border-neutral-200 pt-5 flex flex-col gap-3.5 font-mono text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Sous-total boutique :</span>
              <span>{subtotal} DZD</span>
            </div>

            {isCouponApplied && (
              <div className="flex justify-between text-emerald-600">
                <span>Remise privilège (10%) :</span>
                <span>-{discountAmount} DZD</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Assurances & Taxes (5%) :</span>
              <span>{taxAmount} DZD</span>
            </div>

            <div className="flex justify-between">
              <span>Livraison express à domicile :</span>
              {deliveryExpense === 0 ? (
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">Offerte</span>
              ) : (
                <span>{deliveryExpense} DZD</span>
              )}
            </div>

            <div className="flex justify-between text-neutral-800 font-bold text-sm border-t border-neutral-100 pt-3">
              <span>Versement final :</span>
              <span className="text-xl text-neutral-900">{finalPrice} DZD</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border flex gap-2 sm:gap-2.5 items-start mt-1 select-none text-[10px] text-neutral-500">
            <ShieldCheck size={14} className="text-[#BF986B]" />
            <span>Votre souscription comprend la garantie à vie de la métallerie et notre charte d'éthique de tannerie.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
