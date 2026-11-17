# HexGL — mémo pour les futures sessions

Site statique (HTML/JS, Three.js ancien, aucun build). Architecture détaillée : `docs/architecture.md`.

## Tests

- Suite QUnit : `formation/tests/index.html` + `formation/tests/browser-tests.js` (QUnit local dans `vendor/`, pas de Node/npm).
- Commande Windows (depuis `HexGL/formation/tests`, en PowerShell) : `cmd /c ".\ci-chrome.bat"`
- Commande Linux : `bash HexGL/formation/tests/ci-chrome.sh` (depuis la racine du dépôt).
- Codes de sortie : 0 = réussis, 1 = échecs, 2 = impossibles ; en cas d'erreur, `formation/tests/rapport_erreur.html` est généré (ignoré par git).
- `ci-chrome.sh` sous Git Bash/Windows ne trouve pas Chrome (code 2) : utiliser le `.bat`.
- Tout nouveau script testé doit être ajouté à `formation/tests/index.html` ; ne pas lancer le jeu ni WebGL dans les tests.

## Captures de référence

- `formation/tests/captures/1-menu.png` (écran d'accueil) et `2-course.png` (jeu en cours, qualité LOW, HUD visible).
- Régénération (depuis `HexGL/`) : `node .claude/skills/run-hexgl/driver.mjs play formation/tests/captures`
- La capture de course contient un chrono et une vitesse variables : à comparer visuellement, pas pixel à pixel.

## Lancer le jeu

Skill `/run-hexgl` (`.claude/skills/run-hexgl/`) ou `python -m http.server 8000` puis http://localhost:8000/index.html.
