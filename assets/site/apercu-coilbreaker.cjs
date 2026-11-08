// Captures d'aperçu de la page COILBREAKER et du kit presse, sans fenêtre (Edge headless, Playwright).
//   python -m http.server 8731 --bind 127.0.0.1   (à la racine du dépôt)
//   node assets/site/apercu-coilbreaker.cjs <dossier de sortie> [http://127.0.0.1:8731]
// Le --window-size d'Edge ne descend pas sous 492 px : Playwright fixe le viewport exact.
const path = require('path'), fs = require('fs');
const {chromium} = require(process.env.PLAYWRIGHT || 'E:/Dev/Tools/rogue-image-masks/node_modules/playwright');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const out = path.resolve(process.argv[2] || '.'), base = process.argv[3] || 'http://127.0.0.1:8731';
fs.mkdirSync(out, {recursive: true});
(async () => {
  const browser = await chromium.launch({executablePath: EDGE, headless: true});
  const errors = [];
  async function page(url, width, height, name, act) {
    const ctx = await browser.newContext({viewport: {width, height}, deviceScaleFactor: 1});
    const p = await ctx.newPage();
    p.on('console', m => { if (m.type() === 'error') errors.push(`${name}: ${m.text()}`); });
    p.on('pageerror', e => errors.push(`${name}: ${e.message}`));
    p.on('requestfailed', r => errors.push(`${name}: ${r.url()} ${r.failure()?.errorText}`));
    p.on('response', r => { if (r.status() >= 400) errors.push(`${name}: ${r.status()} ${r.url()}`); });
    await p.goto(base + url, {waitUntil: 'networkidle'});
    // Charge les images paresseuses avant la capture pleine page.
    await p.evaluate(async () => { for (const img of document.querySelectorAll('img[loading=lazy]')) img.loading = 'eager'; await new Promise(r => setTimeout(r, 300)); });
    await p.waitForLoadState('networkidle');
    if (act) await act(p);
    await p.screenshot({path: path.join(out, name), fullPage: !act});
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (overflow > 0) errors.push(`${name}: débordement horizontal de ${overflow} px`);
    await ctx.close();
  }
  for (const lang of ['fr', 'en']) {
    await page(`/coilbreaker/?lang=${lang}`, 1440, 900, `page-${lang}-1440.png`);
    await page(`/coilbreaker/?lang=${lang}`, 390, 844, `page-${lang}-390.png`);
    await page(`/coilbreaker/?lang=${lang}`, 820, 1180, `page-${lang}-820.png`);
    await page(`/coilbreaker/press/${lang === 'fr' ? '?lang=fr' : ''}`, 1440, 900, `presse-${lang}-1440.png`);
  }
  await page('/coilbreaker/?lang=fr', 1440, 900, 'page-fr-galerie-ouverte.png', async p => {
    await p.click('[data-shot="1"]'); await p.waitForTimeout(600);
  });
  await page('/coilbreaker/?lang=fr', 1440, 900, 'page-fr-bande-annonce.png', async p => {
    await p.click('#open-trailer');
    await p.waitForFunction(() => document.getElementById('trailer-video').readyState >= 2, null, {timeout: 15000});
    await p.evaluate(() => { const v = document.getElementById('trailer-video'); v.pause(); v.currentTime = 20; });
    await p.waitForTimeout(800);
    const v = await p.evaluate(() => { const v = document.getElementById('trailer-video'); return {src: v.currentSrc, duration: v.duration, w: v.videoWidth, h: v.videoHeight}; });
    fs.writeFileSync(path.join(out, 'video-fr.json'), JSON.stringify(v, null, 2));
  });
  await browser.close();
  fs.writeFileSync(path.join(out, 'erreurs.txt'), errors.join('\n') + '\n');
  console.log(errors.length ? `${errors.length} erreur(s), voir erreurs.txt` : 'Aucune erreur console ni réseau.');
})().catch(e => { console.error(e); process.exitCode = 1; });
