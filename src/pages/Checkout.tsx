import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const Checkout: React.FC = () => {
  const {
    cart,
    addOrder,
    clearCart,
    navigateTo,
    showToast,
  } = useApp();

  if (cart.length === 0) {
    navigateTo('cart');
  }

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [discountMultiplier, setDiscountMultiplier] = useState(1);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const taxAmount = Math.round(subtotal * 0.05 * 100) / 100;
  const deliveryExpense = subtotal >= 300 ? 0 : 25;

  const discountAmount = useMemo(() => {
    if (!isCouponApplied) return 0;
    return Math.round(subtotal * 0.1 * 100) / 100;
  }, [isCouponApplied, subtotal]);

  const rawFinalPrice = subtotal + taxAmount + deliveryExpense - discountAmount;
  const finalPrice = Math.max(0, Math.round(rawFinalPrice * 100) / 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'MV10') {
      setIsCouponApplied(true);
      setDiscountMultiplier(0.9);
      showToast('Code promo "MV10" appliqué : 10% de réduction immédiate !', 'success');
    } else {
      showToast('Ce code de réduction n\'existe pas.', 'error');
    }
  };

  const handleFinalOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !city || !postal) {
      showToast('Veuillez remplir l\'ensemble des informations de livraison.', 'error');
      return;
    }

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      color: item.selectedColor,
      image: item.product.images[0]
    }));

    const registeredOrder = await addOrder({
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      address,
      city,
      postalCode: postal,
      items: orderItems,
      totalPrice: finalPrice,
      paymentMethod: 'delivery'
    });

    clearCart();
    navigateTo('dashboard', { view: 'orders', highlight: registeredOrder.id });
    showToast(`Merci pour votre confiance. Commande ${registeredOrder.id} validée.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 min-h-screen" id="checkout-root-wrapper">
      
      <div className="pt-8 pb-12 text-center md:text-left">
        <span className="text-[10px] tracking-[0.25em] text-[#BF986B] font-mono uppercase">
          PROCESSUS SECURED CHECKOUT
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-light text-neutral-800 uppercase mt-1 tracking-wider">
          Validation d'\u00c9crin
        </h1>
        <p className="text-xs text-neutral-400 mt-2 font-mono tracking-widest max-w-sm">
          Saisissez vos coordonn\u00e9es de livraison priv\u00e9e et effectuez votre r\u00e8glement crypt\u00e9.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <div className="lg:col-span-7">
          <form onSubmit={handleFinalOrderSubmit} className="flex flex-col gap-8">
            
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-100 shadow-sm flex flex-col gap-4">
              <h2 className="font-serif text-lg uppercase tracking-wide text-neutral-800 border-b border-neutral-100 pb-3">
                01 \u2022 Adresse de livraison scell\u00e9e
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold">
                    Pr\u00e9nom & Nom du destinataire
                  </label>
                  <input
                    type="text"
                    placeholder="Aim\u00e9e de Beauvoir"
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
                    T\u00e9l\u00e9phone personnel (Suivi Express)
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
                    Rue & Num\u00e9ro d'immeuble
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

            <div className="bg-white p-6 md:p-8 rounded-2xl border border-neutral-100 shadow-sm">
              <h2 className="font-serif text-lg uppercase tracking-wide text-neutral-800 border-b border-neutral-100 pb-3 mb-4">
                02 \u2022 Mode de paiement
              </h2>
              <div className="p-6 bg-amber-50/60 rounded-xl border border-amber-200/60 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-neutral-800">Paiement \u00e0 la livraison</h3>
                    <p className="text-xs text-neutral-500 font-sans mt-0.5">
                      Vous r\u00e9glez directement \u00e0 la r\u00e9ception de votre commande
                    </p>
                  </div>
                </div>
                <div className="text-xs text-neutral-600 font-sans leading-relaxed pl-11">
                  Notre livreur priv\u00e9 se pr\u00e9sentera \u00e0 l'adresse indiqu\u00e9e avec votre \u00e9crin scell\u00e9. 
                  Vous pourrez inspecter votre article avant de proc\u00e9der au paiement en esp\u00e8ces 
                  ou par carte bancaire. Aucun frais suppl\u00e9mentaire.
                </div>
                <div className="pl-11 flex items-center gap-2 text-[10px] text-emerald-700 font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Paiement \u00e0 la livraison uniquement
                </div>
              </div>
            </div>

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
                Confirmer l'empreinte & R\u00e9gler
                <ArrowRight size={12} />
              </button>
            </div>

          </form>
        </div>

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
                      Qt\u00e9: {item.quantity} \u2022 Finition <span className="inline-block w-2 h-2 rounded-full align-middle border border-white mx-0.5" style={{ backgroundColor: item.selectedColor }} />
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold shrink-0">{item.product.price * item.quantity} DZD</span>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 pt-5">
            <span className="text-[9px] uppercase tracking-widest text-[#BF986B] font-mono font-bold block mb-2">
              Code Privil\u00e8ge / Carte Cadeau
            </span>
            <form onSubmit={handleApplyCoupon} className="flex gap-1.5">
              <input
                type="text"
                placeholder="Ex: MV10 (10% de r\u00e9duction)"
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
                ✓ Code de r\u00e9duction MV10 appliqu\u00e9 (-10% sur les articles) !
              </p>
            )}
          </div>

          <div className="border-t border-neutral-200 pt-5 flex flex-col gap-3.5 font-mono text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Sous-total boutique :</span>
              <span>{subtotal} DZD</span>
            </div>

            {isCouponApplied && (
              <div className="flex justify-between text-emerald-600">
                <span>Remise privil\u00e8ge (10%) :</span>
                <span>-{discountAmount} DZD</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Assurances & Taxes (5%) :</span>
              <span>{taxAmount} DZD</span>
            </div>

            <div className="flex justify-between">
              <span>Livraison express \u00e0 domicile :</span>
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
            <span>Votre souscription comprend la garantie \u00e0 vie de la m\u00e9tallerie et notre charte d'\u00e9thique de tannerie.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
