# Scénarios de conversation — Chatbot Peinture

## Introduction — Accueil et menu principal

```
Bot  : Bonjour ! Je suis l'assistant Logis. Comment puis-je vous aider ?

       [Découvrir notre gamme]
       [Découvrir nos produits]
       [Choisir un produit]
       [Découvrir notre simulateur]
       [En savoir plus sur Logis]
       [Nous appeler]
       [Nous contacter]
```

| Choix                      | Suite                                                                              |
|----------------------------|------------------------------------------------------------------------------------|
| Découvrir notre gamme      | Liste des familles → liste des produits de la famille → fiche produit (Scénario A) |
| Découvrir nos produits     | Liste de tous les produits toutes gammes → fiche produit (Scénario B)              |
| Choisir un produit         | Arbre de décision par critères → Scénarios 1 à 6                                   |
| Découvrir notre simulateur | Redirection vers le simulateur de teintes                                           |
| En savoir plus sur Logis   | Message de présentation de l'entreprise + lien site                                 |
| Nous appeler               | Numéro cliquable `<a href="tel:...">` (statique)                                   |
| Nous contacter             | Redirection vers `/nous-contacter`                                                  |

---

## Scénario A — Découvrir notre gamme (navigation par famille)

> L'utilisateur veut explorer l'offre par famille de produits

```
User : [Découvrir notre gamme]

Bot  : Voici nos familles de produits :
       [Peinture Intérieure] [Peinture Extérieure / Façade]
       [Bois & Volets] [Métal & Fer] [Sol & Béton]

User : Bois & Volets

Bot  : Produits de la gamme Bois & Volets :
       [Lasure Bois Brillant] [Saturateur Bois Mat]
       [Peinture Volets Satiné] [Huile Bois Extérieur]

User : Lasure Bois Brillant

Bot  : ── Lasure Bois Brillant ──
       Rendement : 10m²/L | Séchage : 4h
       Nettoyage : White-spirit
       Contenances : [0,75L] [2,5L] [5L]
       Nuancier : ● Chêne ● Acajou ● Incolore
       [Retour à la gamme] [Retour aux familles] [Recommencer]
```

---

## Scénario B — Découvrir nos produits (catalogue complet)

> L'utilisateur veut voir tous les produits sans filtrer par gamme

```
User : [Découvrir nos produits]

Bot  : Voici tous nos produits :
       [Lasure Bois Brillant] [Mur Resist Mat] [Laque Métal Brillant]
       [Peinture Façade Satiné] [Sol Béton Mat] [Peinture Volets Satiné]
       [Saturateur Bois Mat] [Acrylique Multi-support Satiné] ...

User : Sol Béton Mat

Bot  : ── Sol Béton Mat ──
       Rendement : 8m²/L | Séchage : 12h avant circulation
       Nettoyage : Eau et savon
       Contenances : [1L] [5L] [10L]
       Nuancier : ● Gris Béton ● Sable ● Ardoise
       [Retour à la liste] [Recommencer]
```

---

## Scénario C — Nous appeler

```
User : [Nous appeler]

Bot  : Vous pouvez nous joindre au :
       📞 01 23 45 67 89  (lien cliquable sur mobile)
       Du lundi au vendredi, 8h – 18h
       [Retour au menu]
```

---

## Scénario D — Nous contacter

```
User : [Nous contacter]

Bot  : Je vous redirige vers notre formulaire de contact.
       → /nous-contacter
```

---

## Scénario 1 — Chemin standard, un seul résultat

> Peinture pour volet bois extérieur, finition brillante

```
Bot  : Bonjour ! Quel type de surface souhaitez-vous peindre ?
       [Bois] [Métal] [Mur / Béton] [Plâtre] [Autre]
User : Bois

Bot  : Pour quel usage ?
       [Intérieur] [Extérieur] [Les deux]
User : Extérieur

Bot  : Quelle finition souhaitez-vous ?
       [Mat] [Satiné] [Brillant]
User : Brillant

Bot  : J'ai trouvé 1 produit correspondant :
       ── Lasure Bois Extérieur Brillant ──
       Rendement : 10m²/L | Séchage : 4h
       Nettoyage : White-spirit
       Contenances : [0,75L] [2,5L] [5L]
       Nuancier : ● Chêne ● Acajou ● Incolore
User : [Recommencer]
```

---

## Scénario 2 — Plusieurs résultats, l'utilisateur choisit

> Peinture mur intérieur, mat — plusieurs produits correspondent

```
Bot  : Quel type de surface ?
User : Mur / Béton

Bot  : Quel usage ?
User : Intérieur

Bot  : Quelle finition ?
User : Mat

Bot  : 3 produits correspondent à votre recherche :
       [Mur Déco Mat] [Mur Resist Mat] [Mur Eco Mat]

User : Mur Resist Mat

Bot  : ── Mur Resist Mat ──
       Rendement : 14m²/L | Séchage : 2h entre couches
       Nettoyage : Eau et savon
       Contenances : [1L] [5L] [10L]
       Nuancier : ● Blanc ● Gris Perle ● Vieux Rose ...
```

---

## Scénario 3 — Aucun résultat, suggestion de réviser les critères

> Combinaison trop restrictive sans produit disponible

```
Bot  : Quel type de surface ?
User : Plâtre

Bot  : Quel usage ?
User : Extérieur

Bot  : Quelle finition ?
User : Brillant

Bot  : Aucun produit ne correspond exactement à ces critères.
       Voulez-vous élargir la recherche ?
       [Changer la finition] [Changer l'usage] [Recommencer]

User : Changer la finition

Bot  : Quelle finition souhaitez-vous ?
       [Mat] [Satiné]   ← (brillant retiré car aucun résultat)
```

---

## Scénario 4 — L'utilisateur veut voir le nuancier en détail

> Navigation dans les teintes après avoir choisi un produit

```
Bot  : ── Peinture Façade Satiné ──
       Nuancier : ● Blanc Cassé ● Sable ● Terracotta (+12)
                  [Voir toutes les teintes]

User : [Voir toutes les teintes]

Bot  : Nuancier complet — Peinture Façade Satiné
       ● Blanc Cassé  ● Sable  ● Terracotta
       ● Gris Ardoise ● Ocre   ● Vieux Rose ...
       [Retour au produit]
```

---

## Scénario 5 — L'utilisateur choisit une contenance

> Sélection de la taille avant de conclure

```
Bot  : ── Laque Métal Brillant ──
       Contenances disponibles :
       [0,25L — petits travaux] [0,75L] [2,5L] [5L]

User : 2,5L

Bot  : Parfait ! Récapitulatif :
       Laque Métal Brillant — 2,5L
       Rendement : ~18m² | Séchage : 4h | Nettoyage : White-spirit
       [Recommencer une recherche]
```

---

## Scénario 6 — Usage mixte intérieur/extérieur

> Le bot propose uniquement les produits compatibles avec les deux

```
Bot  : Quel usage ?
User : Les deux (intérieur et extérieur)

Bot  : Quelle finition ?
User : Satiné

Bot  : 2 produits polyvalents correspondent :
       [Peinture Universelle Satiné] [Acrylique Multi-support Satiné]
```
