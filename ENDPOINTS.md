# API Endpoints — Chatbot Logis

Ce document liste les endpoints nécessaires pour remplacer les données statiques de `data.js` par une API REST.

Trois points de branchement dans le code, tous dans `js/data.js` :
- `fetchFiltres()` → `/aj/Products:Views/ajGetFilters/:Extensions`
- `fetchFamilles()` → `/aj/ProductCategories:Views/ajGetCategories/:Extensions`
- `fetchProducts()` → `/aj/Products:Views/ajGetProducts/:Extensions`

---

## GET /api/filters

Retourne les valeurs possibles pour les trois filtres du parcours "Choisir un produit".  
Chargé une fois à l'initialisation du chatbot.

### Réponse attendue

```json
{
  "supports": [
    { "label": "Mur / Béton", "value": "mur" },
    { "label": "Bois",        "value": "bois" },
    { "label": "Métal",       "value": "métal" },
    { "label": "Plâtre",      "value": "plâtre" },
    { "label": "Béton",       "value": "béton" }
  ],
  "usages": [
    { "label": "Intérieur",              "value": "interieur" },
    { "label": "Extérieur",              "value": "exterieur" },
    { "label": "Intérieur et extérieur", "value": "les-deux" }
  ],
  "finitions": [
    { "label": "Mat",      "value": "mat" },
    { "label": "Satiné",   "value": "satiné" },
    { "label": "Brillant", "value": "brillant" }
  ]
}
```

### Détail des champs

Chaque entrée dans `supports`, `usages` et `finitions` suit le même schéma :

| Champ | Type | Description |
|---|---|---|
| `label` | `string` | Texte affiché sur le bouton |
| `value` | `string` | Valeur interne utilisée pour le filtrage des produits |

> Les `value` de `supports` et `usages` doivent correspondre aux valeurs utilisées dans les champs `supports` et `usages` des produits. Les finitions disponibles sont filtrées automatiquement côté client selon les candidats restants.

### Codes de retour

| Code | Cas |
|---|---|
| `200` | Succès |
| `500` | Erreur serveur — le chatbot utilisera les valeurs statiques |

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
        "couleur_pot": "#E8E4DC",
        "supports": ["mur", "plâtre"],
        "usages": ["interieur"],
        "finitions": ["mat"],
        "contenances": ["1L", "5L", "10L"],
        "nuancier": [
          { "nom": "Blanc Pur", "hex": "#FFFFFF" },
          { "nom": "Gris Perle", "hex": "#D8D4CC" }
        ],
        "sechage": "2h entre couches, recouvrable en 4h",
        "rendement": "13m² / L",
        "nettoyage": "Eau et savon"
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
| `couleur_pot` | `string` | Couleur du pot en hexadécimal, ex. `"#E8E4DC"` — s'applique au fond du bouton produit, texte calculé automatiquement pour rester lisible |
| `supports` | `string[]` | `"mur"`, `"béton"`, `"plâtre"`, `"bois"`, `"métal"` |
| `usages` | `string[]` | `"interieur"`, `"exterieur"` (les deux valeurs possibles simultanément) |
| `finitions` | `string[]` | `"mat"`, `"satiné"`, `"brillant"` |
| `contenances` | `string[]` | Texte libre, ex. `"0,75L"`, `"5L"`, `"20L"` |
| `nuancier` | `object[]` | Tableau de `{ nom: string, hex: string }` |
| `sechage` | `string` | Texte libre |
| `rendement` | `string` | Texte libre, ex. `"12m² / L"` |
| `nettoyage` | `string` | Texte libre, ex. `"Eau et savon"`, `"White-spirit"` |

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
    "famille": "Peinture Intérieure",
    "couleur_pot": "#E8E4DC",
    "supports": ["mur", "plâtre"],
    "usages": ["interieur"],
    "finitions": ["mat"],
    "contenances": ["1L", "5L", "10L"],
    "nuancier": [
      { "nom": "Blanc Pur", "hex": "#FFFFFF" },
      { "nom": "Gris Perle", "hex": "#D8D4CC" }
    ],
    "sechage": "2h entre couches, recouvrable en 4h",
    "rendement": "13m² / L",
    "nettoyage": "Eau et savon"
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

**Intégration dans le site hôte**

Les URLs sont hardcodées dans `js/data.js`. jQuery doit être chargé avant le chatbot :

```html
<!-- jQuery (déjà présent sur le site hôte) -->
<script type="module" src="js/ui.js"></script>
```

Les appels sont effectués via jQuery `$.get()` :

```js
$.get('/aj/ProductCategories:Views/ajGetCategories/:Extensions', {}, function(d) {
  resolve(d)
}).fail(() => resolve(fallback))
```

En cas d'échec (erreur serveur), le chatbot bascule automatiquement sur les données statiques locales.


**CORS** — si l'API est sur un domaine différent du site intégrant le chatbot, les headers CORS devront autoriser l'origine du site.

**Cache** — les deux endpoints étant chargés une fois par session, un `Cache-Control: max-age=300` côté API est suffisant pour limiter la charge.
