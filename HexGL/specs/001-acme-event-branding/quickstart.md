# Quickstart : valider la personnalisation ACME

Guide de validation de bout en bout. Il ne contient pas d'implémentation : voir `plan.md`, `data-model.md` et `contracts/ecran-accueil.md`.

## Prérequis

- Python (serveur statique) ou le driver du skill `run-hexgl` ; Chrome ou Edge installé.
- Branche `001-acme-event-branding`, implémentation réalisée (`css/acme.css` + bloc `#acme-brand`).
- Playwright installé globalement (utilisé par `.claude/skills/run-hexgl/driver.mjs`).

## 1. Non-régression automatisée (QUnit)

Depuis `HexGL/formation/tests`, en PowerShell :

```powershell
cmd /c ".\ci-chrome.bat"
```

Attendu : code de sortie 0 (tests réussis). Code 1 = échec, code 2 = vérification impossible (à signaler, jamais comptée comme réussie). À exécuter après chaque phase significative et en fin de ticket.

## 2. Contrôle visuel de l'écran d'accueil

Depuis `HexGL/` :

```powershell
python -m http.server 8000
```

Ouvrir `http://localhost:8000/index.html` (ou utiliser `/run-hexgl`) et vérifier :

1. Logo ACME net, non déformé, sur panneau blanc arrondi avec marge ; plus aucun logo HexGL.
2. Nom « ACME » et message « Bienvenue au ACME Racing Challenge » visibles.
3. Fond noir profond ; accents violet / bleu électrique / cyan / blanc / gris clair uniquement.
4. Menu lisible : Start, Controls, Quality, HUD, Credits.

## 3. Cadrages (SC-005)

Avec Playwright (driver ou script ponctuel), charger la page aux tailles 1024×768 et 1920×1080 et relever `getBoundingClientRect()` de `#acme-brand` et `#menu` : tout est dans la fenêtre, sans chevauchement. Conserver les captures dans `specs/001-acme-event-branding/captures/` (ne pas régénérer `formation/tests/captures/`, qui sert de référence aux éléments à préserver).

## 4. Cas limites

| Cas | Comment | Attendu |
|---|---|---|
| Logo indisponible | bloquer `formation/identite/logo.png` dans Playwright | « ACME » en texte visible, pas de logo HexGL, menu utilisable |
| Sans WebGL | lancer Chrome avec `--disable-gpu --disable-3d-apis` ou bloquer `getContext("webgl")` | « WebGL is not supported! » lisible |
| Crédits | cliquer « Credits » puis l'écran de crédits | crédits inchangés ; retour à l'accueil ACME |
| Paramètres d'URL | `index.html?quality=0&hud=0&controlType=1` | valeurs reflétées dans le menu comme avant |
| Fenêtre étroite | par ex. 800×600 puis 600×800 | message non tronqué au point d'être illisible |

## 5. Parcours inchangé (FR-007/FR-008)

Cliquer Start → aide (`#step-2`) → clic → chargement → décompte → début de course (qualité LOW avec `?quality=0` en rendu logiciel). Une course complète n'est pas nécessaire : le gameplay n'est pas touché (constitution, Vérification). Optionnel : `node .claude/skills/run-hexgl/driver.mjs play specs/001-acme-event-branding/captures` pour obtenir des captures de menu et de course.

## 6. Validation humaine (SC-006)

Faire valider le rendu par ACME ou son représentant (conformité à la charte). Tant qu'elle n'est pas obtenue, la fonctionnalité n'est pas terminée.

## 7. Retour arrière

Retirer la ligne `<link … css/acme.css>` et le bloc `#acme-brand` d'`index.html`, puis supprimer `css/acme.css`. L'écran d'accueil d'origine est restauré.
