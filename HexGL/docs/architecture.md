# Architecture de HexGL

> Document généré par exploration du dépôt (lecture seule). HexGL est un jeu de course futuriste en WebGL, développé par Thibaut Despoulain (BKcore), dont le développement est en pause (« hiatus » selon le README).

## 1. Vue d'ensemble

HexGL est une application **client-only**, statique, sans backend ni serveur de jeu. Il n'existe :
- ni outil de build (`gulpfile.js`, `Gruntfile.js`, `Makefile`) ;
- ni intégration continue (`.travis.yml`, `.github/workflows/`).

Un `package.json` minimal existe désormais à la racine (voir §10) : il n'introduit ni dépendance ni étape de build, seulement deux scripts npm (`test`, `start`).

Le déploiement consiste simplement à déposer les fichiers statiques sur un serveur web (Apache, via `.htaccess`, ou tout serveur HTTP basique pour le développement local — le README suggère `python -m SimpleHTTPServer`).

## 2. Stack technique

| Domaine | Choix |
|---|---|
| Rendu 3D | **Three.js**, vendorisé directement dans `libs/` (`Three.dev.js` chargé en prod, `Three.r53.js` non utilisé, conservé en référence) |
| Langages source | JavaScript ES5 (`bkcore/`) et CoffeeScript (`bkcore.coffee/*.coffee`, compilé à la main en `.js` committé, sans tâche de build automatisée) |
| Shaders | GLSL embarqué dans `bkcore/threejs/Shaders.js` et dans les passes de post-processing vendorisées |
| Entrées | Clavier, tactile, gamepad, inclinaison (orientation), et Leap Motion (`libs/leap-0.4.1.min.js`) |
| Persistance | `localStorage` du navigateur (meilleurs temps, export de replay) |
| Analytics | Snippet Google Analytics inline dans `index.html` |
| Outils de debug | `Stats.js` (FPS), `DAT.GUI.min.js` (panneau de réglages), `Detector.js` (détection support WebGL) |

Aucun module bundler : chaque fichier est chargé via une balise `<script>` dans `index.html`, dans un ordre de dépendance précis, et vient peupler un espace de noms global partagé `window.bkcore`.

## 3. Points d'entrée

- **`index.html`** — unique page HTML. Définit le DOM du menu et des écrans de jeu (`#step-1` menu, `#step-2` aide aux contrôles, `#step-3` barre de progression, `#step-4` conteneur du canvas de jeu, `#step-5` écran de fin, `#credits`), puis charge tous les scripts dans l'ordre : libs → contrôleurs → utils → wrappers Three.js → audio → modules HexGL → données de piste → `HexGL.js` → `launch.js`.
- **`launch.js`** (compilé depuis `launch.coffee`) — met en place le menu (type de contrôle, qualité, HUD, mode « god mode » via paramètres d'URL ou clic), vérifie le support WebGL (`hasWebGL()`), puis au clic sur « Start » instancie `new bkcore.hexgl.HexGL({...})` et enchaîne `.load()` → `.init()` → `.start()`.
- `manifest.webapp` référence un `index-mobile.html` qui **n'existe pas** dans ce dépôt — probablement présent dans une branche mobile de l'upstream, absent de cette copie.

## 4. Architecture du cœur de jeu (`bkcore/`)

Organisation par sous-espace de noms sous `bkcore.*` :

### `bkcore/hexgl/` — logique de jeu

- **`HexGL.js`** — classe façade/orchestrateur. Possède le `THREE.WebGLRenderer`, un `RenderManager`, et la piste courante.
  - `initRenderer()` — crée le renderer WebGL avec réglages dépendants de la qualité (shadow maps, correction gamma).
  - `initGameComposer()` — construit le pipeline de post-processing (`EffectComposer`) : passe ciel, passe modèle, bloom (qualité haute), shader « hexvignette » ou passe écran simple selon la qualité.
  - `initGameplay()` — instancie `Gameplay` et démarre l'audio d'ambiance/vent.
  - `displayScore()` — mise à jour de l'UI de fin de course, enregistrement dans `localStorage`, liens de partage social, affichage du classement.
  - `tweakShipControls()` — applique le réglage physique selon la difficulté (poussée, traînée, vitesse angulaire, dégâts du bouclier) directement sur `ShipControls`.
  - `start()`/`update()` — boucle `requestAnimationFrame`, délègue à `gameplay.update()` et `manager.renderCurrent()`.
- **`Gameplay.js`** — machine à états du jeu : décompte, suivi des tours/checkpoints par lecture de couleur de pixel sur une texture d'analyse de collision, conditions de victoire/défaite, trois modes de jeu enfichables (`timeattack`, `survival` — stub, `replay`).
- **`ShipControls.js`** (~800 lignes, module le plus volumineux) — physique et entrées du vaisseau : poussée, dérive, réponse aux collisions, bouclier/dégâts, boost, constantes réglables par difficulté.
- **`ShipEffects.js`** — effets visuels liés au vaisseau (particules du réacteur, traînée de boost, étincelles de dégâts), basé sur `bkcore/threejs/Particles.js`.
- **`CameraChase.js`** — caméra de poursuite, plus un mode orbite utilisé en replay.
- **`HUD.js`** — overlay HUD 2D basé sur un `<canvas>` (vitesse, bouclier, tour/temps).
- **`RaceData.js`** — enregistre/exporte/importe/interpole les positions du vaisseau dans le temps, pour la fonctionnalité de replay.
- **`Ladder.js`** — logique de tableau des scores/Hall of Fame.
- **`tracks/Cityscape.js`** — unique piste livrée. Définit point/rotation de départ, checkpoints, manifeste de chargement de textures par palier de qualité, et les méthodes `buildMaterials()`/`buildScenes()` qui assemblent la scène Three.js.

### `bkcore/threejs/` — infrastructure de rendu réutilisable, découplée de la logique HexGL

- **`RenderManager.js`** — petit gestionnaire de boucle de rendu multi-scène/multi-caméra (`add`/`get`/`setCurrent`/`renderCurrent`), utilisé par `HexGL.js` pour basculer entre scènes/passes « ciel » et « jeu ».
- **`Loader.js`** — chargeur/registre générique d'assets (textures, géométries).
- **`Preloader.js`** — aide à l'affichage de la progression de chargement ; **présent mais non référencé** dans `index.html`, potentiellement mort/legacy.
- **`Particles.js`** — système de particules pour traînées/effets.
- **`Shaders.js`** (~950 lignes) — définitions GLSL personnalisées, dont le shader signature « hexvignette ».

### `bkcore/Audio.js`

Gestionnaire audio global simple (`play`, `stop`, `volume`) encapsulant `<audio>`/Web Audio pour les sons `bg.ogg`, `boost.ogg`, `crash.ogg`, `destroyed.ogg`, `wind.ogg`.

### `bkcore.coffee/` — arbre de sources parallèle (dette technique)

Modules transverses écrits en CoffeeScript, avec leur `.js` compilé committé à côté :
- `controllers/TouchController.js`, `OrientationController.js`, `GamepadController.js` — abstractions d'entrée, chargées directement par `index.html`.
- `Timer.js`, `ImageData.js`, `Utils.js` — utilitaires généraux (`bkcore.Utils.getURLParameter`, `isTouchDevice`, etc.).
- `threejs/Particles.coffee` — **implémentation dupliquée/divergente** par rapport à `bkcore/threejs/Particles.js` (à réconcilier).
- `tests.html` — harnais de test manuel autonome pour `ImageData`.

## 5. Bibliothèques tierces vendorisées (`libs/`)

| Fichier | Rôle |
|---|---|
| `Three.dev.js` | Moteur 3D WebGL — chargé en production |
| `Three.r53.js` | Ancienne révision figée — non chargée, conservée en référence |
| `ShaderExtras.js` | Shaders Three.js additionnels (vignette, screen, fxaa) |
| `postprocessing/EffectComposer.js`, `RenderPass.js`, `BloomPass.js`, `ShaderPass.js`, `MaskPass.js` | Pipeline de post-processing effectivement utilisé |
| `postprocessing/TexturePass.js`, `SavePass.js`, `FilmPass.js`, `DotScreenPass.js` | Passes vendorisées mais **non utilisées** dans ce build |
| `Detector.js` | Détection du support WebGL |
| `Stats.js` | Widget FPS/perf (outil de dev) |
| `DAT.GUI.min.js` | Panneau de réglages de debug (outil de dev) |
| `leap-0.4.1.min.js` | SDK Leap Motion, contrôle gestuel du vaisseau |
| `Editor.html` / `Editor_files/` | Page web vendorisée, probablement un outil d'édition de niveau/scène — à investiguer si besoin |

## 6. Composant serveur

**Aucun.** Pas de serveur Node, pas de réseau/multijoueur, pas d'API. `.htaccess` ne fait que configurer les types MIME et en-têtes de cache pour `.webapp`/`.appcache` (config Apache statique).

## 7. Organisation des assets

- **Géométries** (`geometries/`) — données de géométrie Three.js pré-exportées :
  - `geometries/ships/feisar/feisar.js` — vaisseau du joueur
  - `geometries/booster/booster.js` — pickup de boost
  - `geometries/bonus/base/base.js` — item bonus générique
  - `geometries/tracks/cityscape/` — géométrie de piste en plusieurs mesh (`track.js`, `scrapers1.js`, `scrapers2.js`, `start.js`, `startbanner.js`, `bonus/speed.js`)
- **Textures** — `textures/` (défaut, basse résolution) et `textures.full/` (haute résolution, à substituer manuellement selon le README) ; mêmes sous-dossiers en miroir : `bonus/`, `checker.png`, `hud/`, `particles/`, `ships/`, `skybox/`, `tracks/`.
- **Audio** — dossier plat `audio/` : `bg.ogg`, `boost.ogg`, `crash.ogg`, `destroyed.ogg`, `wind.ogg`, plus une `LICENSE` dédiée.
- **Polices/UI** — `css/` contient la police Bebas Neue (4 formats) et les images de menu/aide.
- **Niveaux** — une seule piste livrée (« Cityscape »), définie en code (pas de fichiers de niveau séparés), avec des paliers de qualité pilotés par données.
- **Replays** — `replays/cityscape-casual/bkcore.replay.json`, données de course enregistrées pour la fonctionnalité de replay.

## 8. Fichiers de configuration notables

- **`manifest.webapp`** — manifeste Firefox OS / Open Web App (nom, icônes, `launch_path: /index-mobile.html`, orientation paysage).
- **`package.webapp`** — manifeste d'app empaquetée pointant vers `package.zip` (archive pré-construite de ~3 Mo présente à la racine).
- **`cache.appcache`** — manifeste HTML5 AppCache (mécanisme legacy hors-ligne) listant les assets nécessaires au build mobile/basse qualité.
- **`.htaccess`** — config Apache (types MIME/cache pour `.webapp`/`.appcache`).
- **`.gitignore`** — minimal (`.DS_Store` uniquement).
- Aucun outil de lint/formatage/CI.

## 9. Documentation existante

- **`README.md`** — description succincte, crédit à Thibaut Despoulain/BKcore, précision que seule la branche `Master` est publique, licence MIT, instructions d'installation (clone + serveur statique local + Chromium), astuce de permutation `textures/`↔`textures.full/` pour la qualité, mention que le développement est en pause.
- **`LICENSE`** — licence MIT (code).
- **`audio/LICENSE`** — licence distincte pour les assets audio.
- Aucun dossier `docs/` préexistant, pas de notes d'architecture, peu de documentation inline (en-têtes de fichier auteur/licence, et un commentaire de type JSDoc dans `RenderManager.js`).

> Note : `formation/` (tickets, charte graphique ACME, etc.) fait partie du matériel d'exercice de cette formation Claude Code et n'appartient pas au jeu HexGL original.

## 10. Build & déploiement

Aucun système de build n'existe dans le dépôt :
- En développement local : lancer un serveur de fichiers statique quelconque et ouvrir `index.html`.
- Les fichiers CoffeeScript sont compilés manuellement en `.js`, committés à côté de leur source (ex. `launch.coffee` → `launch.js`), sans tâche de watch/compile automatisée.
- `cache.appcache`, `manifest.webapp`, `package.webapp` et `package.zip` représentent des cibles d'empaquetage alternatives (offline/app Firefox OS), mais aucun script ne génère `package.zip` — il semble maintenu manuellement.
- `.htaccess` constitue la seule configuration de « déploiement », pour un hébergement statique Apache.
- Un `package.json` minimal a été introduit : `npm test` exécute `node --test test/*.test.js` (aucune dépendance, uniquement `node:test`/`node:assert` — voir §11 point 4) ; `npm start` lance `npx --yes http-server .` comme alternative au `python -m SimpleHTTPServer` suggéré par le README.

## 11. Points de dette technique à surveiller

1. **Deux arbres de sources parallèles** (`bkcore/` vs `bkcore.coffee/`) avec au moins une implémentation divergente (`Particles`).
2. **Fichiers vendorisés inutilisés** : `Three.r53.js`, `Preloader.js`, plusieurs passes de post-processing (`TexturePass`, `SavePass`, `FilmPass`, `DotScreenPass`).
3. **Référence cassée** : `manifest.webapp` pointe vers `index-mobile.html`, absent du dépôt.
4. **Absence de build/lint/CI.** Un filet de tests de non-régression existe désormais (`test/`, runner natif `node --test`, sans dépendance) mais reste partiel : il protège des fonctions pures ciblées (`bkcore.Timer`, `bkcore.ImageData`, `branding.validateBranding` — voir §12), pas le gameplay ni le rendu WebGL, qui restent à vérifier manuellement en navigateur.

## 12. Personnalisation visuelle additive (branding)

Un mécanisme générique de re-habillage de l'écran d'accueil (`#step-1`) a été ajouté, sans toucher au moteur de jeu :

- **`branding/config.js`** — unique source de vérité runtime (`window.HexGLBranding`) : logo, nom, message d'accueil, palette de couleurs. Données pures, aucune logique.
- **`branding/validateBranding.js`** — validation pure (`{valid, errors}`), exportée en dual Node/navigateur selon le même pattern que `bkcore.coffee/Timer.js` (voir piège ci-dessous).
- **`branding/apply-branding.js`** — lit et valide le config, puis applique les valeurs au DOM existant (custom properties CSS, contenu texte, `src`/`alt` du logo). Conception **fail-open** : toute erreur (config absente/invalide, asset manquant) est loguée en console sans jamais rendre l'écran d'accueil inutilisable.
- **`css/branding-acme.css`** — chargé après `css/multi.css`. Chaque règle consomme une custom property (`var(--brand-x, valeur-originale)`) : tant que `apply-branding.js` n'a rien posé, le fichier est un no-op visuel.

**Convention établie pour toute personnalisation visuelle future** : ajouter une feuille de style et/ou un script en plus (chargés de façon additive dans `index.html`), ne jamais éditer `css/multi.css`, `launch.js` ou `bkcore/*`/`bkcore.coffee/*`. Cela confirme et exploite le découplage déjà noté en §3 entre `#step-1` (CSS/DOM pur) et le moteur de jeu.

## 13. Pièges connus pour `#step-1` et le pattern d'export dual

1. **Le pattern d'export dual Node/navigateur** (`exports = exports != null ? exports : this;`, utilisé par `bkcore.coffee/Timer.js`, `ImageData.js` et `branding/validateBranding.js`) **nécessite** une déclaration locale `var exports;` en tête de l'IIFE. Sans elle, le module fonctionne sous Node (où `exports` existe comme paramètre du wrapper de module — faux positif en test) mais lève une `ReferenceError` dans un `<script>` de navigateur classique, où `exports` n'est défini nulle part.
2. **Stacking CSS dans `#step-1`** : `#global` et `#title` sont `position:absolute` (voir `css/multi.css`), même à `z-index:0`. Tout contenu ajouté en flux normal (non positionné) se peint **sous** eux et reste invisible, quel que soit l'ordre dans le DOM. Tout nouvel élément visible dans `#step-1` doit vivre dans un conteneur positionné (`position` + `z-index` explicites).
3. **Flexbox et éléments positionnés** : un enfant `position:absolute` (comme `#menucontainer` dans `css/multi.css`, pensé pour flotter seul) est **ignoré par l'algorithme flexbox** — il faut explicitement le repasser en `position:static`/`relative` pour qu'il rejoigne un conteneur flex et bénéficie de son espacement (`gap`).
4. **`max-height`/`max-width` en `%`** sur un descendant d'un élément positionné dont la hauteur n'est définie que par `top`/`bottom` (sans `height` explicite, pattern courant dans `css/multi.css`) a une résolution peu fiable selon les navigateurs ; préférer des unités viewport (`vh`/`vw`) pour une taille bornée et prévisible.
