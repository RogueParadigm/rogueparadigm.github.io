// Médias de la page COILBREAKER et du kit presse, refonte graphique D (6 nov. 2026).
// Source : le dossier des bandes-annonces rendu par le moteur (jeu fe8000fc, --early-access).
//   node assets/site/update-coilbreaker-demo.cjs [dossier des bandes-annonces] [--sans-video]
// Défaut : E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-06-bandes-annonces
// Les sources ne sont jamais modifiées. Les vidéos sont réencodées en H.264 1080p (x264 deux passes, ~29 Mo).
const fs = require('fs'), path = require('path');
const {sharp, hash, run, encode, capture, poster: affiche} = require('./medias.cjs');
const LOGO = 'E:/Dev/GameDev/Godot/COILBREAKER/assets/ui/logo-2026-11-05.png';
const args = process.argv.slice(2), skipVideo = args.includes('--sans-video');
const source = path.resolve(args.find(a => !a.startsWith('--')) || 'E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-06-bandes-annonces');
const root = path.resolve(__dirname, '../..');
const assets = path.join(root, 'coilbreaker/assets'), press = path.join(root, 'coilbreaker/press/assets');
// Ordre de la galerie Steam (galerie-fr/, galerie-en/) : screen-NN reprend son numéro.
const shots = ['01-fin-de-partie', '02-concasseur', '03-forteresse', '04-belier', '05-evolution',
  '06-pose', '07-niveau', '08-pilote', '09-caisse', '10-victoire'];
// Vidéo : 63 s, cible 29 Mo (vidéo 3,6 Mb/s + AAC 128 kb/s), plafond 6 Mb/s.
const VIDEO_KBPS = 3600, POSTER_AT = '1.0';
const manifest = {date: '2026-11-06', source, refonte: 'D', jeu: 'fe8000fc (chantier/demo-ea-novembre, --early-access)', files: []};
const note = (from, to) => manifest.files.push({source: from, source_sha256: hash(from), output: path.relative(root, to).replace(/\\/g, '/'), bytes: fs.statSync(to).size, sha256: hash(to)});
(async () => {
  for (const lang of ['fr', 'en']) {
    const gallery = path.join(source, `galerie-${lang}`);
    for (const shot of shots) {
      const from = path.join(gallery, `${shot}.png`), num = shot.slice(0, 2);
      const full = path.join(assets, `screen-${num}-${lang}.webp`), thumb = path.join(assets, `screen-${num}-${lang}-thumb.webp`);
      await capture(from, full, thumb); note(from, full); note(from, thumb);
      if (lang === 'en') {
        const jpg = path.join(press, `coilbreaker-screenshot-${num}.jpg`), small = path.join(press, `coilbreaker-screenshot-${num}-thumb.jpg`);
        await sharp(from).jpeg({quality: 90, mozjpeg: true}).toFile(jpg); note(from, jpg);
        await sharp(from).resize(640).jpeg({quality: 86, mozjpeg: true}).toFile(small); note(from, small);
      }
    }
    const film = path.join(source, `COILBREAKER-pub-${lang}.mp4`), trailer = path.join(assets, `trailer-${lang}.mp4`);
    if (!skipVideo) { encode(film, trailer, VIDEO_KBPS); note(film, trailer); }
    const poster = path.join(assets, `trailer-poster-${lang}.webp`);
    await affiche(film, poster, POSTER_AT); note(film, poster);
  }
  // Logo d'Elys du 5 nov., sans retouche.
  for (const to of [path.join(assets, 'coilbreaker-logo.png'), path.join(press, 'coilbreaker-logo.png')]) { fs.copyFileSync(LOGO, to); note(LOGO, to); }
  // Capsules Steam de la proposition E (rendu du jeu, logo du 5 nov. posé par script).
  const caps = path.join(source, 'capsules/E'), main = path.join(caps, 'main_1232x706.png'), header = path.join(caps, 'header_920x430.png');
  const keyArt = path.join(press, 'key-art-16x9.jpg'), share = path.join(assets, 'share.jpg'), steamHeader = path.join(assets, 'steam-header.webp');
  await sharp(main).extract({left: 0, top: 0, width: 1232, height: 693}).resize(1200, 675).jpeg({quality: 92, mozjpeg: true}).toFile(keyArt); note(main, keyArt);
  await sharp(main).extract({left: 0, top: 8, width: 1232, height: 647}).resize(1200, 630).jpeg({quality: 90, mozjpeg: true}).toFile(share); note(main, share);
  await sharp(header).webp({quality: 90, effort: 6}).toFile(steamHeader); note(header, steamHeader);
  // ZIP presse : PNG FR/EN tels que rendus, capsules E, logos. Stocké sans recompression (PNG).
  const zip = path.join(press, 'COILBREAKER-press-kit.zip');
  const entries = [];
  for (const lang of ['en', 'fr']) for (const shot of shots) entries.push([path.join(source, `galerie-${lang}`, `${shot}.png`), `screenshots-${lang}/coilbreaker-${shot}-${lang}.png`]);
  for (const f of ['header_920x430.png', 'main_1232x706.png', 'vertical_748x896.png', 'library_600x900.png', 'library_hero_3840x1240.png', 'small_462x174.png'])
    entries.push([path.join(caps, f), `steam-capsules/${f}`]);
  entries.push([LOGO, 'logos/coilbreaker-logo.png'], [path.join(press, 'rogue-paradigm.png'), 'logos/rogue-paradigm.png']);
  const zipper = 'import sys,json,zipfile\nz=zipfile.ZipFile(sys.argv[1],"w",zipfile.ZIP_STORED)\nfor a,b in json.loads(sys.argv[2]):\n z.write(a,b)\nz.close()';
  run('python', ['-I', '-c', zipper, zip, JSON.stringify(entries)]);
  manifest.files.push({output: path.relative(root, zip).replace(/\\/g, '/'), bytes: fs.statSync(zip).size, sha256: hash(zip), contents: entries.map(e => e[1])});
  fs.writeFileSync(path.join(root, 'assets/site/coilbreaker-demo-2026-11-06.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`${manifest.files.length} fichiers écrits depuis ${source}${skipVideo ? ' (vidéos non réencodées)' : ''}.`);
})().catch(e => { console.error(e); process.exitCode = 1; });
