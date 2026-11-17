# Research : Personnalisation événementielle ACME de l'écran d'accueil

Aucun marqueur `NEEDS CLARIFICATION` ne subsiste dans le Technical Context. Cette recherche consigne les décisions de conception, fondées sur la lecture de `index.html`, `css/multi.css`, `launch.coffee`, `docs/architecture.md` et du logo fourni (`formation/identite/logo.png`).

## Constats sur l'existant

- L'écran d'accueil est `#step-1` : `#global` (fond `bg.jpg` clair et flou, animé), `#title` (image `title.png` = vaisseau + logo HexGL, animée), `#menucontainer > #menu` (lignes en `#4190bb`, `#start` en `#f66439`, bandes blanches semi-transparentes).
- `launch.js` n'agit sur l'écran d'accueil que par identifiant (`#start`, `#s-*`, `#step-1`) ; en l'absence de WebGL il remplace le texte de `#start`.
- Couleurs d'origine (bleu `#4190bb`, orange `#f66439`, fond clair) hors palette ACME : elles doivent être surchargées.
- Le logo ACME a un fond blanc opaque et un texte bleu nuit : il n'est lisible que sur surface claire.

## Décisions

### D1 — Où placer le style : nouveau fichier `css/acme.css`
- **Decision**: créer `css/acme.css`, chargé après `css/multi.css`, qui surcharge `#global`, `#title`, `#menu`, `#menu div`, `#start` et définit `#acme-brand`.
- **Rationale**: modification minimale et réversible (principe IV), diff isolé, aucune règle d'origine modifiée.
- **Alternatives considered**: éditer `css/multi.css` (retour arrière moins lisible, mélange avec les écrans 2 à 5) ; style inline dans `index.html` (déjà un bloc `<style>`, mais mélange structure et habillage, moins identifiable).

### D2 — Où placer le contenu : bloc HTML `#acme-brand` dans `#step-1`
- **Decision**: ajouter dans `#step-1`, entre `#title` et `#menucontainer`, un bloc `#acme-brand` contenant l'image du logo, le nom « ACME » et le message d'accueil. Aucun JavaScript.
- **Rationale**: le contenu est statique ; le HTML est l'endroit naturel (FR-001 à FR-003). Aucune interférence avec `launch.js`. Le message est balisé `lang="fr"` car la page est déclarée `lang="en"`.
- **Alternatives considered**: injection par `launch.coffee` (modifierait le code applicatif et obligerait à recompiler le JS, contraire aux principes II et IV) ; pseudo-élément CSS `content:` (texte non sélectionnable/accessible, logo en `background-image` sans texte alternatif).

### D3 — Masquer le logo HexGL
- **Decision**: `#title { display: none; }` dans `acme.css`. Le fichier `title.png` reste dans le dépôt.
- **Rationale**: clarification validée (« masqué et remplacé »). Réversible sans toucher aux assets. En cas d'échec de chargement du logo ACME, le logo HexGL ne réapparaît pas (cas limite de la spec).
- **Alternatives considered**: supprimer `<div id="title">` de `index.html` (suppression moins réversible, et `#title` pourrait servir à du CSS existant) ; remplacer `title.png` (détruit l'asset d'origine).

### D4 — Fond sombre
- **Decision**: `#global { background: #08090D; animation: none; }` (neutralise `bg.jpg`, flou clair incompatible avec FR-004). Le `body` reste blanc dans `multi.css` mais est entièrement recouvert par `#global` (position absolue plein écran) à l'écran d'accueil.
- **Rationale**: FR-004 impose le noir profond #08090D ; l'animation de flottement d'un fond uni est sans objet.
- **Alternatives considered**: superposer un voile sombre sur `bg.jpg` (couleurs mélangées, hors palette) ; dégradé violet → bleu en fond (la charte réserve le dégradé aux accents).

### D5 — Présentation du logo sur fond sombre
- **Decision**: afficher le logo dans un panneau `#FFFFFF` aux coins arrondis, avec marge intérieure (zone de respiration), `max-width`/`max-height` proportionnels à la fenêtre, `width:auto; height:auto` pour conserver le rapport d'aspect. Aucune ombre, aucun contour, aucun filtre.
- **Rationale**: le logo n'a pas de version inversée ; la charte interdit la recoloration, l'ombre et le contour et demande un fond lisible (FR-001, FR-005). Cette solution correspond à l'hypothèse de la spec.
- **Alternatives considered**: `filter: invert()` (recoloration interdite) ; logo directement sur fond noir (texte bleu nuit illisible).

### D6 — Palette appliquée au menu
- **Decision**: texte des lignes du menu en `#FFFFFF`, bandes de fond remplacées par un dégradé horizontal `#7628FF → #315BFF` (dégradé événementiel), `#start` en blanc de taille supérieure avec soulignement cyan `#00C4E8`, survol en texte blanc conservé (le gris clair `#E6E8EE` tombe à ≈ 4,4:1 sur le bleu `#315BFF`, sous le seuil de 4,5:1 de FR-006) ; l'effet d'échelle d'origine marque le survol. Suppression des ombres de texte blanches.
- **Rationale**: tous les accents proviennent de la palette (FR-004, SC-003) ; contraste blanc sur #7628FF ≈ 6:1 et sur #315BFF ≈ 5,6:1, suffisant pour FR-006. Le texte cyan sur violet serait trop peu contrasté (≈ 2,5:1) et est donc évité pour le texte courant.
- **Alternatives considered**: conserver les bandes blanches translucides (texte blanc illisible) ; garder le bleu/orange d'origine (hors charte).
- **Point à valider à l'implémentation** : mesurer les contrastes réels sur le rendu, ajuster les bords transparents du dégradé si besoin.

### D7 — Typographie
- **Decision**: conserver `BebasNeueRegular` (déjà chargée par `css/fonts.css`) avec repli `arial, sans-serif`.
- **Rationale**: FR-006 interdit toute nouvelle dépendance de police ; la charte tolère la police existante pour l'intégration legacy.
- **Alternatives considered**: police de la charte via Google Fonts (dépendance externe interdite).

### D8 — Mise en page responsive
- **Decision**: bloc de marque positionné en haut (`position:absolute`, comme `#title`), dimensions exprimées en `vw`/`vh` avec bornes (`min()`, `max()`), menu inchangé en bas (`#menucontainer`, `bottom:10%`). Le logo occupe au plus ~25 % de la hauteur de fenêtre, le message une ligne ou deux à taille fluide.
- **Rationale**: à 1024×768 le menu (5 lignes) occupe le bas ; le haut doit rester libre sans chevauchement (SC-005, cas limite fenêtre étroite). Pas de JavaScript de redimensionnement.
- **Alternatives considered**: flexbox sur tout `#step-1` (restructure `#menucontainer`, plus invasif) ; media queries multiples (plus de code à maintenir).

### D9 — Ce qui n'est pas modifié (périmètre)
- `<title>`, balises `og:*`, favicon, `meta description` : le ticket ne demande que l'écran d'accueil ; leur modification relèverait d'une autre décision (références `hexgl.bkcore.com`). Écrans d'aide, chargement, score et crédits inchangés (Assumptions de la spec).
- Anomalies héritées de `docs/architecture.md` §6 : non corrigées (FR-011), notamment les deux `id="ctrl-help"` en double.

### D10 — Stratégie de vérification
- **Decision**: (1) suite QUnit existante en non-régression ; (2) Playwright via `.claude/skills/run-hexgl/driver.mjs` pour charger l'écran d'accueil, relever couleurs calculées et rectangles de `#acme-brand`, `#menu` à 1024×768 et 1920×1080, simuler l'échec du logo et l'absence de WebGL, puis lancer un démarrage de course (sans course complète) ; (3) validation humaine ACME.
- Les scripts Playwright sont ponctuels et non versionnés (principe IV) ; leurs résultats et captures sont consignés dans le compte rendu de fin de ticket et dans `specs/001-acme-event-branding/captures/`.
- **Rationale**: la fonctionnalité est purement visuelle ; QUnit ne peut ni lancer le jeu ni WebGL (principe VI) et sous `file://` ne peut pas lire `index.html`/CSS de façon fiable. Aucun nouveau script n'étant ajouté, aucun test QUnit n'a de cible.
- **Alternatives considered**: test QUnit lisant `css/acme.css` par `fetch` (échoue sous `file://`, utilisé par `ci-chrome.bat`) ; comparaison pixel à pixel avec `1-menu.png` (interdit par la constitution pour les changements visuels).
- **Captures**: les captures de référence `formation/tests/captures/` ne sont pas régénérées ; les nouvelles captures de preuve sont stockées dans `specs/001-acme-event-branding/captures/` (à créer à l'implémentation).
