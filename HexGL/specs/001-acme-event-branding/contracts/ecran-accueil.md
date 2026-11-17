# Contrat d'interface : écran d'accueil ACME

Le projet n'expose aucune API ni aucun endpoint. Son interface avec l'utilisateur est l'écran d'accueil (`#step-1`). Ce contrat fixe ce que l'écran doit présenter et ce qui doit rester stable, pour guider l'implémentation et les vérifications.

## 1. Structure DOM attendue (`#step-1`)

Ordre dans `#step-1` :

1. `#global` — fond (inchangé dans le DOM, restylé par `acme.css`)
2. `#title` — logo HexGL d'origine (conservé dans le DOM, **non visible**)
3. `#acme-brand` — **nouveau** : contient
   - un `<img id="acme-logo">` du logo (`src="formation/identite/logo.png"`, `alt="Logo ACME"`)
   - un `<div id="acme-name">` avec le texte « ACME » (nom de l'entreprise)
   - un `<div id="acme-message" lang="fr">` avec le texte « Bienvenue au ACME Racing Challenge »
4. `#menucontainer > #menu` — inchangé (mêmes identifiants et mêmes libellés par défaut)

## 2. Éléments à ne pas modifier (stabilité)

| Élément | Raison |
|---|---|
| Identifiants `#start`, `#s-controlType`, `#s-quality`, `#s-hud`, `#s-godmode`, `#s-credits`, `#step-1`..`#step-5` | utilisés par `launch.js` |
| Libellés du menu (`Start`, `Controls: …`, `Quality: …`, `HUD: …`, `Credits`) | FR-007, hypothèse de la spec |
| `#s-godmode` en `display:none` | comportement existant |
| Ordre et liste des `<script>` | principe V |
| Paramètres d'URL `controlType`, `quality`, `hud`, `godmode` | FR-008 |

## 3. Contrat visuel

| Réf. | Exigence observable | Vérification |
|---|---|---|
| FR-001 | Logo visible, rapport largeur/hauteur d'origine (±1 %), marge intérieure, aucun filtre/ombre/contour | rectangle de l'image vs dimensions naturelles ; styles calculés |
| FR-002/003 | Textes « ACME » et « Bienvenue au ACME Racing Challenge » visibles | `innerText`, visibilité |
| FR-004 | `#global` en `rgb(8,9,13)` ; aucune couleur hors table du `data-model.md` | styles calculés de `#step-1` et descendants |
| FR-005/006 | Logo sur surface blanche ; contraste texte/fond ≥ 4,5:1 pour les textes du menu et du message | calcul à partir des styles calculés |
| FR-009 | Texte « WebGL is not supported! » lisible (même contraste) | contexte WebGL désactivé |
| SC-005 | Aucun chevauchement entre rectangle de `#acme-brand` et de `#menu`, tout dans la fenêtre à 1024×768 et 1920×1080 | `getBoundingClientRect()` |
| Crédits | `#s-credits` ouvre `#credits` (inchangé) puis un clic revient à `#step-1` habillé ACME | clics Playwright |
| Cas limite | Logo introuvable : `#acme-brand` garde le nom « ACME » visible, aucun logo HexGL | requête du logo bloquée |

## 4. Comportement

- Cliquer sur `#start` mène à `#step-2` comme avant ; les options du menu cyclent comme avant ; `#s-credits` ouvre et ferme `#credits` comme avant.
- Aucun nouveau gestionnaire d'événements ni script.
