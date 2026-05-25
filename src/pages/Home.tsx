import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Star, Heart, Award, Shield, Check, StarOff, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export const Home: React.FC = () => {
  const { products, navigateTo, setSelectedCategory, currentTheme } = useApp();

  // Pick top 4 best sellers
  const featuredProducts = products.slice(0, 4);

  // List of high-end testimonial stories
  const reviews = [
    {
      name: 'Victoire de Castellane',
      role: 'Collectionneuse',
      location: 'Genève',
      comment: '« Maison Aura a transcendé la maroquinerie traditionnelle. J’ai acquis L’Ovo Sculptural, c’est autant une sculpture minimaliste qu’un objet utilitaire parfait. Le service de livraison privée dans l’écrin scellé à la cire est fantastique. »',
      rating: 5
    },
    {
      name: 'Isabelle Adjani',
      role: 'Actrice',
      location: 'Paris',
      comment: '« L’Aura Classique m’accompagne partout, de jour en séances comme en soirées de gala. La patine du cuir de Toscane s’embellit au fil des mois de façon remarquable. Une ode absolue aux artisans français et italiens. »',
      rating: 5
    },
    {
      name: 'Alexandre M.',
      role: 'Directeur Artistique',
      location: 'Milan',
      comment: '« Offert à mon épouse pour son anniversaire, l’authenticité transmise dépasse toutes les espérances. Les détails de la métallerie plaquée or 24 carats témoignent d’une précision et d’une intégrité de création hors norme. »',
      rating: 5
    }
  ];

  const categories = [
    {
      name: 'Sacs de luxe',
      tagline: 'Des silhouettes d’art et pièces numérotées.',
      img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop'
    },
    {
      name: 'Sacs à main',
      tagline: 'L’élégance urbaine aux proportions divines.',
      img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400&auto=format&fit=crop'
    },
    {
      name: 'Sacs de voyage',
      tagline: 'Des intemporels de voyage prêts pour l’aventure.',
      img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop'
    },
    {
      name: 'Sacs fashion',
      tagline: 'Des créations audacieuses et textures sensuelles.',
      img: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=400&auto=format&fit=crop'
    }
  ];

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    navigateTo('shop');
  };

  return (
    <div className="w-full" id="home-page-container">
      
      {/* SECTION 1: Editorial Magazine Hero Section */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#F5F2ED]">
        
        {/* Background image overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
            alt="Maison Aura Haute Couture"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 object-center scale-105 animate-[pulse_8s_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-transparent to-black/10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[10px] tracking-[0.4em] uppercase font-mono text-[#BF986B] font-bold"
          >
            ATELIER MAISON AURA • MONACO & FLORENCE
          </motion.span>

          {/* Large Editorial Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[44px] sm:text-[76px] lg:text-[96px] leading-[0.95] text-[#2C2621] font-light uppercase tracking-tight mt-6"
          >
            Matériel <br className="sm:hidden" />
            <span className="font-serif italic text-[#BF986B]">Sculptural</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xs sm:text-sm text-[#7D7670] mt-6 tracking-widest max-w-md uppercase font-sans leading-relaxed"
          >
            Sacs d’exception, coupés d’un seul tenant de cuir précieux, édités de manière confidentielle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-12 w-full justify-center"
          >
            <button
              onClick={() => navigateTo('shop')}
              className="px-8 py-4 bg-[#141414] text-white hover:bg-[#BF986B] text-[10px] uppercase font-mono font-bold tracking-[0.2em] rounded-full transition-all flex items-center gap-2 group shadow-xl hover:shadow-2xl cursor-pointer"
              id="hero-shop-all"
            >
              Découvrir la collection
              <ArrowRight size={12} className="group-hover:translate-x-1.5 transition-transform" />
            </button>
            
            <button
              onClick={() => handleCategoryClick('Sacs de luxe')}
              className="px-8 py-4 border border-[#BF986B]/40 hover:border-black text-[10px] uppercase font-mono font-semibold tracking-[0.2em] rounded-full text-neutral-800 transition-all cursor-pointer"
            >
              Éditions Limitées
            </button>
          </motion.div>
        </div>

        {/* Elegant scroll-down element */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[8px] tracking-[0.3em] text-[#7D7670] uppercase font-mono">
            Faire Défiler
          </span>
          <div className="w-[1px] h-10 bg-[#BF986B]/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-[#BF986B] animate-bounce" />
          </div>
        </div>
      </section>

      {/* COMPANION MARQUEE BANNER */}
      <div className="bg-[#141414] text-white py-3 mt-1 overflow-hidden select-none border-y border-neutral-900 relative">
        <div className="flex gap-40 whitespace-nowrap animate-[marquee_25s_linear_infinite] uppercase text-[9px] font-mono tracking-[0.25em]">
          <span>✨ Livraison express offerte dans le monde entier</span>
          <span>💎 Un de nos sacs d'art acheté = Une plaque d'or gravable offerte</span>
          <span>🎒 Nouvelles collections d'escapades en cuir végétal</span>
          <span>✨ Livraison express offerte dans le monde entier</span>
          <span>💎 Un de nos sacs d'art acheté = Une plaque d'or gravable offerte</span>
        </div>
      </div>

      {/* SECTION 2: Categories curation */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-[10px] tracking-[0.25em] text-[#BF986B] font-mono uppercase bg-[#BF986B]/10 px-3 py-1 rounded-full">
            Collections Préférées
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-[#2C2621] uppercase mt-4 tracking-wider">
            L’art de la silhouette
          </h2>
          <p className="text-xs text-neutral-400 mt-2 font-mono tracking-widest max-w-md">
            Trouvez le compagnon de cuir idéal façonné par collection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              onClick={() => handleCategoryClick(cat.name)}
              className="group cursor-pointer flex flex-col bg-white overflow-hidden rounded-2xl shadow-sm border border-neutral-100 hover:shadow-xl hover:border-neutral-200/50 transition-all text-center p-5"
              id={`category-item-${idx}`}
            >
              <div className="aspect-[4/3] w-full rounded-xl overflow-hidden relative bg-neutral-100">
                <img
                  src={cat.img}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#141414]/10 group-hover:bg-transparent transition-colors duration-300" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#2C2621] mt-5 uppercase">
                {cat.name}
              </h3>
              <p className="text-[11px] text-[#7D7670] mt-1 font-sans px-2">
                {cat.tagline}
              </p>
              <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#BF986B] mt-4 flex items-center justify-center gap-1 group-hover:gap-2.5 transition-all">
                Explorer <ArrowRight size={10} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Best Sellers Products */}
      <section className="py-20 bg-neutral-50/50 border-y border-neutral-100/70">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Header row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
            <div className="text-center md:text-left">
              <span className="text-[10px] tracking-[0.25em] text-[#BF986B] font-mono uppercase">
                Choix de la Saison
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-neutral-800 uppercase mt-2">
                Les pièces emblématiques
              </h2>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('Tous');
                navigateTo('shop');
              }}
              className="text-xs uppercase tracking-[0.2em] font-mono font-bold text-neutral-800 hover:text-[#BF986B] flex items-center gap-1.5 transition-all border-b border-black hover:border-[#BF986B] pb-1 cursor-pointer"
            >
              Voir toute la boutique
              <ArrowRight size={12} />
            </button>
          </div>

          {/* Core products grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Studio craft premium feature */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Images overlapping collage */}
        <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px]">
          <div className="w-[70%] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl relative z-10 border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop"
              alt="Luxe bags handmade"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="w-[50%] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl absolute -left-2 bottom-4 z-0 border-4 border-white hidden sm:block">
            <img
              src="https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop"
              alt="Luxe backpacks leather"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Circular badge */}
          <div className="absolute right-6 top-8 z-20 bg-white/95 backdrop-blur-md p-6 rounded-full shadow-2xl border border-[#EAE2D8] flex flex-col items-center justify-center w-28 h-28 aspect-square">
            <Compass size={22} className="text-[#BF986B] animate-spin-slow mb-1" />
            <span className="text-[8px] font-mono tracking-widest uppercase text-center font-bold text-[#2C2621]">
              ITALIE <br /> ATELIER
            </span>
          </div>
        </div>

        {/* Right Side: Fine Art description */}
        <div className="lg:col-span-6 flex flex-col gap-6 lg:pl-6">
          <span className="text-[10px] tracking-[0.3em] font-mono text-[#BF986B] uppercase font-bold">
            NOTRE SAVOIR-FAIRE
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-[#2C2621] uppercase leading-tight">
            L’art secret de l’Atelier Aura
          </h2>
          <p className="text-sm text-neutral-600 font-sans leading-relaxed">
            Chaque création signée Maison Aura prend naissance au cœur de notre atelier florentin. Nous sélectionnons uniquement des peaux de qualité supérieure, issues de tanneries familiales certifiées et éco-responsables.
          </p>
          <p className="text-xs text-neutral-500 font-mono tracking-wide leading-relaxed">
            Nos métaux sont coulés dans du laiton brut, puis rehaussés d'un placage or fin 24K appliqué d'un coup de pinceau millimétré. C'est cette alliance d'éthique, de patience extrême et d'audace contemporaine qui confère à nos sacs leur aura légendaire.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs font-serif italic text-[#2C2621]">
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-full bg-[#BF986B]/10 text-[#BF986B]">
                <Check size={14} />
              </div>
              Cuirs grainés d’origine certifiée
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-full bg-[#BF986B]/10 text-[#BF986B]">
                <Check size={14} />
              </div>
              Métallerie coulée or fin 24K
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-full bg-[#BF986B]/10 text-[#BF986B]">
                <Check size={14} />
              </div>
              Numérotations & séries limitées
            </div>
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-full bg-[#BF986B]/10 text-[#BF986B]">
                <Check size={14} />
              </div>
              Garantie à vie exclusive Aura
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Luxury Testimonials */}
      <section className="py-24 bg-[#FCFAF7] border-t border-neutral-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-neutral-400 font-mono tracking-[0.3em] uppercase text-[10px]">
            TÉMOIGNAGES CLIENTS
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-neutral-800 uppercase mt-2 mb-12 tracking-wide">
            L’expérience vécue par nos initiés
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, index) => (
              <div key={index} className="flex flex-col gap-4 text-left p-6 bg-white rounded-2xl border border-neutral-100 shadow-sm relative">
                <div className="flex items-center text-amber-500 gap-0.5">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} size={12} fill="#BF986B" className="text-[#BF986B]" />
                  ))}
                </div>
                <p className="text-xs italic text-neutral-600 font-sans leading-relaxed flex-1">
                  {rev.comment}
                </p>
                <div className="pt-4 border-t border-neutral-50 flex flex-col gap-0.5 mt-auto">
                  <span className="text-xs font-semibold text-neutral-800 uppercase tracking-wider font-sans">
                    {rev.name}
                  </span>
                  <span className="text-[9px] text-neutral-400 font-mono uppercase tracking-wider">
                    {rev.role} • {rev.location}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
