# HexGL Constitution

## Core Principles

### I. Préservation du gameplay et des comportements existants
Le gameplay et les comportements existants de HexGL DOIVENT être préservés. Un changement
ne DOIT PAS altérer la physique du vaisseau, le déroulement de la course, les contrôles ni
les écrans existants, sauf si le ticket le demande explicitement. Les anomalies héritées
décrites dans `docs/architecture.md` NE DOIVENT PAS être corrigées au passage : elles ne
sont traitées que si un ticket le demande.

### II. Stack legacy conservée
Three.js (copie embarquée dans `libs/`) et CoffeeScript DOIVENT être conservés tels quels,
sans modernisation. Le projet NE DOIT PAS être migré vers une version plus récente de
Three.js, vers des modules ES/CommonJS ni vers un autre langage ou framework. Les sources
CoffeeScript et leur JavaScript compilé versionné DOIVENT rester cohérents entre eux.

### III. Aucune dépendance, aucun build, aucun backend
Le projet reste un site statique. Un changement NE DOIT PAS ajouter de dépendance, d'étape
de build, de gestionnaire de paquets ni de backend. Le jeu DOIT continuer à fonctionner
en étant servi par un simple serveur HTTP statique.

### IV. Modifications minimales et réversibles
Chaque changement DEVRAIT être le plus petit nécessaire pour atteindre son objectif et
DEVRAIT pouvoir être annulé simplement. Un changement NE DOIT PAS inclure de refactoring,
de renommage ou de réorganisation non demandés.

### V. Architecture respectée et décisions documentées
Les changements DOIVENT respecter l'architecture décrite dans `docs/architecture.md`
(namespace global `bkcore`, ordre de chargement des scripts de `index.html`, organisation
des dossiers). Toute décision importante DOIT être documentée, et `docs/architecture.md`
DOIT être mis à jour lorsqu'un changement modifie l'architecture qu'il décrit.

### VI. Réutilisation des tests QUnit existants
Les vérifications automatisées DOIVENT s'appuyer sur la suite QUnit de `formation/tests/`
et la réutiliser. Tout nouveau script testé DOIT être ajouté à `formation/tests/index.html`.
Les tests NE DOIVENT PAS lancer le jeu ni WebGL.

### VII. Tests et validation humaine pour les changements importants
Un changement important DOIT être couvert par des tests et DOIT recevoir une validation
humaine avant d'être considéré comme terminé.

## Vérification

Les règles suivantes définissent les vérifications exigées pour tout changement.

- Les tests QUnit DOIVENT être exécutés après chaque phase significative et en fin de
  ticket.
- Le rendu et les interactions DOIVENT être vérifiés en fin de ticket, avec Playwright si
  disponible, sans répétitions inutiles.
- Les captures initiales de `formation/tests/captures/` DOIVENT servir de référence
  uniquement pour les éléments à préserver. Les changements visuels DOIVENT être validés
  selon ce que demande le ticket, et NE DOIVENT PAS être comparés aux captures initiales.
- Une course complète DOIT être effectuée uniquement si le gameplay risque d'être affecté.
- Une vérification impossible à réaliser DOIT être signalée explicitement et NE DOIT PAS
  être considérée comme réussie.

## Gouvernance

Cette constitution prévaut sur les autres pratiques du projet. `CLAUDE.md` et
`docs/architecture.md` servent de guide opérationnel et descriptif ; en cas de conflit,
la constitution l'emporte.

- **Amendement** : toute modification de la constitution DOIT être documentée, validée par
  le responsable du projet et accompagnée de la mise à jour de la date et de la version.
- **Versionnement** : la version suit le versionnement sémantique. MAJOR pour la suppression
  ou la redéfinition incompatible d'un principe, MINOR pour l'ajout d'un principe ou d'une
  section ou une extension significative, PATCH pour les clarifications et corrections de
  forme.
- **Conformité** : chaque ticket et chaque revue DOIVENT vérifier le respect de la
  constitution. Toute dérogation DOIT être justifiée et validée par un humain.

**Version**: 1.0.0 | **Ratified**: 2026-11-17 | **Last Amended**: 2026-11-17
