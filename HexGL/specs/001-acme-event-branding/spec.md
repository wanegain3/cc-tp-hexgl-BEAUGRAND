# Feature Specification: Personnalisation événementielle ACME de l'écran d'accueil

**Feature Branch**: `001-acme-event-branding`

**Created**: 2026-11-17

**Status**: Implemented (validation humaine ACME, SC-006, en attente)

**Input**: User description: "Spécifie le besoin décrit dans formation/tickets/company-event.md (personnalisation événementielle ACME : écran d'accueil avec logo, couleurs de la charte, nom de l'entreprise, message d'accueil ; gameplay inchangé). Documents d'identité visuelle dans formation/identite/. Contexte : docs/architecture.md."

## Clarifications

### Session 2026-11-17

- Q: Que devient le logo ou titre HexGL d'origine de l'écran d'accueil une fois le logo ACME ajouté ? → A: Le logo HexGL est entièrement masqué et remplacé par le logo ACME.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Accueil aux couleurs d'ACME (Priority: P1)

Un participant à l'événement d'entreprise ACME arrive sur l'écran d'accueil du jeu. Il voit immédiatement le logo ACME, le nom de l'entreprise et le message d'accueil « Bienvenue au ACME Racing Challenge », sur un fond sombre avec les accents violet, bleu électrique et cyan de la charte graphique.

**Why this priority**: C'est le cœur du ticket : sans identité ACME visible dès l'écran d'accueil, l'événement ne peut pas utiliser le jeu. Cette histoire seule constitue un MVP livrable.

**Independent Test**: Ouvrir le jeu dans un navigateur et observer l'écran d'accueil : logo, nom, message et couleurs conformes à la charte sont présents, sans lancer de course.

**Acceptance Scenarios**:

1. **Given** le jeu est chargé, **When** l'écran d'accueil s'affiche, **Then** le logo ACME fourni est visible, non déformé, avec une zone de respiration autour de lui.
2. **Given** l'écran d'accueil est affiché, **When** le participant le lit, **Then** le message « Bienvenue au ACME Racing Challenge » et le nom de l'entreprise « ACME » sont visibles et lisibles.
3. **Given** l'écran d'accueil est affiché, **When** on observe les couleurs, **Then** le fond principal est sombre (noir profond) et les accents utilisent uniquement la palette de la charte (violet, bleu électrique, cyan, blanc, gris clair).
4. **Given** le logo ACME comporte un texte sombre, **When** il est placé sur le fond sombre, **Then** il reste lisible (par exemple sur une surface claire), conformément à la règle « ne pas placer le logo sur un fond illisible ».

---

### User Story 2 - Gameplay et parcours inchangés (Priority: P1)

Un participant lance une partie après l'écran d'accueil personnalisé. Le parcours (menu, aide, chargement, décompte, course, écran de score) et le gameplay se comportent exactement comme avant : contrôles, physique, HUD en course et options du menu.

**Why this priority**: Le ticket impose que le gameplay reste inchangé ; une régression ferait échouer l'événement autant qu'un branding absent.

**Independent Test**: Parcourir l'enchaînement complet d'écrans jusqu'au début de course et vérifier que contrôles, options du menu et HUD sont identiques à l'existant.

**Acceptance Scenarios**:

1. **Given** l'écran d'accueil personnalisé, **When** le participant modifie les options du menu (contrôles, qualité, HUD) puis démarre, **Then** les options fonctionnent comme avant et la course démarre normalement.
2. **Given** une course en cours, **When** le participant joue, **Then** le HUD, les contrôles et la physique du vaisseau sont identiques à la version non personnalisée.
3. **Given** un appareil sans WebGL, **When** l'écran d'accueil s'affiche, **Then** le message d'erreur existant reste affiché et lisible avec le nouvel habillage.

---

### User Story 3 - Lisibilité sur différents formats d'écran (Priority: P2)

Un organisateur utilise le jeu sur une borne ou un ordinateur portable. L'écran d'accueil reste propre et lisible quelle que soit la taille de fenêtre raisonnable, et la personnalisation est sobre, facile à maintenir et à retirer.

**Why this priority**: Améliore la qualité de l'expérience événementielle mais n'est pas indispensable à la première démonstration.

**Independent Test**: Afficher l'écran d'accueil à plusieurs tailles de fenêtre et vérifier que le logo, le message et le menu restent visibles sans chevauchement.

**Acceptance Scenarios**:

1. **Given** une fenêtre de taille réduite (par exemple 1024×768) ou standard (1920×1080), **When** l'écran d'accueil s'affiche, **Then** logo, message et menu restent entièrement visibles sans chevauchement ni déformation.
2. **Given** la personnalisation livrée, **When** un mainteneur souhaite revenir à l'identité d'origine, **Then** le retour s'effectue par un changement limité et identifiable.

---

### Edge Cases

- Le fichier du logo est indisponible ou ne se charge pas : l'écran d'accueil doit rester utilisable, avec le nom « ACME » en texte visible (le logo HexGL ne réapparaît pas).
- Fenêtre très étroite ou affichage tactile : le message d'accueil ne doit pas être tronqué au point d'être illisible.
- Les paramètres d'URL existants (`controlType`, `quality`, `hud`, `godmode`) restent pris en compte.
- Absence de WebGL : le message d'avertissement existant reste visible.
- Les autres écrans (aide, chargement, score, crédits accessibles via l'option « Credits » du menu) conservent leur contenu et leur apparence ; leur habillage n'est pas exigé par le ticket (voir Assumptions). L'ouverture et la fermeture des crédits fonctionnent comme avant.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: L'écran d'accueil MUST afficher le logo ACME officiel fourni (`formation/identite/logo.png`), sans déformation, avec une zone de respiration et sans recoloration, ombre ni contour ajoutés. Le logo HexGL d'origine MUST être entièrement masqué (non visible) sur l'écran d'accueil et remplacé par le logo ACME ; aucune mention HexGL ne subsiste à sa place.
- **FR-002**: L'écran d'accueil MUST afficher le nom de l'entreprise « ACME ».
- **FR-003**: L'écran d'accueil MUST afficher le message d'accueil « Bienvenue au ACME Racing Challenge ».
- **FR-004**: Le fond principal de l'écran d'accueil MUST être sombre (noir profond #08090D, en remplacement du fond clair d'origine, y compris son animation) ; les accents MUST utiliser uniquement la palette de la charte : violet #7628FF, bleu électrique #315BFF, cyan #00C4E8, blanc #FFFFFF, gris clair #E6E8EE, et le dégradé événementiel #7628FF → #315BFF. Les variantes translucides de ces mêmes tons sont tolérées ; les couleurs d'origine (bleu #4190bb, orange #f66439) ne MUST plus apparaître sur l'écran d'accueil.
- **FR-005**: Le logo MUST rester lisible sur le fond sombre (aucun gris moyen dominant, aucun fond illisible).
- **FR-006**: Les textes de l'écran d'accueil (menu, nom, message, y compris le message d'absence de WebGL) MUST présenter un rapport de contraste d'au moins 4,5:1 avec leur arrière-plan réel ; la typographie existante peut être conservée et aucune nouvelle dépendance de police ne doit être introduite.
- **FR-007**: Le gameplay, les contrôles, la physique, le HUD en course et les options du menu MUST rester strictement inchangés.
- **FR-008**: Le parcours existant (menu → aide → chargement → course → score) et le comportement des paramètres d'URL MUST rester inchangés.
- **FR-009**: Le message existant en cas d'absence de WebGL MUST rester affiché et lisible.
- **FR-010**: Les éléments de personnalisation MUST rester sobres (pas d'effets additionnels complexes) et identifiables, afin que la personnalisation soit maintenable et réversible.
- **FR-011**: Les anomalies héritées décrites dans `docs/architecture.md` MUST NOT être corrigées dans le cadre de ce ticket.

### Key Entities *(include if feature involves data)*

- **Identité visuelle ACME**: ensemble formé du logo officiel, de la palette de couleurs, du dégradé événementiel et des règles d'usage de la charte graphique (source : `formation/identite/charte_graphique_acme.pdf`).
- **Contenu d'accueil**: nom de l'entreprise (« ACME ») et message d'accueil (« Bienvenue au ACME Racing Challenge ») présentés au participant.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100 % des éléments demandés (logo, couleurs de la charte, nom de l'entreprise, message d'accueil) sont visibles sur l'écran d'accueil dès son affichage, sans action du participant.
- **SC-002**: Un participant identifie la marque ACME et l'événement en moins de 3 secondes après l'affichage de l'écran d'accueil.
- **SC-003**: 100 % des couleurs utilisées pour l'habillage de l'écran d'accueil appartiennent à la palette de la charte, et le logo est affiché sans déformation (rapport largeur/hauteur d'origine conservé).
- **SC-004**: Le parcours complet, de l'écran d'accueil jusqu'au démarrage de la course, s'effectue sans écart de comportement par rapport à la version d'origine, et la suite de tests automatisés existante reste entièrement réussie.
- **SC-005**: L'écran d'accueil reste entièrement lisible, sans chevauchement ni troncature, aux résolutions 1024×768 et 1920×1080.
- **SC-006**: Une validation humaine par ACME (ou son représentant) confirme la conformité à la charte avant l'événement.

## Assumptions

- Seul l'écran d'accueil (menu de démarrage) est concerné ; les écrans d'aide, de chargement, de score et de crédits conservent leur apparence actuelle, le ticket ne demandant que l'écran d'accueil.
- Le message d'accueil de référence est celui de la charte (« Bienvenue au ACME Racing Challenge ») ; le nom de l'entreprise est « ACME ».
- Le libellé du bouton de démarrage et les options du menu restent ceux de l'existant, le ticket ne demandant pas de les modifier.
- Le logo fourni a un fond clair avec un texte sombre ; il est présenté sur une surface claire arrondie, comme dans l'intention visuelle de la charte, plutôt que recoloré.
- Le logo et la charte de `formation/identite/` constituent la source de vérité graphique ; aucune version claire/inversée du logo n'est disponible.
- La typographie actuelle est conservée tant qu'elle reste lisible (règle de la charte pour les intégrations legacy).
- Le jeu est utilisé sur des navigateurs de bureau avec WebGL, éventuellement sur une borne ; le français est la seule langue requise pour le message.
- Les métadonnées de la page (titre d'onglet, balises de partage, icône) ne sont pas modifiées, le ticket ne portant que sur l'écran d'accueil.
- Validation : suite QUnit existante en non-régression, vérification du rendu dans un vrai navigateur (scripts ponctuels non versionnés) et validation humaine ACME ; aucun nouveau test automatisé versionné n'est exigé, la fonctionnalité n'ajoutant aucun script.
- Contraintes du projet applicables : stack legacy conservée, aucune dépendance ni étape de build, modifications minimales et réversibles (constitution HexGL v1.0.0).
