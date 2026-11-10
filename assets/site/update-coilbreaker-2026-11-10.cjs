// Médias de la proposition du 10 nov. 2026 pour la page COILBREAKER (branche de brouillon, pas de déploiement).
// Source : _atelier/COILBREAKER/2026-11-10-vitrine-propositions (prises du Ferrailleur des 9 et 10 nov., jeu 0.20.10
// lancé en --early-access ; montage « youtube » de tools/bandes_annonces/montages-2026-11-10.json).
// Refait après la critique d'Opus du 10 nov. : prises sans Scies, écran de pose à deux aperçus (screen-14), la tête
// qui touche le corps (screen-18).
//   node assets/site/update-coilbreaker-2026-11-10.cjs [dossier des propositions] [--sans-video]
// Les captures prennent des numéros neufs : les anciennes images restent dans le dépôt.
const fs = require('fs'), path = require('path');
const {hash, encode, capture, poster} = require('./medias.cjs');
const args = process.argv.slice(2), skipVideo = args.includes('--sans-video');
const source = path.resolve(args.find(a => !a.startsWith('--')) || 'E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-10-vitrine-propositions');
const root = path.resolve(__dirname, '../..'), assets = path.join(root, 'coilbreaker/assets');
// screen-NN de la page : capture de galerie-<langue>/ de la proposition.
const shots = {13: '01-horde', 14: '02-pose', 15: '08-fin-de-partie', 16: '07-pilote', 17: '09-debut', 18: '11-corps'};
// Vidéo : 49 s, vidéo 3,6 Mb/s + AAC 128 kb/s (environ 23 Mo), plafond 6 Mb/s.
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
  fs.writeFileSync(path.join(root, 'assets/site/coilbreaker-2026-11-10.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`${manifest.files.length} fichiers écrits depuis ${source}${skipVideo ? ' (vidéos non réencodées)' : ''}.`);
})().catch(e => { console.error(e); process.exitCode = 1; });
