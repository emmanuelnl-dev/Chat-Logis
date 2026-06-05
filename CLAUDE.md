# Chatbot Peinture — CLAUDE.md

## Contexte du projet

Chatbot sans IA pour une entreprise de peinture. Guide l'utilisateur via un arbre de décision pour trouver le produit adapté à son besoin, puis affiche la fiche produit complète.

Stack : HTML / CSS / JS vanilla, aucun framework, aucun backend pour l'instant.

## Structure du projet

```
chat/
├── index.html          ← point d'entrée unique (ES modules)
├── css/
│   └── style.css       ← styles : fenêtre chat, bulles, cartes, FAB, animations
├── js/
│   ├── data.js         ← catalogue produits (JSON statique, remplacé par API à terme)
│   ├── chatbot.js      ← moteur de conversation (machine à états + filtrage, zéro DOM)
│   └── ui.js           ← rendu DOM : bulles, cartes produit, pastilles nuancier, open/close
```

## Modèle de données produit

Chaque produit JSON respecte ce schéma :

```json
{
  "id": "string",
  "name": "string",
  "famille": "string (ex. Bois & Volets)",
  "supports": ["bois", "métal", "mur", "béton", "plâtre"],
  "usages": ["interieur", "exterieur"],
  "finitions": ["mat", "satiné", "brillant"],
  "contenances": ["0.5L", "1L", "5L"],
  "nuancier": [{ "nom": "Blanc Pur", "hex": "#FFFFFF" }],
  "sechage": "string (texte libre)",
  "rendement": "string (ex. 12m² / L)",
  "nettoyage": "string (ex. White-spirit)"
}
```

12 produits exemples répartis sur 5 familles sont définis dans `data.js`.

## États de la machine à états (`chatbot.js`)

```
menu             → menu principal (7 choix)
gamme_familles   → liste des familles de produits
gamme_produits   → liste des produits d'une famille
produits_tous    → tous les produits toutes gammes confondues
choix_support    → filtre : type de surface
choix_usage      → filtre : intérieur / extérieur / les deux
choix_finition   → filtre : mat / satiné / brillant (options filtrées selon candidats)
resultats        → produits filtrés (0 → no_result, 1 → fiche directe, n → sélection)
no_result        → aucun résultat, proposition de réviser les critères
fiche            → fiche produit complète
nuancier         → nuancier complet (toutes les teintes)
```

## Réponse du chatbot

Chaque fonction d'état retourne un objet `response` :

```js
{
  messages: string[],           // bulles bot à afficher (null si carte seule)
  options:  [{ label, value }], // boutons cliquables (null si aucun)
  type:     'fiche' | 'nuancier' | 'tel' | 'redirect' | undefined,
  data:     Product | { numero, href, horaires } | string | null,
}
```

`ui.js` consomme ce format — `chatbot.js` n'a aucune connaissance du DOM.

## Couche données — règle importante

`data.js` expose `fetchProducts()` qui retourne une `Promise<Product[]>`.
Aujourd'hui elle résout avec le JSON statique local. À terme, elle appellera une API REST.
**Ne jamais accéder au tableau de produits directement** — toujours passer par `fetchProducts()`.

```js
export async function fetchProducts() {
  // TODO: remplacer par fetch('/api/products') quand l'API sera prête
  return Promise.resolve(PRODUCTS)
}
```

## UI — éléments notables

- **FAB** — bouton rond fixe en bas à droite, ouvre/ferme la fenêtre de chat
- **Badge** — point rouge sur le FAB, disparaît à la première ouverture
- **Header** — avatar robot SVG + indicateur "en ligne" (point vert pulsé) + titre + bouton fermer (haut droite)
- **Typing indicator** — 3 points animés (~2s, durée légèrement aléatoire) avant chaque réponse bot
- **Init lazy** — `start()` n'est appelé qu'à la première ouverture du chat
- **Nuancier** — aperçu 5 pastilles avec tooltip au survol + bouton "voir toutes les teintes"
- **Carte produit** — famille, nom, rendement, séchage, nettoyage, contenances, nuancier

## Conventions de code

- JS vanilla ES modules (`type="module"` dans le HTML)
- Aucun framework CSS, aucune dépendance npm
- `chatbot.js` ne touche pas au DOM — il retourne des objets, `ui.js` fait le rendu
- Noms de variables en français pour les concepts métier (`support`, `finition`, `nuancier`), anglais pour la mécanique (`state`, `render`, `dispatch`)

## Ce qui est hors scope (pour l'instant)

- Design / charte graphique
- Panier / tunnel de commande
- Recherche textuelle libre
- Authentification
- Backend / base de données (la couche `fetchProducts()` abstraite suffit)
