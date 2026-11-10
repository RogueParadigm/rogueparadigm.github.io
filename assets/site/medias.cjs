// Outils communs aux recettes de médias de la page COILBREAKER (update-coilbreaker-*.cjs).
// Les sources ne sont jamais modifiées.
const fs = require('fs'), path = require('path'), crypto = require('crypto'), {spawnSync} = require('child_process');
const sharp = require('E:/Dev/Tools/rogue-image-masks/node_modules/sharp');
const FFMPEG = 'C:/Users/elysa/miniconda3/Library/bin/ffmpeg.exe'; // affiches
// Le ffmpeg de miniconda n'a pas libx264 (seulement OpenH264 et Media Foundation, nettement moins bons à 3,5 Mb/s).
// x264 : binaire statique tiré du paquet PyPI imageio-ffmpeg 0.8.1 (build gyan.dev 9.0.2), extrait dans E:/Dev/Tools/ffmpeg-x264.
const X264 = process.env.FFMPEG_X264 || 'E:/Dev/Tools/ffmpeg-x264/ffmpeg.exe';

const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

function run(cmd, list) {
  const r = spawnSync(cmd, list, {stdio: ['ignore', 'inherit', 'inherit']});
  if (r.status !== 0) throw new Error(`${path.basename(cmd)} a échoué (${r.status})`);
}

// H.264 1080p30, x264 deux passes à `kbps` (plafond 6 Mb/s), AAC 128 kb/s, faststart.
function encode(from, to, kbps) {
  const log = path.join(require('os').tmpdir(), `coilbreaker-site-${path.basename(to, '.mp4')}`);
  const common = ['-y', '-v', 'error', '-i', from, '-map', '0:v:0', '-map', '0:a:0?', '-c:v', 'libx264', '-preset', 'slower',
    '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p', '-vf', 'scale=1920:1080:flags=lanczos', '-r', '30', '-g', '60',
    '-b:v', `${kbps}k`, '-maxrate', '6000k', '-bufsize', '9000k', '-passlogfile', log];
  run(X264, [...common, '-pass', '1', '-an', '-f', 'mp4', process.platform === 'win32' ? 'NUL' : '/dev/null']);
  run(X264, [...common, '-pass', '2', '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-movflags', '+faststart', to]);
  for (const f of fs.readdirSync(path.dirname(log))) if (f.startsWith(path.basename(log))) fs.rmSync(path.join(path.dirname(log), f), {force: true});
}

// Une capture 1920 px et sa vignette 960 px, en WebP.
async function capture(from, full, thumb) {
  await sharp(from).resize({width: 1920, withoutEnlargement: true}).webp({quality: 88, effort: 6}).toFile(full);
  await sharp(from).resize(960).webp({quality: 82, effort: 6}).toFile(thumb);
}

// L'affiche d'une vidéo : son image à `at` secondes, en WebP.
async function poster(film, to, at) {
  const png = to.replace(/\.webp$/, '.png');
  run(FFMPEG, ['-y', '-v', 'error', '-ss', at, '-i', film, '-frames:v', '1', png]);
  await sharp(png).webp({quality: 86, effort: 6}).toFile(to); fs.rmSync(png);
}

module.exports = {sharp, FFMPEG, X264, hash, run, encode, capture, poster};
