import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Send, Instagram, Facebook, Compass, HelpCircle, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { showToast, currentTheme } = useApp();
  const [emailInput, setEmailInput] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    
    // Simulate luxury invitation
    showToast('Félicitations ! Vous êtes inscrit(e) aux invitations privées MV LUXURY.', 'success');
    setEmailInput('');
  };

  return (
    <footer className="bg-[#141414] text-white pt-20 pb-10 border-t border-neutral-900" id="main-app-footer">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Top Split Sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-neutral-800">
          
          {/* Brand Philosophy */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <h3 className="font-serif text-2xl tracking-[0.25em] font-light">MV LUXURY</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-sans max-w-sm">
              Artisanat d’exception, matières rigoureusement sélectionnées et designs sculpturaux. Notre vision de la haute maroquinerie transcende les générations.
            </p>
            <div className="flex items-center gap-3 mt-4 text-neutral-400">
              <a href="#" className="hover:text-white transition-colors p-1" title="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="hover:text-white transition-colors p-1" title="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="hover:text-white transition-colors p-1" title="Discover">
                <Compass size={16} />
              </a>
            </div>
          </div>

          {/* Links Collection 1 */}
          <div>
            <h4 className="font-serif text-sm tracking-[0.1em] text-neutral-200 uppercase mb-5 font-semibold">Boutique & Collection</h4>
            <ul className="flex flex-col gap-3 text-xs text-neutral-400 font-sans">
              <li><a href="#shop" className="hover:text-white hover:translate-x-1 inline-block transition-all">Sacs de luxe</a></li>
              <li><a href="#shop" className="hover:text-white hover:translate-x-1 inline-block transition-all">Sacs à main</a></li>
              <li><a href="#shop" className="hover:text-white hover:translate-x-1 inline-block transition-all">Pochettes & Clutches</a></li>
              <li><a href="#shop" className="hover:text-white hover:translate-x-1 inline-block transition-all">Éditions Limitées</a></li>
              <li><a href="#shop" className="hover:text-white hover:translate-x-1 inline-block transition-all">Tous les sacs</a></li>
            </ul>
          </div>

          {/* Links Collection 2 */}
          <div>
            <h4 className="font-serif text-sm tracking-[0.1em] text-neutral-200 uppercase mb-5 font-semibold">Service Client</h4>
            <ul className="flex flex-col gap-3 text-xs text-neutral-400 font-sans">
              <li className="flex items-center gap-1"><HelpCircle size={12} /> <a href="#" className="hover:text-white">Aide & Contact</a></li>
              <li className="flex items-center gap-1"><ShieldCheck size={12} /> <a href="#" className="hover:text-white">Garantie & Authenticité</a></li>
              <li><a href="#" className="hover:text-white">Retours & Échanges sous 30 jours</a></li>
              <li><a href="#" className="hover:text-white">Guide d’entretien du cuir</a></li>
              <li><a href="#" className="hover:text-white">Livraison Express Offerte</a></li>
            </ul>
          </div>

          {/* Luxury Newsletter Join */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif text-sm tracking-[0.1em] text-neutral-200 uppercase mb-2 font-semibold">Le Club Privé</h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              Inscrivez-vous pour recevoir les invitations aux préventes, l’accès aux éditions numérotées et les coulisses de l’atelier.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5 mt-2 max-w-sm relative">
              <input
                type="email"
                placeholder="Votre adresse email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-neutral-800 text-xs px-4 py-3 rounded-lg focus:outline-none focus:border-[#BF986B] text-neutral-200 font-sans placeholder-neutral-500"
                required
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3.5 bg-[#BF986B]/25 hover:bg-[#BF986B] text-white rounded-md transition-all flex items-center justify-center cursor-pointer"
                title="S’inscrire"
                id="newsletter-btn"
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright & payment icons */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-10 text-[10px] text-neutral-500 font-sans tracking-widest uppercase">
          <p>
            MV LUXURY © {new Date().getFullYear()}. Confectionné de manière éthique et durable.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>Apple Pay</span>
            <span>Paypal</span>
            <span className="text-[#BF986B]">Artisanat Certifié</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
