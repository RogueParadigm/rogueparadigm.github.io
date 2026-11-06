// Médias de la page COILBREAKER et du kit presse, refonte graphique D (6 nov. 2026).
// Source : le dossier des bandes-annonces rendu par le moteur (jeu fe8000fc, --early-access).
//   node assets/site/update-coilbreaker-demo.cjs [dossier des bandes-annonces] [--sans-video]
// Défaut : E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-06-bandes-annonces
// Les sources ne sont jamais modifiées. Les vidéos sont réencodées en H.264 1080p (x264 deux passes, ~29 Mo).
const fs = require('fs'), path = require('path'), crypto = require('crypto'), {spawnSync} = require('child_process');
const sharp = require('E:/Dev/Tools/rogue-image-masks/node_modules/sharp');
const FFMPEG = 'C:/Users/elysa/miniconda3/Library/bin/ffmpeg.exe'; // affiches
// Le ffmpeg de miniconda n'a pas libx264 (seulement OpenH264 et Media Foundation, nettement moins bons à 3,5 Mb/s).
// x264 : binaire statique tiré du paquet PyPI imageio-ffmpeg 0.8.1 (build gyan.dev 9.0.2), extrait dans E:/Dev/Tools/ffmpeg-x264.
const X264 = process.env.FFMPEG_X264 || 'E:/Dev/Tools/ffmpeg-x264/ffmpeg.exe';
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
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const note = (from, to) => manifest.files.push({source: from, source_sha256: hash(from), output: path.relative(root, to).replace(/\\/g, '/'), bytes: fs.statSync(to).size, sha256: hash(to)});
function run(cmd, list) {
  const r = spawnSync(cmd, list, {stdio: ['ignore', 'inherit', 'inherit']});
  if (r.status !== 0) throw new Error(`${path.basename(cmd)} a échoué (${r.status})`);
}
function encode(from, to) {
  const log = path.join(require('os').tmpdir(), `coilbreaker-site-${path.basename(to, '.mp4')}`);
  const common = ['-y', '-v', 'error', '-i', from, '-map', '0:v:0', '-map', '0:a:0?', '-c:v', 'libx264', '-preset', 'slower',
    '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p', '-vf', 'scale=1920:1080:flags=lanczos', '-r', '30', '-g', '60',
    '-b:v', `${VIDEO_KBPS}k`, '-maxrate', '6000k', '-bufsize', '9000k', '-passlogfile', log];
  run(X264, [...common, '-pass', '1', '-an', '-f', 'mp4', process.platform === 'win32' ? 'NUL' : '/dev/null']);
  run(X264, [...common, '-pass', '2', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-movflags', '+faststart', to]);
  for (const f of fs.readdirSync(path.dirname(log))) if (f.startsWith(path.basename(log))) fs.rmSync(path.join(path.dirname(log), f), {force: true});
}
(async () => {
  for (const lang of ['fr', 'en']) {
    const gallery = path.join(source, `galerie-${lang}`);
    for (const shot of shots) {
      const from = path.join(gallery, `${shot}.png`), num = shot.slice(0, 2);
      const full = path.join(assets, `screen-${num}-${lang}.webp`), thumb = path.join(assets, `screen-${num}-${lang}-thumb.webp`);
      await sharp(from).resize({width: 1920, withoutEnlargement: true}).webp({quality: 88, effort: 6}).toFile(full); note(from, full);
      await sharp(from).resize(960).webp({quality: 82, effort: 6}).toFile(thumb); note(from, thumb);
      if (lang === 'en') {
        const jpg = path.join(press, `coilbreaker-screenshot-${num}.jpg`), small = path.join(press, `coilbreaker-screenshot-${num}-thumb.jpg`);
        await sharp(from).jpeg({quality: 90, mozjpeg: true}).toFile(jpg); note(from, jpg);
        await sharp(from).resize(640).jpeg({quality: 86, mozjpeg: true}).toFile(small); note(from, small);
      }
    }
    const film = path.join(source, `COILBREAKER-pub-${lang}.mp4`), trailer = path.join(assets, `trailer-${lang}.mp4`);
    if (!skipVideo) { encode(film, trailer); note(film, trailer); }
    const poster = path.join(assets, `trailer-poster-${lang}.webp`), png = poster.replace(/\.webp$/, '.png');
    run(FFMPEG, ['-y', '-v', 'error', '-ss', POSTER_AT, '-i', film, '-frames:v', '1', png]);
    await sharp(png).webp({quality: 86, effort: 6}).toFile(poster); fs.rmSync(png); note(film, poster);
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
