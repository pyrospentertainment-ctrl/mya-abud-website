// Renderiza carrusel.html como 10 PNG de 1080×1350 (formato vertical de Instagram).
// Uso: node render.mjs
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node22/lib/node_modules/playwright'); }
const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(dir, 'laminas');
fs.mkdirSync(out, { recursive: true });
const browser = await pw.chromium.launch();
const page = await browser.newPage({ viewport: { width: 10800, height: 1350 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(dir, 'carrusel.html'), { waitUntil: 'networkidle' });
await page.waitForSelector('body[data-ready="1"]');
await page.waitForTimeout(500);
const sizes = await page.$$eval('.body', bs => bs.map(b => b.dataset.fs));
console.log('font sizes', sizes.join(', '));
const names = ['00-portada','01-I','02-II','03-III','04-IV','05-V','06-VI','07-VII','08-VIII','09-cierre'];
for (let i = 0; i < 10; i++) {
  await page.screenshot({ path: path.join(out, names[i] + '.png'), clip: { x: i * 1080, y: 0, width: 1080, height: 1350 } });
}
await page.screenshot({ path: path.join(dir, 'panorama.jpg'), type: 'jpeg', quality: 80 });
await browser.close();
console.log('ok');
