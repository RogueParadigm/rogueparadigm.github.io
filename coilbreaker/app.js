"use strict";
const $ = id => document.getElementById(id);
const strings = {
fr: {
 skip:"Aller au contenu",navDemo:"La démo",navGame:"Le jeu",navScreens:"Captures",playShort:"Jouer",
 heroCopy:"Un survivor roguelite où tu pilotes un serpent de ferraille à travers des hordes de machines. Ses armes tirent toutes seules, et leur place sur la tête, le corps ou la queue change leur façon de tirer.",playDemo:"Jouer à la démo",wishlist:"Ajouter à ma liste de souhaits",browserNote:"Démo gratuite dans le navigateur, sur ordinateur ou mobile",trailer:"Bande-annonce",heroCaption:"LA CASSE<br>IMAGES DU JEU COMPLET",
 demoEyebrow:"DÉMO JOUABLE / LA CASSE",demoTitle:"La démo",demoCopy:"La Casse et le Ferrailleur, avec l’XP, les montées de niveau et la pose des armes. Rien n’est gardé d’une partie à l’autre.",demoTag:"/ DÉMO",ready:"PRÊTE",launch:"Lancer la démo",loading:"Chargement…",loadingNote:"Le premier chargement (environ 65 Mo) peut prendre une trentaine de secondes.",device:"ORDINATEUR OU MOBILE · CLAVIER, MANETTE OU DOIGT",fullscreen:"⛶ Plein écran",fullscreenExit:"⛶ Quitter le plein écran",stop:"Quitter la démo",steer:"ou maintiens le doigt pour diriger",automatic:"Les armes tirent toutes seules",escapeKey:"ÉCHAP",pause:"pause",allControls:"Toutes les commandes +",controlsCopy:"Flèches, ZQSD ou le stick gauche pour diriger. Au doigt ou à la souris : garde le doigt ou le clic appuyé et glisse, un stick apparaît dessous. Les armes tirent toutes seules. Ramasse les cellules d’XP pour monter de niveau. Choisis une carte en la touchant, à la souris, ou avec les flèches et Entrée. Échap ou Start met en pause.",scope:"Le garage, les autres serpents et armes, les succès Steam et les autres niveaux sont dans le jeu complet.",
 buildLabel:"JEU COMPLET / POSE D’UNE ARME",fullEyebrow:"LE JEU COMPLET",fullTitle:"Prochainement sur Steam",full1:"Ton serpent est un convoi de ferraille : une tête, des blocs, une queue. À chaque niveau, tu choisis une arme, un rang ou un passif, et l’endroit où visser chaque nouvelle arme. Une mitrailleuse sur la tête tire devant toi ; sur la queue, elle tire derrière.",full2:"La horde grossit et des boss arrivent à heure fixe. Entre deux parties, tu dépenses ta ferraille au garage, tu débloques d’autres serpents et d’autres armes, et tu remportes des succès Steam.",full3:"L’accès anticipé commence avec La Casse. D’autres niveaux arriveront avec les mises à jour, à commencer par La Fonderie.",discover:"Voir la page Steam",
 galleryEyebrow:"CAPTURES",galleryTitle:"Captures du jeu complet",galleryCopy:"Publiées sur Steam. Clique pour agrandir.",shot0:"La horde à 13:45",shot1:"La Forteresse",shot2:"Le Napalm",shot3:"Les Scies",shot4:"Le Concasseur",coming:"PROCHAINEMENT SUR STEAM",lastTitle:"COILBREAKER sur Steam",lastCta:"Ajouter à ma liste de souhaits",credit:"Un jeu d’Elys. © 2026 Rogue Paradigm.",legal:"Mentions légales",press:"Kit presse",top:"Retour en haut ↑",
 statusTitle:"DÉMARRAGE",statusIntro:"LA CASSE",statusPlaying:"PARTIE EN COURS",statusUpgrade:"CHOIX D’AMÉLIORATION",statusPaused:"PAUSE",statusLost:"PARTIE TERMINÉE",statusLoading:"CHARGEMENT",fileError:"Lance cette page depuis un site ou un serveur local pour jouer à la démo.",loadError:"Le chargement prend plus longtemps que prévu. Tu peux quitter la démo et réessayer.",close:"Fermer",previous:"Précédente",next:"Suivante",poster:"La borne d’arcade COILBREAKER",title:"COILBREAKER — Démo | Rogue Paradigm",
 altBuild:"Écran du jeu complet : choix de l’emplacement d’une arme sur le serpent",altShot0:"Un serpent armé au milieu d’une horde de machines dans La Casse",altShot1:"Le boss Forteresse tire un faisceau rose dans La Casse",altShot2:"Un serpent au milieu du feu du Napalm",altShot3:"Un serpent équipé de deux grandes scies",altShot4:"Le boss Concasseur face à un long serpent armé",altSteam:"Illustration officielle COILBREAKER sur Steam"
},
en: {
 skip:"Skip to content",navDemo:"The demo",navGame:"The game",navScreens:"Screenshots",playShort:"Play",
 heroCopy:"A survivor roguelite where you steer a scrap-metal snake through hordes of machines. Its weapons fire on their own, and where they sit on the head, body or tail changes how they fire.",playDemo:"Play the demo",wishlist:"Add to your wishlist",browserNote:"Free browser demo, on desktop or mobile",trailer:"Trailer",heroCaption:"THE SCRAPYARD<br>FULL GAME FOOTAGE",
 demoEyebrow:"PLAYABLE DEMO / THE SCRAPYARD",demoTitle:"The demo",demoCopy:"The Scrapyard and the Scrapper, with XP, level-ups and weapon placement. Nothing carries over between runs.",demoTag:"/ DEMO",ready:"READY",launch:"Launch the demo",loading:"Loading…",loadingNote:"The first load (about 65 MB) can take about thirty seconds.",device:"DESKTOP OR MOBILE · KEYBOARD, CONTROLLER OR TOUCH",fullscreen:"⛶ Fullscreen",fullscreenExit:"⛶ Exit fullscreen",stop:"Leave the demo",steer:"or hold a finger down to steer",automatic:"Weapons fire on their own",escapeKey:"ESC",pause:"pause",allControls:"All controls +",controlsCopy:"Arrow keys, WASD or the left stick to steer. With a finger or the mouse: hold down and slide, a stick appears under it. Weapons fire on their own. Collect XP cells to level up. Pick a card by tapping it, with the mouse, or with the arrows and Enter. Esc or Start pauses.",scope:"The garage, the other snakes and weapons, Steam achievements and further stages are in the full game.",
 buildLabel:"FULL GAME / MOUNTING A WEAPON",fullEyebrow:"THE FULL GAME",fullTitle:"Coming soon to Steam",full1:"Your snake is a convoy of scrap: a head, body blocks and a tail. At each level-up you pick a weapon, a rank or a passive, and where to bolt each new weapon. A machine gun on the head fires ahead of you; on the tail, it fires behind.",full2:"The horde keeps growing and bosses arrive on schedule. Between runs, you spend your scrap in the garage, unlock other snakes and weapons, and earn Steam achievements.",full3:"Early Access starts with the Scrapyard. More stages will come with updates, starting with the Foundry.",discover:"See the Steam page",
 galleryEyebrow:"SCREENSHOTS",galleryTitle:"Full game screenshots",galleryCopy:"Published on Steam. Click to enlarge.",shot0:"The horde at 13:45",shot1:"The Fortress",shot2:"Napalm",shot3:"Saws",shot4:"The Pulverizer",coming:"COMING SOON ON STEAM",lastTitle:"COILBREAKER on Steam",lastCta:"Add to your wishlist",credit:"A game by Elys. © 2026 Rogue Paradigm.",legal:"Legal notices",press:"Press kit",top:"Back to top ↑",
 statusTitle:"STARTING",statusIntro:"THE SCRAPYARD",statusPlaying:"RUN IN PROGRESS",statusUpgrade:"CHOOSING AN UPGRADE",statusPaused:"PAUSED",statusLost:"RUN OVER",statusLoading:"LOADING",fileError:"Open this page from a website or local server to play the demo.",loadError:"Loading is taking longer than expected. You can leave the demo and try again.",close:"Close",previous:"Previous",next:"Next",poster:"The COILBREAKER arcade cabinet",title:"COILBREAKER — Demo | Rogue Paradigm",
 altBuild:"Full game screen: choosing where to mount a weapon on the snake",altShot0:"An armed snake in a horde of machines in the Scrapyard",altShot1:"The Fortress boss fires a pink beam in the Scrapyard",altShot2:"A snake in the Napalm fire",altShot3:"A snake fitted with two large saws",altShot4:"The Pulverizer boss facing a long armed snake",altSteam:"Official COILBREAKER artwork on Steam"
}
};
let language = new URLSearchParams(location.search).get("lang");
if (!Object.hasOwn(strings, language)) language = "en";
let frame = null, lastStatus = null, loadTimer = null, selectedShot = 0, galleryTrigger = null;
const shotNumbers = ["01", "02", "05", "06", "04"];
// The playable build: demo/ next to this page, or another host's embed (data-game on the cabinet).
const gameUrl = $("arcade-frame").dataset.game || "demo/index.html";
// Hosted elsewhere (itch.io), the game cannot tell this page how the run goes: no status, no slow-load warning.
const gameIsLocal = new URL(gameUrl, location.href).origin === location.origin;
function t(key) { return strings[language][key] || key; }
function applyLanguage(next) {
  language = next;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach(node => { node.innerHTML = t(node.dataset.i18n); });
  document.querySelectorAll("[data-i18n-alt]").forEach(node => { node.alt = t(node.dataset.i18nAlt); });
  document.querySelectorAll("[data-i18n-label]").forEach(node => node.setAttribute("aria-label", t(node.dataset.i18nLabel)));
  document.querySelectorAll("[data-language]").forEach(node => node.setAttribute("aria-pressed", String(node.dataset.language === language)));
  document.querySelectorAll(".close-dialog").forEach(node => node.setAttribute("aria-label",t("close")));
  $("previous-shot").setAttribute("aria-label",t("previous"));$("next-shot").setAttribute("aria-label",t("next"));
  $("demo-poster").src = `assets/demo-poster-${language}.webp`;
  document.querySelectorAll("[data-screen]").forEach(node => { node.src = `assets/screen-${node.dataset.screen}-${language}.webp`; });
  $("trailer-video").poster = `assets/screen-01-${language}.webp`;$("demo-poster").alt = t("poster");
  document.title = t("title");
  if (lastStatus) showStatus(lastStatus); else if (frame) $("machine-status").textContent = t("statusLoading");
  if ($("gallery-dialog").open) updateShot();
}
document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => {
  applyLanguage(button.dataset.language);
  const url = new URL(location.href);url.searchParams.set("lang",language);history.replaceState(null,"",url);
}));
applyLanguage(language);
function showStatus(status) {
  lastStatus = status;
  const key = status.title ? "statusTitle" : status.intro ? "statusIntro" : status.state === "lost" ? "statusLost" : status.state === "paused" ? "statusPaused" : ["upgrade","placement","chest","fusion","boss_bonus"].includes(status.state) ? "statusUpgrade" : "statusPlaying";
  $("machine-status").textContent = t(key);
}
$("launch-demo").addEventListener("click", () => {
  if (frame) return;
  if (location.protocol === "file:") { $("game-message").hidden = false;$("game-message").textContent = t("fileError");return; }
  $("game-message").hidden = true;
  frame = document.createElement("iframe");frame.id = "demo-game";frame.title = "COILBREAKER demo";
  frame.setAttribute("allow","autoplay; fullscreen; gamepad; keyboard-map");frame.allowFullscreen = true;
  frame.setAttribute("sandbox","allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox");
  frame.src = gameIsLocal ? `${gameUrl}?lang=${language}` : gameUrl;
  $("demo-cover").hidden = true;$("frame-loading").hidden = false;$("stop-demo").hidden = false;
  $("machine-status").textContent = t("statusLoading");$("game-stage").append(frame);
  if (touchScreen) enterFullscreen();
  frame.addEventListener("load", () => { $("frame-loading").hidden = true;frame?.focus();if(!gameIsLocal)$("machine-status").textContent=t("statusPlaying"); });
  if (gameIsLocal) loadTimer = setTimeout(() => { if(frame && !lastStatus){$("game-message").hidden=false;$("game-message").textContent=t("loadError");} },120000);
});
$("stop-demo").addEventListener("click", () => {
  leaveFullscreen();clearTimeout(loadTimer);frame?.remove();frame=null;lastStatus=null;$("demo-cover").hidden=false;$("frame-loading").hidden=true;$("stop-demo").hidden=true;$("game-message").hidden=true;$("machine-status").textContent=t("ready");$("launch-demo").focus();
});
window.addEventListener("message", event => {
  if (!frame || event.source !== frame.contentWindow || event.origin !== location.origin) return;
  if (["coilbreaker:status","coilbreaker:defeat"].includes(event.data?.type) && event.data.status && typeof event.data.status.state === "string") {
    clearTimeout(loadTimer);$("frame-loading").hidden=true;$("game-message").hidden=true;showStatus(event.data.status);
  }
});
// Fullscreen is the game alone: the frame itself, or, where a browser cannot put a frame fullscreen (iPhone), the
// cabinet stretched over the window with its button to leave. Phones go fullscreen as the demo launches.
const touchScreen = matchMedia("(pointer: coarse)").matches && !matchMedia("(pointer: fine)").matches;
const covering = () => document.fullscreenElement || $("arcade-frame").classList.contains("covering");
function showFullscreenLabel() { $("game-fullscreen").textContent = t(covering() ? "fullscreenExit" : "fullscreen"); }
async function enterFullscreen() {
  const target = frame || $("arcade-frame");
  try {
    if (target.requestFullscreen) await target.requestFullscreen({navigationUI: "hide"});
    else if (target.webkitRequestFullscreen) target.webkitRequestFullscreen();
    else throw new Error("No fullscreen");
    screen.orientation?.lock?.("landscape").catch(() => {});
  } catch { $("arcade-frame").classList.add("covering"); document.body.classList.add("covered"); }
  showFullscreenLabel(); frame?.focus();
}
function leaveFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  $("arcade-frame").classList.remove("covering"); document.body.classList.remove("covered"); showFullscreenLabel();
}
$("game-fullscreen").addEventListener("click", () => covering() ? leaveFullscreen() : enterFullscreen());
document.addEventListener("fullscreenchange", () => { showFullscreenLabel(); if (!document.fullscreenElement) frame?.focus(); });
// While the demo runs and the cabinet is on screen, the steering keys belong to the game: a key pressed after a
// click on the page gives the keyboard back to the game instead of scrolling the page (the game paused itself).
const steeringKeys = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "];
window.addEventListener("keydown", event => {
  if (!frame || !steeringKeys.includes(event.key) || document.querySelector("dialog[open]")) return;
  if (event.target.closest?.("input, textarea, select")) return;
  const box = $("arcade-frame").getBoundingClientRect();
  if (box.bottom < 80 || box.top > innerHeight - 80) return;
  event.preventDefault();frame.focus();
});
$("controls-toggle").addEventListener("click", () => { const open=$("controls-more").hidden;$("controls-more").hidden=!open;$("controls-toggle").setAttribute("aria-expanded",String(open)); });
function updateShot() {
  $("lightbox-image").src=`assets/screen-${shotNumbers[selectedShot]}-${language}.webp`;$("lightbox-image").alt=t(`shot${selectedShot}`);
  $("lightbox-caption").textContent=`${String(selectedShot+1).padStart(2,"0")} / ${String(shotNumbers.length).padStart(2,"0")} — ${t(`shot${selectedShot}`)}`;
}
document.querySelectorAll("[data-shot]").forEach(button => button.addEventListener("click", () => { galleryTrigger=button;selectedShot=Number(button.dataset.shot);updateShot();$("gallery-dialog").showModal(); }));
$("previous-shot").addEventListener("click",()=>{selectedShot=(selectedShot+shotNumbers.length-1)%shotNumbers.length;updateShot();});
$("next-shot").addEventListener("click",()=>{selectedShot=(selectedShot+1)%shotNumbers.length;updateShot();});
$("gallery-dialog").addEventListener("keydown",event=>{if(event.key==="ArrowLeft"){$("previous-shot").click();event.preventDefault();}if(event.key==="ArrowRight"){$("next-shot").click();event.preventDefault();}});
$("gallery-dialog").addEventListener("close",()=>galleryTrigger?.focus());
$("open-trailer").addEventListener("click",()=>{const video=$("trailer-video");video.src=`assets/trailer-${language}.mp4`;$("trailer-dialog").showModal();video.play().catch(()=>{});});
$("trailer-dialog").addEventListener("close",()=>{const video=$("trailer-video");video.pause();video.removeAttribute("src");video.load();$("open-trailer").focus();});
document.querySelectorAll("[data-close]").forEach(button=>button.addEventListener("click",()=>$(button.dataset.close).close()));
document.querySelectorAll(".media-dialog").forEach(dialog=>dialog.addEventListener("click",event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}}));
