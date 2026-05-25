import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'bag_1',
    name: 'L’Aura Classique',
    category: 'Sacs de luxe',
    description: 'Une icône de la Maison. Confectionné dans un cuir de veau grainé au toucher soyeux, ce sac structuré arbore des proportions parfaites pour le jour comme pour la nuit. Ses finitions dorées à l’or fin 24K en font un objet de pur désir.',
    price: 950,
    oldPrice: 1200,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 8,
    isNew: true,
    isPromo: true,
    colors: ['#8c6239', '#141414', '#e2ceb8'],
    colorNames: ['Cognac Chaud', 'Noir Ébène', 'Sable Doux'],
    features: [
      'Cuir de veau de Toscane tanné de manière végétale',
      'Doublure intérieure en daim de chèvre rouge impérial',
      'Fermoir exclusif poinçonné MV LUXURY',
      'Bandoulière amovible et ajustable',
      'Fabriqué entièrement à la main en Italie'
    ],
    specifications: {
      'Dimensions': '24 x 18 x 9.5 cm',
      'Poids': '550g',
      'Longueur bandoulière': '52 cm - 62 cm',
      'Poches': '1 grand compartiment zippé, 2 fentes cartes',
      'Métallerie': 'Laiton massif plaqué or 24 carats'
    }
  },
  {
    id: 'bag_2',
    name: 'Le Cabas Horizon',
    category: 'Sacs à main',
    description: 'Minimaliste, spacieux et infiniment léger. Le Cabas Horizon redéfinit l’élégance quotidienne. Pensé pour la femme active, il accueille aisément un ordinateur 13 pouces ainsi que vos objets précieux, tout en conservant une silhouette gracieuse.',
    price: 490,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
    ],
    stock: 15,
    isNew: false,
    colors: ['#e2ceb8', '#141414', '#1f3a52'],
    colorNames: ['Beige Crème', 'Noir Satin', 'Bleu Horizon'],
    features: [
      'Cuir de vachette pleine fleur grain de riz',
      'Compartiment central renforcé pour tablette/ordinateur',
      'Double anse en cuir roulé pour un confort d’épaule exceptionnel',
      'Pieds de fond métalliques de protection',
      'Fait main en Espagne'
    ],
    specifications: {
      'Dimensions': '36 x 28 x 15 cm',
      'Poids': '780g',
      'Hauteur des anses': '24 cm',
      'Fermeture': 'Aimantée ultra-puissante en cuir',
      'Capacité': '14 Litres'
    }
  },
  {
    id: 'bag_3',
    name: 'L’Échappée Weekend',
    category: 'Sacs de voyage',
    description: 'Le compagnon idéal de vos escapades d’exception. Confectionné dans un cuir de boeuf héritage robuste, il patine magnifiquement avec le temps, racontant le récit de vos voyages. Un parfait équilibre entre fonctionnalité athlétique et prestige.',
    price: 750,
    oldPrice: 890,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 3,
    isNew: false,
    isPromo: true,
    colors: ['#5a3a1f', '#141414'],
    colorNames: ['Chocolat Écorce', 'Noir Tempête'],
    features: [
      'Cuir huilé étanche de haute résistance',
      'Grand compartiment principal avec ouverture en valise',
      'Poche latérale ventilée pour souliers de voyage',
      'Plaque d’identification en laiton gravable',
      'Taille bagage cabine certifiée'
    ],
    specifications: {
      'Dimensions': '48 x 28 x 25 cm',
      'Poids': '1.4 kg',
      'Capacité': '34 Litres',
      'Fermetures': 'Double fermeture Éclair YKK en laiton brossé',
      'Origine': 'Atelier de Florence, Italie'
    }
  },
  {
    id: 'bag_4',
    name: 'Le Minuit Clutch',
    category: 'Sacs fashion',
    description: 'Petit format, grand raffinement. Cette pochette à l’allure asymétrique et rebondie se glisse sous le bras ou se porte en crossbody grâce à sa chaîne en maille gourmette. Son cuir plissé apporte une texture sensuelle et contemporaine.',
    price: 320,
    rating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 12,
    isNew: true,
    colors: ['#141414', '#b83b3b', '#ccaa44'],
    colorNames: ['Noir Onyx', 'Aura Carmin', 'Champagne Métal'],
    features: [
      'Cuir nappa souple de mouton',
      'Chaîne gourmette dorée polie amovible',
      'Fermeture à charnière dorée vintage',
      'Intérieur logoté en soie jacquard noire'
    ],
    specifications: {
      'Dimensions': '20 x 12 x 8 cm',
      'Poids': '300g',
      'Longueur chaîne': '110 cm',
      'Détails': 'Peut contenir de grands smartphones'
    }
  },
  {
    id: 'bag_5',
    name: 'L’Ovo Sculptural',
    category: 'Sacs de luxe',
    description: 'Une véritable œuvre d’art portative. Sa forme ovale unique et futuriste est dessinée à partir d’une seule pièce de cuir de sellerie thermoformatée. Captivant tous les regards, c’est l’expression ultime de l’artisanat d’art d’avant-garde.',
    price: 1100,
    rating: 5.0,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc15a7a5?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 2,
    isNew: true,
    colors: ['#142b44', '#cc9933'],
    colorNames: ['Bleu Minuit', 'Or Miroir'],
    features: [
      'Cuir de sellerie de vachette rigide moulé sous presse',
      'Bords teintés en noir d’encre à la main (5 couches)',
      'Intérieur habillé d’Alcantara velouté beige',
      'Numéroté individuellement sous la base'
    ],
    specifications: {
      'Dimensions': '22 x 16 x 8 cm',
      'Poids': '420g',
      'Type': 'Sac rigide structureel',
      'Détail unique': 'Gravure exclusive au fer à chaud'
    }
  },
  {
    id: 'bag_6',
    name: 'Le Studio Minimal',
    category: 'Sacs de luxe',
    description: 'L’équilibre ultime entre vintage et modernité. Sa silhouette baguette épurée rappelle le glamour parisien des années 90, remis au goût du jour. Se porte court sous l’aisselle pour une allure chic, confiante et minimaliste.',
    price: 420,
    rating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 20,
    isNew: false,
    colors: ['#a82020', '#141414', '#e2ceb8'],
    colorNames: ['Rouge Cerise', 'Noir Vintage', 'Crème de Lin'],
    features: [
      'Cuir verni de haute qualité avec reflets de lumière miroirs',
      'Rabat asymétrique aimanté signature',
      'Anse de transport large extrêmement agréable',
      'Doublure en lin naturel bio'
    ],
    specifications: {
      'Dimensions': '26 x 14 x 6 cm',
      'Poids': '390g',
      'Hauteur de l’anse': '21 cm',
      'Poches': '1 poche intérieure plaquée'
    }
  },
  {
    id: 'bag_7',
    name: 'L’Aventurier Urbain',
    category: 'Sacs scolaires',
    description: 'Un sac à dos d’ingénieur habillé par un créateur. Pensé avec un minimalisme scandinave, il intègre des détails luxueux en cuir et est fabriqué dans une toile de nylon balistique déperlante mate d’une solidité impénétrable. Parfait pour les études supérieures et les journées bien remplies.',
    price: 240,
    rating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 5,
    isNew: false,
    colors: ['#e2ceb8', '#3c3c3c'],
    colorNames: ['Gris Ciment', 'Anthracite Absolu'],
    features: [
      'Toile recyclée haut de gamme résistante à l’eau',
      'Finitions et lanières en cuir de vachette végétal',
      'Poche arrière secrète pour passeport et documents',
      'Manchon arrière pour l’insérer sur une valise trolley'
    ],
    specifications: {
      'Dimensions': '40 x 30 x 14 cm',
      'Poids': '850g',
      'Volume': '18 Litres',
      'Compartiment laptop': 'Jusqu’à 15.6 pouces rembourré double densité'
    }
  },
  {
    id: 'bag_8',
    name: 'Météorite Solaire',
    category: 'Sacs fashion',
    description: 'Une déclaration de style audacieuse et solaire. Ce cabas d’été chic associe l’art du tressage de paille de palmier naturelle et des empiècements en cuir de vachette jaune vif de première qualité. Léger, estival, absolument inoubliable.',
    price: 380,
    oldPrice: 450,
    rating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc15a7a5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?q=80&w=800&auto=format&fit=crop'
    ],
    stock: 1, // Alerte stock faible !
    isPromo: true,
    colors: ['#e4b73b', '#e2ceb8'],
    colorNames: ['Jaune Safran', 'Paille Naturelle'],
    features: [
      'Paille premium tressée main par des coopératives de femmes',
      'Angles, sangles et écusson en cuir de veau souple',
      'Pochette amovible en lin intérieur pour vos effets personnels',
      'Lien de serrage pour fermer le sac de manière sécurisée'
    ],
    specifications: {
      'Dimensions': '32 x 22 x 12 cm',
      'Poids': '460g',
      'Entretien': 'Brosser doucement à sec',
      'Édition': 'Série ultra limitée'
    }
  }
];

export const AVAILABLE_THEMES = [
  {
    id: 'aura-luxe',
    name: 'Aura Luxe (Or & Beige)',
    bgPage: 'bg-[#FAF8F5]',
    bgPageHex: '#FAF8F5',
    textPrimary: 'text-[#2C2621]',
    textPrimaryHex: '#2C2621',
    textMuted: 'text-[#7D7670]',
    textMutedHex: '#7D7670',
    accent: '#BF986B', // Golden bronze
    accentHover: '#A88056',
    cardBg: 'bg-white',
    cardBgHex: '#ffffff',
    border: 'border-[#EAE2D8]',
    borderHex: '#EAE2D8',
    nudeTint: 'bg-[#F2EDD9]/30',
    nudeTintHex: 'rgba(242, 237, 217, 0.3)',
  },
  {
    id: 'classic-noir',
    name: 'Monochrome Noir / Blanc',
    bgPage: 'bg-neutral-50',
    bgPageHex: '#f9f9f9',
    textPrimary: 'text-neutral-900',
    textPrimaryHex: '#171717',
    textMuted: 'text-neutral-500',
    textMutedHex: '#737373',
    accent: '#171717', // Elegant Noir
    accentHover: '#404040',
    cardBg: 'bg-white',
    cardBgHex: '#ffffff',
    border: 'border-neutral-200',
    borderHex: '#e5e5e5',
    nudeTint: 'bg-neutral-100',
    nudeTintHex: '#f5f5f5',
  },
  {
    id: 'nude-silk',
    name: 'Soie Nude & Bronze',
    bgPage: 'bg-[#FBF7F5]',
    bgPageHex: '#FBF7F5',
    textPrimary: 'text-[#3E2B25]',
    textPrimaryHex: '#3E2B25',
    textMuted: 'text-[#8E7870]',
    textMutedHex: '#8E7870',
    accent: '#E09C84', // Soft warm nude coral
    accentHover: '#C67E67',
    cardBg: 'bg-white',
    cardBgHex: '#ffffff',
    border: 'border-[#F1E4DF]',
    borderHex: '#F1E4DF',
    nudeTint: 'bg-[#F5ECE8]',
    nudeTintHex: '#F5ECE8',
  },
  {
    id: 'emerald-royal',
    name: 'Émeraude Impériale',
    bgPage: 'bg-[#F4F6F4]',
    bgPageHex: '#F4F6F4',
    textPrimary: 'text-[#1B2D26]',
    textPrimaryHex: '#1B2D26',
    textMuted: 'text-[#647C72]',
    textMutedHex: '#647C72',
    accent: '#D0A352', // Gold
    accentHover: '#1B473A', // Emerald green
    cardBg: 'bg-white',
    cardBgHex: '#ffffff',
    border: 'border-[#E2ECE8]',
    borderHex: '#E2ECE8',
    nudeTint: 'bg-[#E5EEEB]',
    nudeTintHex: '#E5EEEB',
  }
];
