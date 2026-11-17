// Driver HexGL : serveur statique Node + Chrome/Edge système via Playwright.
// Usage (depuis HexGL/) :
//   node .claude/skills/run-hexgl/driver.mjs play [dossier_sortie]   -> menu -> course -> screenshots + état JSON
//   node .claude/skills/run-hexgl/driver.mjs tests                   -> exécute la suite QUnit, affiche le bilan
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const gRoot = execSync('npm root -g').toString().trim();
const { chromium } = require(path.join(gRoot, 'playwright'));

const ROOT = process.cwd();
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.json': 'application/json' };

function serve() {
  const srv = http.createServer((req, res) => {
    const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
    if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}

async function launch() {
  const args = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'];
  for (const channel of ['chrome', 'msedge']) {
    try { return await chromium.launch({ channel, headless: true, args }); } catch (e) { /* essaie suivant */ }
  }
  throw new Error('Ni Chrome ni Edge trouvés');
}

const cmd = process.argv[2] || 'play';
const out = path.resolve(process.argv[3] || 'screenshots');
const srv = await serve();
const base = `http://127.0.0.1:${srv.address().port}`;
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 640 } });
const logs = [];
page.on('console', m => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', e => logs.push(`[pageerror] ${e.message}`));

try {
  if (cmd === 'tests') {
    await page.goto(`${base}/formation/tests/index.html`);
    await page.waitForFunction(() => ['pass','fail'].includes(document.documentElement.dataset.testStatus), null, { timeout: 30000 });
    const r = await page.evaluate(() => ({ status: document.documentElement.dataset.testStatus,
      summary: document.getElementById('qunit-testresult')?.innerText }));
    console.log(JSON.stringify(r));
    process.exitCode = r.status === 'pass' ? 0 : 1;
  } else if (cmd === 'play') {
    fs.mkdirSync(out, { recursive: true });
    // quality=0 (LOW) : rendu logiciel SwiftShader bien plus rapide ; godmode=1 : pas de game over
    await page.goto(`${base}/index.html?quality=0&godmode=1`);
    await page.screenshot({ path: path.join(out, '1-menu.png') });
    await page.click('#start');
    await page.click('#step-2');                 // "Click/Touch to continue"
    await page.waitForFunction(() => window.hexGL && document.getElementById('step-4').style.display === 'block', null, { timeout: 120000 });
    await page.waitForTimeout(4000);             // décompte de départ
    await page.keyboard.down('ArrowUp');
    await page.waitForTimeout(5000);
    await page.screenshot({ path: path.join(out, '2-course.png') });
    const state = await page.evaluate(() => {
      const c = window.hexGL.components.shipControls;
      return { speed: c.speed, speedRatio: c.speedRatio, pos: [c.dummy.position.x, c.dummy.position.y, c.dummy.position.z].map(v => +v.toFixed(1)) };
    });
    console.log(JSON.stringify(state));
    await page.keyboard.up('ArrowUp');
    console.log('screenshots:', out);
  } else throw new Error('commande inconnue: ' + cmd);
} finally {
  const errs = logs.filter(l => /error/i.test(l));
  if (errs.length) console.log('Erreurs console:\n' + errs.join('\n'));
  await browser.close(); srv.close();
}
