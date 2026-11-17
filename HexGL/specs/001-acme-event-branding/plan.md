# Implementation Plan: Personnalisation événementielle ACME de l'écran d'accueil

**Branch**: `001-acme-event-branding` | **Date**: 2026-11-17 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-acme-event-branding/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Habiller l'écran d'accueil (`#step-1` de `index.html`) aux couleurs d'ACME : logo officiel, nom de l'entreprise, message « Bienvenue au ACME Racing Challenge », fond noir profond et accents de la charte. Le logo HexGL d'origine (`css/title.png`) est masqué et remplacé par le logo ACME (clarification du 2026-11-17).

Approche technique, volontairement minimale et réversible :

1. **Un seul nouveau fichier de style**, `css/acme.css`, chargé après `css/multi.css`. Il surcharge uniquement les règles de l'écran d'accueil (`#global`, `#title`, `#menu`, `#start`) et stylise le nouveau bloc de marque. `css/multi.css` n'est pas modifié.
2. **Un petit bloc HTML** `#acme-brand` ajouté dans `#step-1` de `index.html` (logo, nom, message) et une ligne `<link>` vers `css/acme.css`.
3. **Aucun JavaScript, aucun CoffeeScript, aucun script ajouté** : `launch.coffee` / `launch.js`, `bkcore/`, Three.js et la physique ne sont pas touchés. Les identifiants existants (`#start`, `#s-controlType`, `#s-quality`, `#s-hud`, `#s-godmode`, `#s-credits`) sont conservés, donc `launch.js` fonctionne sans changement, y compris le message « WebGL is not supported! » affiché dans `#start`.
4. Le logo est lu directement depuis `formation/identite/logo.png` (source de vérité, pas de copie). Retour arrière : retirer le `<link>`, le bloc `#acme-brand`, puis supprimer `css/acme.css`.

## Technical Context

**Language/Version**: HTML5 + CSS3 pour cette fonctionnalité. Le code applicatif existant reste en JavaScript legacy et CoffeeScript (1.4.0 / 1.7.1 compilé), non modifié.

**Primary Dependencies**: Aucune nouvelle dépendance. Three.js `50dev` embarqué (`libs/Three.dev.js`) conservé tel quel ; police existante Bebas Neue (`css/fonts.css`) conservée.

**Storage**: N/A (aucune donnée persistée ; `localStorage` du jeu non concerné).

**Testing**: Suite QUnit existante (`formation/tests/`, commande `cmd /c ".\ci-chrome.bat"` sous Windows) en non-régression. Vérification du rendu et des cadrages 1024×768 / 1920×1080 avec Playwright via le driver du skill `run-hexgl` (voir `quickstart.md`), au moyen de scripts ponctuels non versionnés (principe IV). Aucun nouveau script JS testable n'étant ajouté, aucun test QUnit n'est ajouté à `formation/tests/index.html`.

**Target Platform**: Navigateurs de bureau avec WebGL, éventuellement borne événementielle ; site statique servi par un serveur HTTP simple (`python -m http.server 8000`).

**Project Type**: Site web statique (jeu WebGL), sans build ni backend.

**Performance Goals**: Aucun impact sur la boucle de jeu : seule la page d'accueil est modifiée (une image de logo + quelques règles CSS). L'animation CSS d'origine du fond (`animbg`) est neutralisée ; aucun nouvel effet.

**Constraints**: Respect de la constitution HexGL v1.0.0 (gameplay inchangé, stack legacy, aucun build/dépendance, modifications minimales et réversibles). Couleurs limitées à la palette de la charte (variantes translucides tolérées) : #08090D, #7628FF, #315BFF, #00C4E8, #FFFFFF, #E6E8EE. Contraste texte/arrière-plan ≥ 4,5:1 (FR-006). Logo non recoloré, non déformé, sans ombre ni contour, posé sur une surface claire arrondie.

**Scale/Scope**: 1 écran (écran d'accueil), 1 nouveau fichier CSS (`css/acme.css`, ≈ 90 lignes), 6 lignes ajoutées dans `index.html` (1 `<link>` et le bloc `#acme-brand`), 2 lignes modifiées dans `docs/architecture.md`, 0 fichier JS modifié.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principe | Verdict | Justification |
|---|---|---|
| I. Préservation du gameplay et des comportements existants | ✅ Conforme | Aucun fichier de `bkcore/`, `launch.*`, `HexGL.js` modifié. Les écrans 2 à 5 ne sont pas touchés. Les anomalies héritées (`docs/architecture.md` §6) ne sont pas corrigées (FR-011). |
| II. Stack legacy conservée | ✅ Conforme | Three.js et CoffeeScript intouchés ; pas de nouvelle source CoffeeScript, donc pas de désynchronisation `.coffee`/`.js`. |
| III. Aucune dépendance, aucun build, aucun backend | ✅ Conforme | CSS et HTML statiques uniquement ; aucune police web ni bibliothèque ajoutée. |
| IV. Modifications minimales et réversibles | ✅ Conforme | Un fichier CSS d'extension + un bloc HTML ; `css/multi.css` non modifié ; retour arrière en 3 étapes identifiées (FR-010). |
| V. Architecture respectée et décisions documentées | ✅ Conforme | Ordre des `<script>` inchangé. Décisions consignées dans `research.md`. `css/acme.css` et `#acme-brand` ajoutés à `docs/architecture.md` (§3 et §2). |
| VI. Réutilisation des tests QUnit existants | ✅ Conforme | Suite existante exécutée en non-régression ; aucun nouveau script testé donc aucun ajout à `formation/tests/index.html` ; aucun test ne lance le jeu ni WebGL. |
| VII. Tests et validation humaine | ⚠️ Dérogation justifiée (voir Complexity Tracking) | Changement visuel sans logique : couvert par la suite QUnit (non-régression) et des vérifications Playwright du rendu (couleurs calculées, absence de chevauchement). Validation humaine ACME obligatoire (SC-006) avant de clore. |
| Vérification | ✅ Conforme | QUnit après chaque phase et en fin de ticket ; rendu vérifié avec Playwright en fin de ticket ; captures initiales utilisées seulement pour les éléments à préserver (options du menu, parcours), pas pour comparer le visuel ; pas de course complète (gameplay non affecté, simple démarrage de course pour vérifier le parcours) ; toute vérification impossible sera signalée. |

**Résultat de la porte initiale** : une seule dérogation, au principe VII (pas de test versionné), justifiée dans Complexity Tracking et soumise à validation humaine.

**Réévaluation après la Phase 1** : inchangée. Le design (CSS de surcharge + bloc HTML, sans JS) ne crée aucune autre violation.

## Project Structure

### Documentation (this feature)

```text
specs/001-acme-event-branding/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── ecran-accueil.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
HexGL/
├── index.html                      # MODIFIÉ : <link> vers css/acme.css + bloc #acme-brand dans #step-1
├── css/
│   ├── multi.css                   # inchangé (styles d'origine)
│   ├── acme.css                    # NOUVEAU : surcharges de l'écran d'accueil + bloc de marque
│   └── title.png                   # inchangé (simplement masqué via #title { display:none })
├── formation/
│   └── identite/logo.png           # inchangé, référencé par #acme-brand
├── docs/architecture.md            # MIS À JOUR : mention de css/acme.css et #acme-brand
├── launch.coffee / launch.js       # inchangés
└── bkcore/, bkcore.coffee/, libs/  # inchangés
```

**Structure Decision**: Projet statique existant conservé. Les surcharges vivent dans un fichier CSS dédié plutôt que dans `css/multi.css` : cela isole la personnalisation (principe IV, FR-010), garde le diff lisible et permet le retour arrière en supprimant un fichier et deux éléments d'`index.html`. Le logo est référencé à son emplacement officiel pour éviter un doublon à maintenir.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Principe VII : aucun test automatisé versionné ajouté pour ce changement visuel | Le changement n'ajoute aucune logique ni aucun script ; il est couvert par la suite QUnit existante (non-régression), des vérifications Playwright ponctuelles du rendu (couleurs calculées, contraste, absence de chevauchement) et la validation humaine ACME (SC-006, tâche T022). | Un test QUnit lisant `css/acme.css` ou `index.html` échoue sous `file://` (utilisé par `ci-chrome.bat`) ; un test Playwright versionné ajouterait un outil de test hors du périmètre actuel (principe IV). Dérogation soumise à validation humaine (Gouvernance, Conformité). |
