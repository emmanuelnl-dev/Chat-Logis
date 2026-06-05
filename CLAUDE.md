# Chatbot Peinture — CLAUDE.md

## Contexte du projet

Chatbot sans IA pour une entreprise de peinture. Guide l'utilisateur via un arbre de décision pour trouver le produit adapté à son besoin, puis affiche la fiche produit complète.

Stack : HTML / CSS / JS vanilla, aucun framework, aucun backend pour l'instant.

## Structure du projet

```
chat/
├── index.html          ← point d'entrée unique
├── css/
│   └── style.css
├── js/
│   ├── data.js         ← catalogue produits (JSON statique, remplacé par API à terme)
│   ├── chatbot.js      ← moteur de conversation (machine à états + filtrage)
│   └── ui.js           ← rendu DOM : bulles, cartes produit, pastilles nuancier
```

## Modèle de données produit

Chaque produit JSON respecte ce schéma :

```json
{
  "id": "string",
  "name": "string",
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

## Flux de conversation

```
État 1 : accueil
État 2 : choix support    → filtre cumulatif sur PRODUCTS
État 3 : choix usage      → filtre cumulatif
État 4 : choix finition   → filtre cumulatif
État 5 : résultats        → 1 produit → fiche directe / plusieurs → sélection
État 6 : fiche produit    → nuancier, contenances, rendement, séchage, nettoyage
État 7 : recommencer ou quitter
```

## Couche données — règle importante

`data.js` expose une fonction `fetchProducts()` qui retourne une `Promise<Product[]>`.
Aujourd'hui elle résout avec le JSON statique local. À terme, elle appellera une API REST.
**Ne jamais accéder au tableau de produits directement** — toujours passer par `fetchProducts()`.

```js
// data.js — interface à respecter
export async function fetchProducts() {
  // TODO: remplacer par fetch('/api/products') quand l'API sera prête
  return Promise.resolve(PRODUCTS);
}
```

## Conventions de code

- JS vanilla ES modules (`type="module"` dans le HTML)
- Aucun framework CSS, aucune dépendance npm
- `chatbot.js` ne touche pas au DOM — il retourne des objets état, `ui.js` fait le rendu
- Pas de commentaires évidents ; commenter uniquement les invariants non-triviaux
- Noms de variables en français pour les concepts métier (`support`, `finition`, `nuancier`), anglais pour la mécanique (`state`, `render`, `dispatch`)

## Ce qui est hors scope (pour l'instant)

- Design / charte graphique
- Panier / tunnel de commande
- Recherche textuelle libre
- Authentification
- Backend / base de données (la couche `fetchProducts()` abstraite suffit)
