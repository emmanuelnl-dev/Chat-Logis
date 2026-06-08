const FAMILIES = [
  {
    id: 'peinture-interieure',
    name: 'Peinture Intérieure',
    products: [
      {
        id: 'mur-deco-mat',
        name: 'Mur Déco Mat',
        couleur_pot: '#E8E4DC',
        supports: ['mur', 'plâtre'],
        usages: ['interieur'],
        finitions: ['mat'],
        contenances: ['1L', '5L', '10L'],
        nuancier: [
          { nom: 'Blanc Pur',     hex: '#FFFFFF' },
          { nom: 'Blanc Cassé',   hex: '#F5F0E8' },
          { nom: 'Gris Perle',    hex: '#D8D4CC' },
          { nom: 'Vieux Rose',    hex: '#C8A09A' },
          { nom: 'Bleu Ciel',     hex: '#A8C4D8' },
          { nom: 'Vert Sauge',    hex: '#9AB09A' },
          { nom: 'Jaune Paille',  hex: '#E8DCA0' },
        ],
        sechage: '2h entre couches, recouvrable en 4h',
        rendement: '13m² / L',
        nettoyage: 'Eau et savon',
      },
      {
        id: 'mur-resist-mat',
        name: 'Mur Resist Mat',
        couleur_pot: '#D0CCC8',
        supports: ['mur', 'béton'],
        usages: ['interieur'],
        finitions: ['mat'],
        contenances: ['1L', '5L', '10L'],
        nuancier: [
          { nom: 'Blanc Absolu',  hex: '#FAFAFA' },
          { nom: 'Gris Clair',    hex: '#D0CCC8' },
          { nom: 'Gris Moyen',    hex: '#A8A4A0' },
          { nom: 'Beige Lin',     hex: '#E0D4C0' },
          { nom: 'Taupe',         hex: '#B8A898' },
        ],
        sechage: '2h entre couches, recouvrable en 6h',
        rendement: '14m² / L',
        nettoyage: 'Eau et savon',
      },
      {
        id: 'mur-satine-premium',
        name: 'Mur Satiné Premium',
        couleur_pot: '#F4EFE8',
        supports: ['mur', 'plâtre'],
        usages: ['interieur'],
        finitions: ['satiné'],
        contenances: ['1L', '5L'],
        nuancier: [
          { nom: 'Blanc Nacré',   hex: '#F8F4F0' },
          { nom: 'Ivoire',        hex: '#FFFFF0' },
          { nom: 'Rose Poudré',   hex: '#F0D8D0' },
          { nom: 'Bleu Glacier',  hex: '#C0D8E8' },
          { nom: 'Vert Menthe',   hex: '#C0E0D0' },
          { nom: 'Gris Nuage',    hex: '#E0DCD8' },
        ],
        sechage: '3h entre couches, recouvrable en 6h',
        rendement: '12m² / L',
        nettoyage: 'Eau et savon',
      },
    ],
  },

  {
    id: 'peinture-exterieure-facade',
    name: 'Peinture Extérieure & Façade',
    products: [
      {
        id: 'facade-protect-mat',
        name: 'Façade Protect Mat',
        couleur_pot: '#D4C8A8',
        supports: ['mur', 'béton'],
        usages: ['exterieur'],
        finitions: ['mat'],
        contenances: ['5L', '10L', '20L'],
        nuancier: [
          { nom: 'Blanc Façade',  hex: '#F8F8F8' },
          { nom: 'Crème',         hex: '#FFF8E8' },
          { nom: 'Sable',         hex: '#D8C8A8' },
          { nom: 'Ocre',          hex: '#C8A850' },
          { nom: 'Terracotta',    hex: '#C07050' },
          { nom: 'Gris Pierre',   hex: '#B8B0A8' },
          { nom: 'Gris Ardoise',  hex: '#808888' },
        ],
        sechage: '4h entre couches, recouvrable en 8h',
        rendement: '10m² / L',
        nettoyage: 'Eau et savon',
      },
      {
        id: 'facade-brillance-satine',
        name: 'Façade Brillance Satiné',
        couleur_pot: '#C0D0E0',
        supports: ['mur', 'béton', 'plâtre'],
        usages: ['exterieur'],
        finitions: ['satiné'],
        contenances: ['5L', '10L'],
        nuancier: [
          { nom: 'Blanc Brillant', hex: '#FFFFFF' },
          { nom: 'Gris Clair',    hex: '#D4D0CC' },
          { nom: 'Beige Chaud',   hex: '#E0D0B8' },
          { nom: 'Vieux Rose',    hex: '#C89090' },
          { nom: 'Bleu Provence', hex: '#8090B0' },
        ],
        sechage: '4h entre couches, recouvrable en 12h',
        rendement: '11m² / L',
        nettoyage: 'Eau et savon',
      },
    ],
  },

  {
    id: 'bois-volets',
    name: 'Bois & Volets',
    products: [
      {
        id: 'lasure-bois-brillant',
        name: 'Lasure Bois Brillant',
        couleur_pot: '#C8A060',
        supports: ['bois'],
        usages: ['exterieur'],
        finitions: ['brillant'],
        contenances: ['0,75L', '2,5L', '5L'],
        nuancier: [
          { nom: 'Incolore',      hex: '#F0E8D8' },
          { nom: 'Chêne Clair',   hex: '#C8A060' },
          { nom: 'Chêne Doré',    hex: '#B88830' },
          { nom: 'Acajou',        hex: '#804020' },
          { nom: 'Noyer',         hex: '#604828' },
          { nom: 'Teck',          hex: '#A07040' },
        ],
        sechage: '4h entre couches, recouvrable en 8h',
        rendement: '10m² / L',
        nettoyage: 'White-spirit',
      },
      {
        id: 'saturateur-bois-mat',
        name: 'Saturateur Bois Mat',
        couleur_pot: '#B89060',
        supports: ['bois'],
        usages: ['exterieur'],
        finitions: ['mat'],
        contenances: ['1L', '5L'],
        nuancier: [
          { nom: 'Incolore',      hex: '#F0EAE0' },
          { nom: 'Teck Naturel',  hex: '#A87840' },
          { nom: 'Pin',           hex: '#D4A860' },
          { nom: 'Chêne',         hex: '#C09050' },
        ],
        sechage: '6h, recouvrable en 24h',
        rendement: '8m² / L',
        nettoyage: 'White-spirit',
      },
      {
        id: 'peinture-volets-satine',
        name: 'Peinture Volets Satiné',
        couleur_pot: '#2A3040',
        supports: ['bois'],
        usages: ['interieur', 'exterieur'],
        finitions: ['satiné'],
        contenances: ['0,5L', '1L', '2,5L'],
        nuancier: [
          { nom: 'Blanc',           hex: '#FFFFFF' },
          { nom: 'Gris Anthracite', hex: '#404040' },
          { nom: 'Vert Basque',     hex: '#285040' },
          { nom: 'Bleu Basque',     hex: '#204060' },
          { nom: 'Rouge Basque',    hex: '#802020' },
          { nom: 'Noir',            hex: '#202020' },
        ],
        sechage: '2h entre couches, recouvrable en 4h',
        rendement: '11m² / L',
        nettoyage: 'White-spirit',
      },
    ],
  },

  {
    id: 'metal-fer',
    name: 'Métal & Fer',
    products: [
      {
        id: 'laque-metal-brillant',
        name: 'Laque Métal Brillant',
        couleur_pot: '#B0B8C0',
        supports: ['métal'],
        usages: ['interieur', 'exterieur'],
        finitions: ['brillant'],
        contenances: ['0,25L', '0,75L', '2,5L', '5L'],
        nuancier: [
          { nom: 'Blanc',       hex: '#FFFFFF' },
          { nom: 'Noir',        hex: '#202020' },
          { nom: 'Gris Argent', hex: '#C0C0C0' },
          { nom: 'Rouge Sang',  hex: '#900000' },
          { nom: 'Bleu Marine', hex: '#102040' },
          { nom: 'Vert Foncé',  hex: '#204020' },
        ],
        sechage: '4h entre couches, recouvrable en 8h',
        rendement: '18m² / L',
        nettoyage: 'White-spirit',
      },
      {
        id: 'antirouille-metal-satine',
        name: 'Antirouille Métal Satiné',
        couleur_pot: '#805040',
        supports: ['métal'],
        usages: ['exterieur'],
        finitions: ['satiné'],
        contenances: ['0,5L', '2,5L'],
        nuancier: [
          { nom: 'Gris Fer',     hex: '#808888' },
          { nom: 'Brun Rouille', hex: '#805040' },
          { nom: 'Noir',         hex: '#282828' },
          { nom: 'Vert Sapin',   hex: '#285030' },
        ],
        sechage: '4h entre couches, recouvrable en 12h',
        rendement: '14m² / L',
        nettoyage: 'White-spirit',
      },
    ],
  },

  {
    id: 'sol-beton',
    name: 'Sol & Béton',
    products: [
      {
        id: 'sol-beton-mat',
        name: 'Sol Béton Mat',
        couleur_pot: '#909898',
        supports: ['béton'],
        usages: ['interieur', 'exterieur'],
        finitions: ['mat'],
        contenances: ['1L', '5L', '10L'],
        nuancier: [
          { nom: 'Gris Béton',  hex: '#A0A0A0' },
          { nom: 'Gris Clair',  hex: '#C8C8C8' },
          { nom: 'Sable',       hex: '#D0C0A0' },
          { nom: 'Ardoise',     hex: '#606870' },
          { nom: 'Terracotta',  hex: '#B06848' },
        ],
        sechage: '12h avant circulation légère, 48h avant circulation normale',
        rendement: '8m² / L',
        nettoyage: 'Eau et savon',
      },
      {
        id: 'resine-sol-satine',
        name: 'Résine Sol Satiné',
        couleur_pot: '#C0C4C8',
        supports: ['béton'],
        usages: ['interieur'],
        finitions: ['satiné'],
        contenances: ['1L', '5L'],
        nuancier: [
          { nom: 'Gris Clair',  hex: '#D0D0D0' },
          { nom: 'Gris Moyen',  hex: '#A8A8A8' },
          { nom: 'Blanc Cassé', hex: '#F0ECE4' },
          { nom: 'Sable Fin',   hex: '#D8C8A8' },
        ],
        sechage: '24h avant circulation légère, 72h avant circulation normale',
        rendement: '7m² / L',
        nettoyage: 'Eau et savon',
      },
    ],
  },
]

const FILTRES = {
  supports: [
    { label: 'Mur / Béton', value: 'mur' },
    { label: 'Bois',        value: 'bois' },
    { label: 'Métal',       value: 'métal' },
    { label: 'Plâtre',      value: 'plâtre' },
    { label: 'Béton',       value: 'béton' },
  ],
  usages: [
    { label: 'Intérieur',              value: 'interieur' },
    { label: 'Extérieur',              value: 'exterieur' },
    { label: 'Intérieur et extérieur', value: 'les-deux' },
  ],
  finitions: [
    { label: 'Mat',      value: 'mat' },
    { label: 'Satiné',   value: 'satiné' },
    { label: 'Brillant', value: 'brillant' },
  ],
}

export function fetchFiltres() {
  return new Promise((resolve) => {
    $.get('/aj/Products:Views/ajGetFilters/:Extensions', {}, function(d) {
      resolve(d)
    }).fail(() => resolve(FILTRES))
  })
}

export function fetchFamilles() {
  return new Promise((resolve) => {
    $.get('/aj/ProductCategories:Views/ajGetCategories/:Extensions', {}, function(d) {
      resolve(d)
    }).fail(() => resolve(FAMILIES))
  })
}

export function fetchProducts() {
  const fallback = FAMILIES.flatMap(f => f.products.map(p => ({ ...p, famille: f.name })))
  return new Promise((resolve) => {
    $.get('/aj/Products:Views/ajGetProducts/:Extensions', {}, function(d) {
      resolve(d)
    }).fail(() => resolve(fallback))
  })
}
