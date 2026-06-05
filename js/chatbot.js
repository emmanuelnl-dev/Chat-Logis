import { fetchProducts, fetchFamilles } from './data.js'

const PHONE = '01 23 45 67 89'
const PHONE_HREF = 'tel:+33123456789'
const PHONE_HORAIRES = 'Du lundi au vendredi, 8h – 18h'
const SIMULATEUR_URL = '/simulateur'
const CONTACT_URL = '/nous-contacter'
const LOGIS_DESCRIPTION = 'Logis est une marque française de peinture fondée en 1978. Nous proposons des gammes complètes pour tous vos projets de rénovation intérieure et extérieure, formulées en France avec des matières premières sélectionnées pour leur qualité et leur durabilité.'

let _products = []
let state = {}

function setState(patch) {
  state = { ...state, ...patch }
}

function resp(messages, options = null, extra = {}) {
  return {
    messages: Array.isArray(messages) ? messages : [messages],
    options,
    ...extra,
  }
}

function opt(label, value) {
  return { label, value }
}

// ── Menu principal ─────────────────────────────────────────────────────────

function menu() {
  setState({ step: 'menu', filters: {}, famille: null, produit: null, source: null, produitsFiltres: [] })
  return resp(
    'Bonjour ! Je suis l\'assistant Logis. Comment puis-je vous aider ?',
    [
      opt('Découvrir notre gamme',       'menu:gamme'),
      opt('Découvrir nos produits',      'menu:produits'),
      opt('Choisir un produit',          'menu:choisir'),
      opt('Découvrir notre simulateur',  'menu:simulateur'),
      opt('En savoir plus sur Logis',    'menu:logis'),
      opt('Nous appeler',                'menu:appeler'),
      opt('Nous contacter',              'menu:contacter'),
    ]
  )
}

function retourMenu() {
  return menu()
}

// ── Handlers par étape ────────────────────────────────────────────────────

function fromMenu(value) {
  switch (value) {
    case 'menu:gamme':      return goGammeFamilles()
    case 'menu:produits':   return goProduitsTous()
    case 'menu:choisir':    return goChoixSupport()
    case 'menu:simulateur': return goSimulateur()
    case 'menu:logis':      return goLogis()
    case 'menu:appeler':    return goAppeler()
    case 'menu:contacter':  return goContacter()
    default:                return menu()
  }
}

function fromGammeFamilles(value) {
  if (value === 'nav:menu') return retourMenu()
  return goGammeProduits(value)
}

function fromGammeProduits(value) {
  if (value === 'nav:menu')    return retourMenu()
  if (value === 'nav:familles') return goGammeFamilles()
  return goFiche(value, 'gamme')
}

function fromProduitsTous(value) {
  if (value === 'nav:menu') return retourMenu()
  return goFiche(value, 'produits')
}

function fromSupport(value) {
  if (value === 'nav:menu') return retourMenu()
  setState({ filters: { support: value } })
  return goChoixUsage()
}

function fromUsage(value) {
  if (value === 'nav:menu')    return retourMenu()
  if (value === 'nav:support') return goChoixSupport()
  setState({ filters: { ...state.filters, usage: value } })
  return goChoixFinition()
}

function fromFinition(value) {
  if (value === 'nav:menu')  return retourMenu()
  if (value === 'nav:usage') return goChoixUsage()
  setState({ filters: { ...state.filters, finition: value } })
  return goResultats()
}

function fromResultats(value) {
  if (value === 'nav:menu')    return retourMenu()
  if (value === 'nav:choisir') return goChoixSupport()
  return goFiche(value, 'resultats')
}

function fromFiche(value) {
  if (value === 'nav:menu')    return retourMenu()
  if (value === 'nav:familles') return goGammeFamilles()
  if (value === 'nav:gamme')   return goGammeProduits(state.famille)
  if (value === 'nav:produits') return goProduitsTous()
  if (value === 'nav:resultats') return goResultats()
  if (value === 'nuancier:complet') return goNuancier()
  return retourMenu()
}

function fromNuancier(value) {
  if (value === 'nav:fiche') return afficherFiche(state.produit, state.source)
  return retourMenu()
}

function fromNoResult(value) {
  if (value === 'nav:support') return goChoixSupport()
  if (value === 'nav:usage')   return goChoixUsage()
  if (value === 'nav:finition') return goChoixFinition()
  if (value === 'nav:menu')    return retourMenu()
  return retourMenu()
}

// ── Transitions ───────────────────────────────────────────────────────────

function goGammeFamilles() {
  setState({ step: 'gamme_familles' })
  const familles = [...new Set(_products.map(p => p.famille))]
  return resp(
    'Voici nos familles de produits :',
    [
      ...familles.map(f => opt(f, f)),
      opt('← Retour au menu', 'nav:menu'),
    ]
  )
}

function goGammeProduits(famille) {
  setState({ step: 'gamme_produits', famille })
  const produits = _products.filter(p => p.famille === famille)
  return resp(
    `Produits de la gamme ${famille} :`,
    [
      ...produits.map(p => opt(p.name, p.id)),
      opt('← Retour aux familles', 'nav:familles'),
      opt('← Retour au menu',      'nav:menu'),
    ]
  )
}

function goProduitsTous() {
  setState({ step: 'produits_tous', source: 'produits' })
  return resp(
    'Voici tous nos produits :',
    [
      ..._products.map(p => opt(p.name, p.id)),
      opt('← Retour au menu', 'nav:menu'),
    ]
  )
}

function goChoixSupport() {
  setState({ step: 'choix_support', filters: {} })
  return resp(
    'Quel type de surface souhaitez-vous peindre ?',
    [
      opt('Mur / Béton', 'mur'),
      opt('Bois',        'bois'),
      opt('Métal',       'métal'),
      opt('Plâtre',      'plâtre'),
      opt('Béton',       'béton'),
      opt('← Retour au menu', 'nav:menu'),
    ]
  )
}

function goChoixUsage() {
  setState({ step: 'choix_usage' })
  return resp(
    'Pour quel usage ?',
    [
      opt('Intérieur',             'interieur'),
      opt('Extérieur',             'exterieur'),
      opt('Intérieur et extérieur', 'les-deux'),
      opt('← Changer le support',  'nav:support'),
      opt('← Retour au menu',      'nav:menu'),
    ]
  )
}

function goChoixFinition() {
  setState({ step: 'choix_finition' })
  const { support, usage } = state.filters

  // Filtrage partiel pour ne proposer que les finitions disponibles
  const candidats = _products.filter(p => {
    const matchSupport = p.supports.includes(support) || p.supports.includes('mur')
    const matchUsage = usage === 'les-deux'
      ? p.usages.includes('interieur') && p.usages.includes('exterieur')
      : p.usages.includes(usage)
    return matchSupport && matchUsage
  })

  const finitionsDispo = [...new Set(candidats.flatMap(p => p.finitions))]
  const finitionsLabels = { mat: 'Mat', satiné: 'Satiné', brillant: 'Brillant' }

  return resp(
    'Quelle finition souhaitez-vous ?',
    [
      ...finitionsDispo.map(f => opt(finitionsLabels[f] || f, f)),
      opt('← Changer l\'usage',  'nav:usage'),
      opt('← Retour au menu',    'nav:menu'),
    ]
  )
}

function goResultats() {
  setState({ step: 'resultats', source: 'resultats' })
  const { support, usage, finition } = state.filters

  const produits = _products.filter(p => {
    const matchSupport = p.supports.includes(support)
    const matchUsage = usage === 'les-deux'
      ? p.usages.includes('interieur') && p.usages.includes('exterieur')
      : p.usages.includes(usage)
    const matchFinition = p.finitions.includes(finition)
    return matchSupport && matchUsage && matchFinition
  })

  setState({ produitsFiltres: produits })

  if (produits.length === 0) {
    setState({ step: 'no_result' })
    return resp(
      'Aucun produit ne correspond exactement à ces critères. Souhaitez-vous modifier votre recherche ?',
      [
        opt('Changer la finition', 'nav:finition'),
        opt('Changer l\'usage',    'nav:usage'),
        opt('Recommencer',         'nav:support'),
        opt('← Retour au menu',   'nav:menu'),
      ]
    )
  }

  if (produits.length === 1) {
    return afficherFiche(produits[0], 'resultats')
  }

  return resp(
    `${produits.length} produits correspondent à votre recherche :`,
    [
      ...produits.map(p => opt(p.name, p.id)),
      opt('← Modifier la recherche', 'nav:choisir'),
      opt('← Retour au menu',        'nav:menu'),
    ]
  )
}

function goFiche(productId, source) {
  const produit = _products.find(p => p.id === productId)
  if (!produit) return retourMenu()
  return afficherFiche(produit, source)
}

function afficherFiche(produit, source) {
  setState({ step: 'fiche', produit, source })

  const navOptions = buildFicheNav(source)

  return resp(null, navOptions, { type: 'fiche', data: produit })
}

function buildFicheNav(source) {
  const options = []
  if (source === 'gamme') {
    options.push(opt(`← Retour à la gamme ${state.famille}`, 'nav:gamme'))
    options.push(opt('← Retour aux familles', 'nav:familles'))
  } else if (source === 'produits') {
    options.push(opt('← Retour à la liste', 'nav:produits'))
  } else if (source === 'resultats') {
    if (state.produitsFiltres && state.produitsFiltres.length > 1) {
      options.push(opt('← Retour aux résultats', 'nav:resultats'))
    }
    options.push(opt('← Modifier la recherche', 'nav:choisir'))
  }
  options.push(opt('Recommencer', 'nav:menu'))
  return options
}

function goNuancier() {
  setState({ step: 'nuancier' })
  return resp(null, [opt('← Retour au produit', 'nav:fiche')], {
    type: 'nuancier',
    data: state.produit,
  })
}

function goSimulateur() {
  return resp(
    'Je vous redirige vers notre simulateur de teintes.',
    [opt('← Retour au menu', 'nav:menu')],
    { type: 'redirect', data: SIMULATEUR_URL }
  )
}

function goLogis() {
  return resp(
    [LOGIS_DESCRIPTION, 'Retrouvez toute notre actualité sur logis-peintures.fr'],
    [opt('← Retour au menu', 'nav:menu')]
  )
}

function goAppeler() {
  return resp(
    null,
    [opt('← Retour au menu', 'nav:menu')],
    { type: 'tel', data: { numero: PHONE, href: PHONE_HREF, horaires: PHONE_HORAIRES } }
  )
}

function goContacter() {
  return resp(
    'Je vous redirige vers notre formulaire de contact.',
    [opt('← Retour au menu', 'nav:menu')],
    { type: 'redirect', data: CONTACT_URL }
  )
}

// ── API publique ──────────────────────────────────────────────────────────

export async function init() {
  _products = await fetchProducts()
  return menu()
}

export function dispatch(value) {
  switch (state.step) {
    case 'menu':           return fromMenu(value)
    case 'gamme_familles': return fromGammeFamilles(value)
    case 'gamme_produits': return fromGammeProduits(value)
    case 'produits_tous':  return fromProduitsTous(value)
    case 'choix_support':  return fromSupport(value)
    case 'choix_usage':    return fromUsage(value)
    case 'choix_finition': return fromFinition(value)
    case 'resultats':      return fromResultats(value)
    case 'fiche':          return fromFiche(value)
    case 'nuancier':       return fromNuancier(value)
    case 'no_result':      return fromNoResult(value)
    default:               return menu()
  }
}
