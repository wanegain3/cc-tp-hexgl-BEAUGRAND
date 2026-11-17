# Modèle de données : Personnalisation événementielle ACME

La fonctionnalité ne crée ni stockage, ni état, ni transition : elle manipule deux jeux de constantes statiques décrits dans la spec (« Key Entities »). Ce document fixe leurs valeurs exactes, utilisées par `css/acme.css` et le bloc `#acme-brand`.

## Entité 1 — Identité visuelle ACME

Source : `formation/identite/charte_graphique_acme.pdf` et `formation/identite/logo.png`.

| Champ | Valeur | Règle de validation |
|---|---|---|
| Logo | `formation/identite/logo.png` (fond blanc opaque, texte bleu nuit) | Affiché sans déformation (`width:auto` ou `height:auto`, rapport d'aspect d'origine), sans recoloration, ombre, contour ni filtre ; sur surface claire avec marge intérieure |
| Fond principal | `#08090D` | Seul fond de l'écran d'accueil |
| Violet | `#7628FF` | Accent autorisé |
| Bleu électrique | `#315BFF` | Accent autorisé |
| Cyan | `#00C4E8` | Accent autorisé (liseré, souligné ; pas de texte courant sur violet) |
| Blanc | `#FFFFFF` | Texte, surface du logo |
| Gris clair | `#E6E8EE` | Autorisé (réserve) ; non utilisé en texte sur le dégradé, contraste 4,4:1 sur #315BFF |
| Dégradé événementiel | `#7628FF → #315BFF` | Seul dégradé autorisé |

Contrainte globale (SC-003) : toute valeur de couleur de `css/acme.css` appartient à cette table (la transparence d'un des mêmes tons est tolérée). Les couleurs d'origine `#4190bb`, `#f66439` et le fond `bg.jpg` ne doivent plus être visibles à l'écran d'accueil.

## Entité 2 — Contenu d'accueil

| Champ | Valeur | Règle de validation |
|---|---|---|
| Nom de l'entreprise | `ACME` | Texte réel (non image), toujours visible, y compris si le logo ne se charge pas |
| Message d'accueil | `Bienvenue au ACME Racing Challenge` | Texte réel, `lang="fr"`, lisible sans troncature à 1024×768 et 1920×1080 |
| Texte alternatif du logo | `Logo ACME` | Présent sur l'image |

## Relations

- Le bloc `#acme-brand` agrège Logo + Nom + Message ; il remplace visuellement `#title` (logo HexGL, masqué).
- Les identifiants du menu (`#start`, `#s-controlType`, `#s-quality`, `#s-hud`, `#s-godmode`, `#s-credits`) ne changent pas : `launch.js` continue de les piloter.

## États

Aucun cycle de vie. Seul cas dynamique : en l'absence de WebGL, `launch.js` remplace le texte de `#start` par « WebGL is not supported! » ; ce texte doit rester lisible avec le nouvel habillage (FR-009).
