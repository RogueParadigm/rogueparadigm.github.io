// Médias de la proposition du 10 nov. 2026 pour la page COILBREAKER (branche de brouillon, pas de déploiement).
// Source : _atelier/COILBREAKER/2026-11-10-vitrine-propositions (prises du Ferrailleur des 9 et 10 nov., jeu 0.20.10
// lancé en --early-access ; montage « youtube » de tools/bandes_annonces/montages-2026-11-10.json).
// Refait après la critique d'Opus du 10 nov. : prises sans Scies, écran de pose à deux aperçus (screen-14).
// Refait après les réponses d'Elys du 10 nov. :
//   - « Le serpent qui se touche la queue, ça arrive jamais. » : plus de capture du corps (screen-18 retirée), le
//     montage n'a plus le plan du raté (47 s) ;
//   - « Je préfère la capsule avec Elys et Freya. » : image de partage, image clé et capsules du kit presse, en-tête
//     Steam tirés de la capsule A, Freya en queue de cheval bouclée (capsules/bouclee/A).
//   node assets/site/update-coilbreaker-2026-11-10.cjs [dossier des propositions] [--sans-video]
// Les captures prennent des numéros neufs : les anciennes images restent dans le dépôt.
const fs = require('fs'), path = require('path');
const {sharp, hash, run, encode, capture, poster} = require('./medias.cjs');
const LOGO = 'E:/Dev/GameDev/Godot/COILBREAKER/assets/ui/logo-2026-11-05.png';
// Les vingt captures du kit presse ne changent pas : celles du 6 nov.
const PRESSE = 'E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-06-bandes-annonces';
const PRESSE_SHOTS = ['01-fin-de-partie', '02-concasseur', '03-forteresse', '04-belier', '05-evolution',
  '06-pose', '07-niveau', '08-pilote', '09-caisse', '10-victoire'];
const args = process.argv.slice(2), skipVideo = args.includes('--sans-video');
const source = path.resolve(args.find(a => !a.startsWith('--')) || 'E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-10-vitrine-propositions');
const root = path.resolve(__dirname, '../..'), assets = path.join(root, 'coilbreaker/assets'), press = path.join(root, 'coilbreaker/press/assets');
// screen-NN de la page : capture de galerie-<langue>/ de la proposition.
const shots = {13: '01-horde', 14: '02-pose', 15: '08-fin-de-partie', 16: '07-pilote', 17: '09-debut'};
// Vidéo : 47 s, vidéo 3,6 Mb/s + AAC 128 kb/s (environ 22 Mo), plafond 6 Mb/s.
const VIDEO_KBPS = 3600, POSTER_AT = '1.0';
const manifest = {date: '2026-11-10', source, jeu: '0.20.10, branche outils/bandes-annonces-2026-11, --early-access', files: []};
const note = (from, to) => manifest.files.push({source: from, source_sha256: hash(from), output: path.relative(root, to).replace(/\\/g, '/'), bytes: fs.statSync(to).size, sha256: hash(to)});
(async () => {
  for (const lang of ['fr', 'en']) {
    for (const [num, shot] of Object.entries(shots)) {
      const from = path.join(source, `galerie-${lang}`, `${shot}.png`);
      const full = path.join(assets, `screen-${num}-${lang}.webp`), thumb = path.join(assets, `screen-${num}-${lang}-thumb.webp`);
      await capture(from, full, thumb); note(from, full); note(from, thumb);
    }
    const film = path.join(source, `COILBREAKER-youtube-${lang}.mp4`), trailer = path.join(assets, `trailer-${lang}.mp4`);
    if (!skipVideo) { encode(film, trailer, VIDEO_KBPS); note(film, trailer); }
    const affiche = path.join(assets, `trailer-poster-${lang}.webp`);
    await poster(film, affiche, POSTER_AT); note(film, affiche);
  }
  // Capsule A (Elys et Freya, queue de cheval bouclée) : image clé du kit presse, image de partage, en-tête Steam.
  const caps = path.join(source, 'capsules/bouclee/A'), main = path.join(caps, 'main.png'), header = path.join(caps, 'header.png');
  const keyArt = path.join(press, 'key-art-16x9.jpg'), share = path.join(assets, 'share.jpg'), steamHeader = path.join(assets, 'steam-header.webp');
  await sharp(main).extract({left: 0, top: 0, width: 1232, height: 693}).resize(1200, 675).jpeg({quality: 92, mozjpeg: true}).toFile(keyArt); note(main, keyArt);
  await sharp(main).extract({left: 0, top: 8, width: 1232, height: 647}).resize(1200, 630).jpeg({quality: 90, mozjpeg: true}).toFile(share); note(main, share);
  await sharp(header).webp({quality: 90, effort: 6}).toFile(steamHeader); note(header, steamHeader);
  // ZIP presse : les vingt captures du 6 nov. telles quelles, les six capsules A, les logos. Stocké sans recompression.
  const zip = path.join(press, 'COILBREAKER-press-kit.zip');
  const entries = [];
  for (const lang of ['en', 'fr']) for (const shot of PRESSE_SHOTS) entries.push([path.join(PRESSE, `galerie-${lang}`, `${shot}.png`), `screenshots-${lang}/coilbreaker-${shot}-${lang}.png`]);
  for (const [f, nom] of [['header', 'header_920x430'], ['main', 'main_1232x706'], ['vertical', 'vertical_748x896'], ['library', 'library_600x900'], ['library_hero', 'library_hero_3840x1240'], ['small', 'small_462x174']])
    entries.push([path.join(caps, `${f}.png`), `steam-capsules/${nom}.png`]);
  entries.push([LOGO, 'logos/coilbreaker-logo.png'], [path.join(press, 'rogue-paradigm.png'), 'logos/rogue-paradigm.png']);
  const zipper = 'import sys,json,zipfile\nz=zipfile.ZipFile(sys.argv[1],"w",zipfile.ZIP_STORED)\nfor a,b in json.loads(sys.argv[2]):\n z.write(a,b)\nz.close()';
  run('python', ['-I', '-c', zipper, zip, JSON.stringify(entries)]);
  manifest.files.push({output: path.relative(root, zip).replace(/\\/g, '/'), bytes: fs.statSync(zip).size, sha256: hash(zip), contents: entries.map(e => e[1])});
  fs.writeFileSync(path.join(root, 'assets/site/coilbreaker-2026-11-10.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`${manifest.files.length} fichiers écrits depuis ${source}${skipVideo ? ' (vidéos non réencodées)' : ''}.`);
})().catch(e => { console.error(e); process.exitCode = 1; });
