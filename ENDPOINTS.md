# API Endpoints — Chatbot Logis

Ce document liste les endpoints nécessaires pour remplacer les données statiques de `data.js` par une API REST.

Deux points de branchement dans le code, tous deux dans `js/data.js` :
- `fetchFamilles()` → à remplacer par `fetch('/api/families')`
- `fetchProducts()` → à remplacer par `fetch('/api/products')`

---

## GET /api/families

Retourne la liste des familles de produits avec leurs produits embarqués.  
Utilisé pour le parcours gamme : famille → liste des produits → fiche produit.

### Réponse attendue

```json
[
  {
    "id": "peinture-interieure",
    "name": "Peinture Intérieure",
    "products": [
      {
        "id": "mur-deco-mat",
        "name": "Mur Déco Mat",
        "pot_color": "#E8E4DC",
        "surfaces": ["mur", "plâtre"],
        "uses": ["interieur"],
        "finishes": ["mat"],
        "sizes": ["1L", "5L", "10L"],
        "shades": [
          { "name": "Blanc Pur", "hex": "#FFFFFF" },
          { "name": "Gris Perle", "hex": "#D8D4CC" }
        ],
        "drying_time": "2h entre couches, recouvrable en 4h",
        "coverage": "13m² / L",
        "cleaning": "Eau et savon"
      }
    ]
  }
]
```

### Détail des champs — famille

| Champ | Type | Description |
|---|---|---|
| `id` | `string` | Slug unique, ex. `bois-volets` |
| `name` | `string` | Nom affiché dans le chat |
| `products` | `object[]` | Liste des produits de la famille |

### Détail des champs — produit

| Champ | Type | Valeurs possibles / format |
|---|---|---|
| `id` | `string` | Slug unique, ex. `mur-deco-mat` |
| `name` | `string` | Nom commercial du produit |
| `pot_color` | `string` | Couleur du pot en hexadécimal, ex. `"#E8E4DC"` — s'applique au fond du bouton produit, texte calculé automatiquement pour rester lisible |
| `surfaces` | `string[]` | `"mur"`, `"béton"`, `"plâtre"`, `"bois"`, `"métal"` |
| `uses` | `string[]` | `"interieur"`, `"exterieur"` (les deux valeurs possibles simultanément) |
| `finishes` | `string[]` | `"mat"`, `"satiné"`, `"brillant"` |
| `sizes` | `string[]` | Texte libre, ex. `"0,75L"`, `"5L"`, `"20L"` |
| `shades` | `object[]` | Tableau de `{ name: string, hex: string }` |
| `drying_time` | `string` | Texte libre |
| `coverage` | `string` | Texte libre, ex. `"12m² / L"` |
| `cleaning` | `string` | Texte libre, ex. `"Eau et savon"`, `"White-spirit"` |

### Codes de retour

| Code | Cas |
|---|---|
| `200` | Succès, tableau JSON (vide `[]` si aucune famille) |
| `500` | Erreur serveur |

---

## GET /api/products

Retourne la liste à plat de tous les produits, toutes familles confondues.  
Utilisé pour le filtrage par support / usage / finition et la liste "tous les produits".  
Chaque produit inclut un champ `family` indiquant son appartenance.

### Réponse attendue

```json
[
  {
    "id": "mur-deco-mat",
    "name": "Mur Déco Mat",
    "family": "Peinture Intérieure",
    "pot_color": "#E8E4DC",
    "surfaces": ["mur", "plâtre"],
    "uses": ["interieur"],
    "finishes": ["mat"],
    "sizes": ["1L", "5L", "10L"],
    "shades": [
      { "name": "Blanc Pur", "hex": "#FFFFFF" },
      { "name": "Gris Perle", "hex": "#D8D4CC" }
    ],
    "drying_time": "2h entre couches, recouvrable en 4h",
    "coverage": "13m² / L",
    "cleaning": "Eau et savon"
  }
]
```

### Codes de retour

| Code | Cas |
|---|---|
| `200` | Succès, tableau JSON (vide `[]` si aucun produit) |
| `500` | Erreur serveur — le chatbot restera sur les données statiques |

---

## Notes d'intégration

**Branchement dans `data.js`**

```js
export async function fetchFamilles() {
  const res = await fetch('/api/families')
  if (!res.ok) throw new Error('Failed to load families')
  return res.json()
}

export async function fetchProducts() {
  const res = await fetch('/api/products')
  if (!res.ok) throw new Error('Failed to load products')
  return res.json()
}
```

> À noter : les noms de champs de l'API (`surfaces`, `uses`, `finishes`, `shades`…) diffèrent des noms actuels dans le code (`supports`, `usages`, `finitions`, `nuancier`…). La migration vers l'API impliquera une mise à jour de `chatbot.js` en parallèle.

**CORS** — si l'API est sur un domaine différent du site intégrant le chatbot, les headers CORS devront autoriser l'origine du site.

**Cache** — les deux endpoints étant chargés une fois par session, un `Cache-Control: max-age=300` côté API est suffisant pour limiter la charge.
