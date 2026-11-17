---

description: "Liste des tâches pour la personnalisation événementielle ACME de l'écran d'accueil"
---

# Tasks: Personnalisation événementielle ACME de l'écran d'accueil

**Input**: Design documents from `/specs/001-acme-event-branding/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/ecran-accueil.md, quickstart.md

**Tests**: Aucun test QUnit n'est ajouté (aucun script n'est ajouté ; plan.md, constitution principe VI). Les tâches de vérification utilisent la suite QUnit existante en non-régression et des scripts Playwright ponctuels non versionnés (voir quickstart.md).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Site statique à la racine de `HexGL/` (chemins relatifs à `HexGL/`). Fichiers touchés par cette fonctionnalité : `index.html`, `css/acme.css` (nouveau), `docs/architecture.md`. **Interdit** : modifier `css/multi.css`, `launch.coffee`, `launch.js`, `bkcore/`, `bkcore.coffee/`, `libs/`, `formation/tests/browser-tests.js` (constitution I, II, IV ; FR-007, FR-011).

Commandes : QUnit = `cmd /c ".\ci-chrome.bat"` depuis `HexGL/formation/tests` (PowerShell, code 0 attendu) ; serveur = `python -m http.server 8000` depuis `HexGL/` ; driver = `node .claude/skills/run-hexgl/driver.mjs`.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Point de départ vérifié avant toute modification

- [X] T001 Créer le dossier `specs/001-acme-event-branding/captures/` (preuves de rendu) sans toucher à `formation/tests/captures/` qui sert de référence aux éléments à préserver
- [X] T002 Lancer la suite QUnit existante (`cmd /c ".\ci-chrome.bat"` depuis `formation/tests`) et noter le résultat de référence (code 0 attendu ; si code 2, le signaler et ne pas le compter comme réussi) dans `specs/001-acme-event-branding/captures/notes-verification.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Brancher la feuille de style de surcharge, prérequis commun aux trois stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Créer `css/acme.css` avec un commentaire d'en-tête décrivant son rôle (surcharges de l'écran d'accueil `#step-1` pour l'événement ACME) et la procédure de retour arrière : retirer le `<link>` et le bloc `#acme-brand` d'`index.html`, puis supprimer ce fichier (FR-010)
- [X] T004 Ajouter dans `<head>` de `index.html`, juste après la ligne `<link rel="stylesheet" href="css/fonts.css" …>`, la ligne `<link rel="stylesheet" href="css/acme.css" type="text/css" charset="utf-8">` (chargée après `css/multi.css`), sans modifier l'ordre ni la liste des `<script>` (principe V)

**Checkpoint**: La page se charge toujours à l'identique avec `css/acme.css` vide de règles

---

## Phase 3: User Story 1 - Accueil aux couleurs d'ACME (Priority: P1) 🎯 MVP

**Goal**: L'écran d'accueil affiche le logo ACME, le nom « ACME » et le message « Bienvenue au ACME Racing Challenge » sur fond noir profond avec les accents de la charte ; le logo HexGL est masqué.

**Independent Test**: Ouvrir `http://localhost:8000/index.html` : logo ACME net sur panneau blanc arrondi, nom et message visibles, fond `#08090D`, accents de la charte uniquement, aucun logo HexGL (quickstart.md §2).

### Implementation for User Story 1

- [X] T005 [US1] Dans `index.html`, insérer dans `<div id="step-1">`, entre `<div id="title"></div>` et `<div id="menucontainer">`, le bloc `<div id="acme-brand">` contenant : une image `<img src="formation/identite/logo.png" alt="Logo ACME">` (sans attribut `width`/`height` forçant le ratio), un élément texte `ACME` (nom de l'entreprise, texte réel et non image) et un élément texte `Bienvenue au ACME Racing Challenge` portant `lang="fr"` ; ne modifier aucun identifiant existant (`#start`, `#s-controlType`, `#s-quality`, `#s-hud`, `#s-godmode`, `#s-credits`) ni aucun libellé du menu
- [X] T006 [P] [US1] Dans `css/acme.css`, masquer le logo HexGL (`#title { display: none; }`) et mettre le fond en noir profond : `#global { background: #08090D; animation: none; }` (neutralise `bg.jpg`, FR-004)
- [X] T007 [US1] Dans `css/acme.css`, styliser `#acme-brand` : positionné en haut de `#step-1` (`position:absolute`, centré, au-dessus de `#global`, `z-index` ≥ 1) ; le logo dans un panneau `#FFFFFF` aux coins arrondis avec marge intérieure (zone de respiration), `width:auto`/`height:auto` pour conserver le rapport d'aspect d'origine, **sans** `filter`, `box-shadow`, `text-shadow` ni contour sur le logo (FR-001) ; nom « ACME » et message en `#FFFFFF`, police existante `BebasNeueRegular`, `arial, sans-serif` en repli, sans nouvelle police (FR-006) ; accent éventuel (liseré, soulignement) en `#00C4E8` ou dégradé `#7628FF → #315BFF`
- [X] T008 [US1] Dans `css/acme.css`, recolorer le menu avec la palette seule (FR-004, data-model.md) : texte `#menu` en `#FFFFFF`, bandes `#menu div` remplacées par le dégradé horizontal `#7628FF → #315BFF` (bords translucides tolérés), suppression des `text-shadow` blancs, `#start` en `#FFFFFF` plus grand avec soulignement `#00C4E8`, survol en `#FFFFFF` (le gris clair `#E6E8EE` donne ≈ 4,4:1 sur `#315BFF`, sous le seuil de FR-006) ; ne pas utiliser `#4190bb` ni `#f66439` ; ne pas utiliser de texte cyan sur violet (contraste insuffisant)
- [X] T009 [US1] Vérifier avec Playwright (script ponctuel, driver `run-hexgl`) sur `http://localhost:8000/index.html` : textes « ACME » et « Bienvenue au ACME Racing Challenge » visibles ; `#global` en `rgb(8, 9, 13)` ; toutes les couleurs calculées de `#step-1` et descendants dans la palette de data-model.md (variantes translucides tolérées) ; rapport largeur/hauteur de l'image du logo égal à son ratio naturel (±1 %) ; contraste ≥ 4,5:1 pour les textes du menu et du message (FR-006) ; `#title` non visible ; consigner le résultat dans `specs/001-acme-event-branding/captures/notes-verification.md` et enregistrer une capture `specs/001-acme-event-branding/captures/accueil-acme-1920x1080.png`
- [X] T010 [US1] Relancer la suite QUnit existante (`cmd /c ".\ci-chrome.bat"` depuis `formation/tests`) : code 0 attendu (SC-004)

**Checkpoint**: User Story 1 fonctionnelle et testable seule : MVP livrable

---

## Phase 4: User Story 2 - Gameplay et parcours inchangés (Priority: P1)

**Goal**: Parcours (menu → aide → chargement → décompte → course → score), options, paramètres d'URL, crédits et message d'absence de WebGL se comportent comme avant, avec le nouvel habillage.

**Independent Test**: Parcourir l'enchaînement jusqu'au début de course et contrôler options, paramètres d'URL, crédits et cas sans WebGL (quickstart.md §4 et §5). Cette story n'ajoute pas de code : elle valide l'absence de régression.

**Ordre d'exécution** : T011 peut être fait dès la fin d'US1. T012–T014 sont exécutés **après T015** (US3 modifie la mise en page de `css/acme.css`), afin que les preuves portent sur la version finale du style ; si T012–T014 ont été faites avant T015, elles sont refaites une fois après T015.

### Verification for User Story 2

- [X] T011 [US2] Vérifier par `git status --short` et `git diff --stat` (depuis `HexGL/`, le premier affichant aussi les fichiers non suivis) que seuls `index.html`, `css/acme.css`, `docs/architecture.md` et `specs/` sont modifiés ou créés : aucun fichier de `bkcore/`, `bkcore.coffee/`, `libs/`, `launch.coffee`, `launch.js`, `css/multi.css` ne doit apparaître (FR-007, FR-011, constitution I et II)
- [X] T012 [US2] Avec Playwright, charger `index.html?quality=0&hud=0&controlType=1` et vérifier que le menu affiche les valeurs correspondantes comme avant, que les clics sur `#s-controlType`, `#s-quality`, `#s-hud` les font cycler, puis que `#s-credits` ouvre `#credits` et qu'un clic revient à `#step-1` habillé ACME (FR-008)
- [X] T013 [US2] Avec Playwright (Chrome, `?quality=0`), cliquer `#start` → `#step-2` (aide) → clic → `#step-3` → `#step-4` jusqu'au début de course (décompte visible, HUD actif si `hud=1`) ; une course complète n'est pas requise (constitution, Vérification) ; enregistrer une capture `specs/001-acme-event-branding/captures/course-demarree.png`
- [X] T014 [US2] Vérifier le cas sans WebGL (WebGL désactivé ou `getContext("webgl")` bloqué dans Playwright) : `#start` affiche « WebGL is not supported! », lisible avec contraste ≥ 4,5:1 sur le nouvel habillage (FR-009) ; si la vérification est impossible dans l'environnement, le signaler explicitement dans `specs/001-acme-event-branding/captures/notes-verification.md` sans la compter comme réussie

**Checkpoint**: User Stories 1 et 2 validées : branding présent, comportement inchangé

---

## Phase 5: User Story 3 - Lisibilité sur différents formats d'écran (Priority: P2)

**Goal**: L'écran d'accueil reste propre et lisible à 1024×768, 1920×1080 et en fenêtre étroite ; la personnalisation est sobre, maintenable et réversible.

**Independent Test**: Afficher l'écran d'accueil à plusieurs tailles et vérifier l'absence de chevauchement et de troncature (quickstart.md §3).

### Implementation for User Story 3

- [X] T015 [US3] Dans `css/acme.css`, rendre `#acme-brand` adaptable sans JavaScript : dimensions du logo (≈ 25 % de la hauteur de fenêtre au plus, `max-width` proportionnel à la largeur) et taille du message exprimées en `vw`/`vh` avec bornes (`min()`, `max()`/`clamp()`), message sur une ou deux lignes sans troncature ; menu `#menucontainer` laissé tel quel en bas (plan.md D8) ; rester sobre : aucune animation ni effet supplémentaire (FR-010)
- [X] T016 [US3] Vérifier avec Playwright à 1024×768 et 1920×1080 que `getBoundingClientRect()` de `#acme-brand` et de `#menu` sont entièrement dans la fenêtre et sans chevauchement (SC-005) ; vérifier aussi 800×600 et 600×800 (message non tronqué au point d'être illisible) ; enregistrer `specs/001-acme-event-branding/captures/accueil-acme-1024x768.png` et consigner les mesures dans `notes-verification.md`
- [X] T017 [US3] Vérifier le cas limite « logo indisponible » (requête de `formation/identite/logo.png` bloquée dans Playwright) : le nom « ACME » reste visible, aucun logo HexGL ne réapparaît, le menu reste utilisable
- [X] T018 [US3] Vérifier la réversibilité (FR-010) sur une **copie temporaire hors dépôt** (par ex. copie du dossier `HexGL/` dans le répertoire temporaire du système), jamais dans la copie de travail : dans la copie, retirer le `<link>` et le bloc `#acme-brand` d'`index.html` puis supprimer `css/acme.css`, et constater que l'écran d'accueil d'origine revient (logo HexGL visible, menu d'origine) ; supprimer ensuite la copie. Ne pas utiliser `git stash` (il ne sauvegarde pas les fichiers non suivis comme `css/acme.css`) et ne jamais supprimer `css/acme.css` de la copie de travail

**Checkpoint**: Les trois stories sont validées

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation finale et validation humaine

- [X] T019 [P] Mettre à jour `docs/architecture.md` (constitution V) : mentionner `css/acme.css` dans la liste des fichiers `css/` (§3, Assets) et le bloc `#acme-brand` dans le flux du menu (§2, étape 3 ou §1 pour `index.html`) ; ne rien ajouter sur d'éventuelles corrections, le document reste descriptif
- [X] T020 Relancer la suite QUnit complète en fin de ticket (`cmd /c ".\ci-chrome.bat"`, code 0 attendu) puis effectuer **une seule** passe finale de contrôle visuel à partir de `quickstart.md` (§2 et §5) ; ne pas répéter les vérifications Playwright déjà réussies en T009 et T012–T017 si `index.html` et `css/acme.css` n'ont pas changé depuis (constitution : « sans répétitions inutiles ») ; consigner le bilan, les captures et toute vérification impossible dans `specs/001-acme-event-branding/captures/notes-verification.md`
- [X] T021 Passer en revue `index.html` et `css/acme.css` : seules les couleurs de data-model.md, aucune dépendance, aucun script ajouté, aucun refactoring ou renommage hors périmètre, anomalies de `docs/architecture.md` §6 (dont les deux `id="ctrl-help"`) non corrigées (FR-011)
- [ ] T022 Demander à ACME (ou son représentant) la validation humaine de la conformité à la charte à partir des captures de `specs/001-acme-event-branding/captures/` ; la fonctionnalité n'est pas terminée tant que cette validation (SC-006, constitution VII) n'est pas obtenue

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: aucune dépendance
- **Foundational (Phase 2)**: dépend du Setup ; bloque toutes les stories
- **User Stories (Phase 3+)**: dépendent de la Phase 2. Elles modifient le même fichier `css/acme.css` : à enchaîner dans l'ordre US1 → US3 (T015) → vérifications US2 (T012–T014). US2 est de la vérification, sans écriture de code ; seul T011 peut être fait avant T015
- **Polish (Phase 6)**: dépend des stories voulues

### User Story Dependencies

- **US1 (P1)**: après la Phase 2, sans dépendance sur les autres stories
- **US2 (P1)**: vérifie le travail d'US1 (même page) ; n'ajoute aucun code
- **US3 (P2)**: affine `css/acme.css` créé par US1 ; testable à part une fois US1 faite

### Within Each Story

- T005 (HTML) et T006 (CSS) touchent des fichiers différents : parallélisables ; T007 puis T008 écrivent dans `css/acme.css` : à enchaîner
- Vérification (T009, T010) après les tâches de rendu
- Commit après chaque phase ou groupe logique

### Parallel Opportunities

- Setup : T001 puis T002 (séquentiels, T002 écrit dans le dossier créé par T001)
- T005 et T006 (US1, fichiers différents)
- T019 (documentation) en parallèle des vérifications finales T020/T021

---

## Parallel Example: User Story 1

```text
# Lancer ensemble (fichiers différents) :
Task: "T005 Ajouter le bloc #acme-brand dans #step-1 de index.html"
Task: "T006 Masquer #title et mettre #global en #08090D dans css/acme.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 : Setup
2. Phase 2 : Foundational (feuille de style branchée)
3. Phase 3 : User Story 1
4. **STOP and VALIDATE** : contrôle visuel + QUnit (T009, T010)
5. Montrer à ACME si prêt

### Incremental Delivery

1. Setup + Foundational → feuille de style branchée
2. US1 → MVP visible
3. US2 → preuve de non-régression (parcours, options, WebGL, crédits)
4. US3 → lisibilité multi-formats et réversibilité
5. Polish → documentation, validation finale, validation humaine ACME

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Aucune modification de `launch.*`, `bkcore/`, Three.js ou CoffeeScript ; aucun script ajouté donc `formation/tests/index.html` reste inchangé
- Ne pas régénérer `formation/tests/captures/` ; ne pas comparer le visuel aux captures initiales (constitution, Vérification)
- Toute vérification impossible doit être signalée et non comptée comme réussie
- Commit after each task or logical group
