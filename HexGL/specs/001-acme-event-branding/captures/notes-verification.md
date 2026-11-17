# Notes de vérification — 001-acme-event-branding

## T002 — Baseline QUnit (avant modification)
- `cmd /c ".\ci-chrome.bat"` : STATUT=TESTS_REUSSIS CODE=0.

## T009 — Rendu de l'accueil (Playwright, Chrome, 1920×1080)
Script ponctuel non versionné. Bilan : 13/13 OK.
- Nom « ACME » et message « Bienvenue au ACME Racing Challenge » visibles ; logo chargé (2172×724), rapport d'aspect rendu 3,0000 = naturel (713×238 px).
- Logo : fond blanc, aucun filtre, ombre, contour ; coins arrondis 24 px. `#title` (logo HexGL) non visible.
- `#global` : `rgb(8, 9, 13)`, sans image ni animation.
- Toutes les couleurs rendues de `#step-1` dans la palette (alpha 0 tolérée sur les bords du dégradé).
- Contrastes : cyan/fond 9,53 ; blanc/fond 19,90 ; texte du menu sur dégradé (zone de texte) 5,35 ; survol 5,35.
- Écart par rapport au plan : le survol en gris clair `#E6E8EE` donnait 4,37:1 sur le bleu (< 4,5 de FR-006). Survol conservé en blanc, l'effet d'échelle d'origine marque le survol. Documents alignés (research D6, tasks T008, data-model).
- Capture : `accueil-acme-1920x1080.png`.

## T010 — QUnit après US1
- `ci-chrome.bat` : STATUT=TESTS_REUSSIS CODE=0.

## T011 — Périmètre des fichiers modifiés
- `git status --short` : `M index.html`, `?? css/acme.css`, `?? specs/`. `git diff --stat` : index.html, +6 lignes. Aucun fichier de `bkcore/`, `bkcore.coffee/`, `libs/`, `launch.*`, `css/multi.css`.

## T012 — Options, paramètres d'URL, crédits (Playwright, après T015)
- `?quality=0&hud=0&controlType=1` : Controls Touch (valeur effective de controlType=1 dans l'existant), Quality Low, HUD Off ; les 3 options cyclent au clic ; crédits s'ouvrent et se ferment avec retour à l'accueil habillé ; aucune erreur JS. Bilan 5/5 OK.

## T013 — Parcours jusqu'au début de course
- Driver `run-hexgl play` (qualité LOW, godmode) : menu → aide → chargement → course, HUD, chrono (0'2"32) et vitesse (252) visibles, vaisseau en mouvement (speed ≈ 3,99), aucune erreur console. Course complète non effectuée (gameplay non touché). Capture : `course-demarree.png` (et `accueil-acme-1024x640.png`). Écran de score non exercé : aucun code modifié (T011).

## T014 — Sans WebGL
- `getContext("webgl")` bloqué : « WEBGL IS NOT SUPPORTED! » affiché dans `#start`, blanc sur dégradé (contraste 5,35). Bilan 2/2 OK. Capture : `accueil-sans-webgl.png`.

## T015 — Mise en page adaptable
- `css/acme.css` : tailles du logo (max 22 vh / 70 vw), du nom et du message en `clamp()` avec `vw`/`vh` ; aucun JavaScript, aucune animation ajoutée.

## T016 — Cadrages (Playwright, `getBoundingClientRect`)
Bilan 20/20 OK. `#acme-brand` et `#menu` dans la fenêtre, sans chevauchement, message sans débordement horizontal :
| Fenêtre | bas de `#acme-brand` | haut de `#menu` |
|---|---|---|
| 1024×768 (et émulation tactile) | 319 | 439 |
| 1920×1080 | 424 | 720 |
| 800×600 | 251 | 288 |
| 600×800 | 261 | 468 |
Captures : `accueil-acme-1024x768.png`, `accueil-acme-1920x1080.png`, `accueil-acme-600x800.png` (plus `accueil-acme-1024x640.png`, issue du driver).

## T017 — Logo indisponible
- Requête de `logo.png` bloquée : nom « ACME » visible, logo HexGL toujours masqué, menu utilisable (3/3 OK). Le navigateur affiche l'icône d'image cassée et le texte alternatif « Logo ACME » dans la pastille blanche (acceptable, signalé à ACME). Capture : `accueil-sans-logo.png`.

## T018 — Réversibilité (copie temporaire hors dépôt, supprimée ensuite)
- Dans la copie : `<link>` et `#acme-brand` retirés, `css/acme.css` supprimé → accueil d'origine rétabli : `#title` affiché (`title.png`), fond `bg.jpg`, `#start` en `rgb(246, 100, 57)` (#f66439), aucun `#acme-brand`.
- Copie de travail intacte (`git status` : `M index.html`, `?? css/acme.css`, `?? specs/`).

## T019 — Documentation
- `docs/architecture.md` : `css/acme.css` ajouté à la liste des feuilles de style (§3) et bloc `#acme-brand` décrit au flux du menu (§2, étape 2). Rien d'autre modifié.

## T020 — Bilan final
- QUnit : STATUT=TESTS_REUSSIS CODE=0.
- Rendu : vérification `brand` relancée une fois (le CSS avait changé après T009 avec T015) : 13/13 OK ; capture `accueil-acme-1920x1080.png` mise à jour. Les vérifications de T012–T017 ont été faites après T015 et le CSS n'a plus changé depuis : non répétées.
- Vérifications impossibles ou non effectuées : course complète (non requise, gameplay non touché), écran de score (aucun code modifié) ; validation humaine ACME (T022) en attente.

## T021 — Revue finale
- `index.html` : +1 `<link>`, +5 lignes de bloc `#acme-brand` ; aucun `<script>` ajouté ; ordre des scripts inchangé.
- `css/acme.css` : seules couleurs #08090D, #7628FF, #315BFF, #00C4E8, #FFFFFF (+ #E6E8EE uniquement en commentaire) et variantes alpha 0 des deux tons du dégradé ; aucun `@import`, `url()` ni police ajoutée.
- Fichiers modifiés : `index.html`, `docs/architecture.md` ; créés : `css/acme.css`, `specs/`. Anomalies de `docs/architecture.md` §6 non corrigées.
