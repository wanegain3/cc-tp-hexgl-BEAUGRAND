---
name: run-hexgl
description: Lancer, piloter, tester et prendre des screenshots de HexGL (jeu de course WebGL statique, Three.js). À utiliser pour "run/start/screenshot HexGL", lancer la partie ou exécuter les tests QUnit dans un vrai navigateur.
---

# run-hexgl

HexGL est un site statique (pas de build, pas de `npm install`). Le driver `driver.mjs` démarre un serveur statique Node, ouvre Chrome (ou Edge) headless via Playwright, et pilote le jeu. Les chemins sont relatifs à `HexGL/` (la racine de l'unité) ; lancer les commandes depuis ce dossier.

## Prérequis (vérifiés sous Windows 11)

- Node ≥ 24, Playwright installé **globalement** (`npm i -g playwright`) — le driver le résout via `npm root -g`.
- Google Chrome ou Microsoft Edge installé (utilisé via `channel`, aucun `playwright install` nécessaire).

## Run (voie agent)

```bash
# Menu -> course (Start, clic "continue", chargement, accélération) + 2 screenshots + état du vaisseau
node .claude/skills/run-hexgl/driver.mjs play screenshots
# Suite QUnit de formation/tests (code retour 0 = pass, 1 = fail)
node .claude/skills/run-hexgl/driver.mjs tests
```

`play` écrit `screenshots/1-menu.png` et `screenshots/2-course.png`, affiche un JSON `{speed, speedRatio, pos}` lu dans `window.hexGL.components.shipControls`, et liste les erreurs console. Durée ≈ 15 s. Regarder la 2e image : HUD (vitesse, bannière START) et vaisseau visibles = OK.
`tests` affiche `{"status":"pass","summary":"14 tests completed ... 40 assertions of 40 passed"}`.

Pour piloter autrement, copier le bloc `play` : `page.click('#start')`, `page.click('#step-2')`, puis `page.keyboard.down('ArrowUp')`, etc.

## Run (voie humaine)

`python -m http.server` à la racine puis ouvrir `http://localhost:8000/index.html` ; inutile en headless. Les tests peuvent aussi se lancer via `formation/tests/ci-chrome.bat` / `.sh` (non exécutés ici).

## Gotchas

- **WebGL headless** : il faut `--use-angle=swiftshader --enable-unsafe-swiftshader` (déjà dans le driver) sinon `Start` affiche « WebGL is not supported! ».
- **Qualité LOW + godmode** : le driver charge `?quality=0&godmode=1` (paramètres d'URL lus par `launch.js`) ; en rendu logiciel, la qualité haute est très lente, et godmode évite les game over.
- **`http://` obligatoire** : le jeu charge modèles/textures par XHR, `file://` ne marche pas (les tests QUnit, eux, passent aussi via http).
- **Séquence de clics** : `#start` → `#step-2` (écran d'aide, « Click/Touch to continue ») → chargement → `#step-4` visible. Attendre ~4 s ensuite : le décompte de départ bloque le vaisseau.
- **Three.js ancien** : `Vector3.toArray()` n'existe pas ; lire `.x/.y/.z`.
- La commande `tests` affiche une erreur console « 404 Not Found » (probablement le `favicon.ico` de la page de tests, non vérifié) ; `play` n'en a pas affiché.
- `tests` attend que `data-test-status` soit `pass` ou `fail` (il vaut `pending` pendant les tests asynchrones).

## Troubleshooting

- `Ni Chrome ni Edge trouvés` → installer l'un des deux (ou ajouter un `executablePath` dans `launch()`).
- `TypeError: ... toArray is not a function` → voir Gotchas, utiliser `.x/.y/.z`.
