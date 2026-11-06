"use strict";
const $ = id => document.getElementById(id);
const strings = {
fr: {
 skip:"Aller au contenu",navDemo:"La démo",navGame:"Le jeu",navScreens:"Captures",playShort:"Steam ↗",
 heroCopy:"Un survivor roguelite où tu pilotes un serpent de ferraille à travers des hordes de machines. Ses armes tirent toutes seules, et leur place sur la tête, le corps ou la queue change leur façon de tirer.",playDemo:"Jouer à la démo",wishlist:"Ajouter à ma liste de souhaits",browserNote:"Démo Windows sur Steam · Voix FR / EN",trailer:"Bande-annonce",heroCaption:"LA CASSE<br>IMAGES DE LA DÉMO",
 demoEyebrow:"DÉMO JOUABLE / LA CASSE",demoTitle:"La démo",demoCopy:"La Casse et le Ferrailleur, avec l’XP, les montées de niveau et la pose des armes. Rien n’est gardé d’une partie à l’autre.",demoTag:"/ DÉMO",ready:"PRÊTE",launch:"Lancer la démo",loading:"Chargement…",loadingNote:"Le premier chargement (environ 65 Mo) peut prendre une trentaine de secondes.",device:"ORDINATEUR OU MOBILE · CLAVIER, MANETTE OU DOIGT",fullscreen:"⛶ Plein écran",fullscreenExit:"⛶ Quitter le plein écran",stop:"Quitter la démo",steer:"ou maintiens le doigt pour diriger",automatic:"Les armes tirent toutes seules",escapeKey:"ÉCHAP",pause:"pause",allControls:"Toutes les commandes +",controlsCopy:"Flèches, ZQSD ou le stick gauche pour diriger. Au doigt ou à la souris : garde le doigt ou le clic appuyé et glisse, un stick apparaît dessous. Les armes tirent toutes seules. Ramasse les cellules d’XP pour monter de niveau. Choisis une carte en la touchant, à la souris, ou avec les flèches et Entrée. Échap ou Start met en pause.",scope:"Le garage, les autres serpents et armes, les succès Steam et les autres niveaux sont dans le jeu complet.",
 buildLabel:"DÉMO / POSE D’UNE ARME",fullEyebrow:"LA DÉMO STEAM",fullTitle:"La Casse, jusqu’à l’extraction",full1:"Ton serpent est un convoi de ferraille : une tête, des blocs, une queue. À chaque niveau, tu choisis une arme, un rang ou un passif, et l’endroit où visser chaque nouvelle arme. Une mitrailleuse sur la tête tire devant toi ; sur la queue, elle tire derrière.",full2:"La démo comprend La Casse, trois serpents, cinq armes et quatre pilotes à débloquer. Survis aux hordes et aux boss jusqu’à l’extraction à vingt minutes. Entre deux parties, dépense ta ferraille pour le premier rang des améliorations du garage.",full3:"Sentinelle te guide en français ou en anglais. Interface et sous-titres en dix langues. Le jeu complet ajoute des serpents, des armes, Freya et ses grenouilles, les rangs supérieurs du garage et les succès Steam. L’accès anticipé commence avec La Casse.",discover:"Voir la page Steam",
 galleryEyebrow:"CAPTURES",galleryTitle:"Captures de la démo",galleryCopy:"Le jeu actuel. Clique pour agrandir.",shot0:"Le Ferrailleur",shot1:"Le Mécano",shot2:"Le Bélier",shot3:"Le barrage",shot4:"La Forteresse",coming:"PROCHAINEMENT SUR STEAM",lastTitle:"COILBREAKER sur Steam",lastCta:"Ajouter à ma liste de souhaits",credit:"Un jeu d’Elys. © 2026 Rogue Paradigm.",legal:"Mentions légales",press:"Kit presse",top:"Retour en haut ↑",
 statusTitle:"DÉMARRAGE",statusIntro:"LA CASSE",statusPlaying:"PARTIE EN COURS",statusUpgrade:"CHOIX D’AMÉLIORATION",statusPaused:"PAUSE",statusLost:"PARTIE TERMINÉE",statusLoading:"CHARGEMENT",fileError:"Lance cette page depuis un site ou un serveur local pour jouer à la démo.",loadError:"Le chargement prend plus longtemps que prévu. Tu peux quitter la démo et réessayer.",close:"Fermer",previous:"Précédente",next:"Suivante",poster:"La borne d’arcade COILBREAKER",title:"COILBREAKER | Rogue Paradigm",
 altBuild:"Écran de la démo : choix de l’emplacement d’une arme sur le serpent",altShot0:"Un serpent armé au milieu d’une horde de machines dans La Casse",altShot1:"Le Mécano combat les machines dans La Casse",altShot2:"Le Bélier et sa tourelle à trois canons",altShot3:"Les zones rouges annoncent le barrage du Bélier",altShot4:"La Forteresse face à un long serpent armé",altSteam:"Illustration officielle COILBREAKER sur Steam"
},
en: {
 skip:"Skip to content",navDemo:"The demo",navGame:"The game",navScreens:"Screenshots",playShort:"Steam ↗",
 heroCopy:"A survivor roguelite where you steer a scrap-metal snake through hordes of machines. Its weapons fire on their own, and where they sit on the head, body or tail changes how they fire.",playDemo:"Play the demo",wishlist:"Add to your wishlist",browserNote:"Windows demo on Steam · French / English voices",trailer:"Trailer",heroCaption:"THE SCRAPYARD<br>DEMO FOOTAGE",
 demoEyebrow:"PLAYABLE DEMO / THE SCRAPYARD",demoTitle:"The demo",demoCopy:"The Scrapyard and the Scrapper, with XP, level-ups and weapon placement. Nothing carries over between runs.",demoTag:"/ DEMO",ready:"READY",launch:"Launch the demo",loading:"Loading…",loadingNote:"The first load (about 65 MB) can take about thirty seconds.",device:"DESKTOP OR MOBILE · KEYBOARD, CONTROLLER OR TOUCH",fullscreen:"⛶ Fullscreen",fullscreenExit:"⛶ Exit fullscreen",stop:"Leave the demo",steer:"or hold a finger down to steer",automatic:"Weapons fire on their own",escapeKey:"ESC",pause:"pause",allControls:"All controls +",controlsCopy:"Arrow keys, WASD or the left stick to steer. With a finger or the mouse: hold down and slide, a stick appears under it. Weapons fire on their own. Collect XP cells to level up. Pick a card by tapping it, with the mouse, or with the arrows and Enter. Esc or Start pauses.",scope:"The garage, the other snakes and weapons, Steam achievements and further stages are in the full game.",
 buildLabel:"DEMO / MOUNTING A WEAPON",fullEyebrow:"THE STEAM DEMO",fullTitle:"The Scrapyard, through to extraction",full1:"Your snake is a convoy of scrap: a head, body blocks and a tail. At each level-up you pick a weapon, a rank or a passive, and where to bolt each new weapon. A machine gun on the head fires ahead of you; on the tail, it fires behind.",full2:"The demo includes the Scrapyard, three snakes, five weapons and four unlockable pilots. Survive the hordes and bosses until extraction at twenty minutes. Between runs, spend scrap on the first rank of garage upgrades.",full3:"Sentinelle guides you in French or English. Interface and subtitles support ten languages. The full game adds snakes, weapons, Freya and her frogs, higher garage ranks and Steam achievements. Early Access starts with the Scrapyard.",discover:"See the Steam page",
 galleryEyebrow:"SCREENSHOTS",galleryTitle:"Demo screenshots",galleryCopy:"Current gameplay. Click to enlarge.",shot0:"The Scrapper",shot1:"The Mechanic",shot2:"The Ram",shot3:"Mortar barrage",shot4:"The Fortress",coming:"COMING SOON ON STEAM",lastTitle:"COILBREAKER on Steam",lastCta:"Add to your wishlist",credit:"A game by Elys. © 2026 Rogue Paradigm.",legal:"Legal notices",press:"Press kit",top:"Back to top ↑",
 statusTitle:"STARTING",statusIntro:"THE SCRAPYARD",statusPlaying:"RUN IN PROGRESS",statusUpgrade:"CHOOSING AN UPGRADE",statusPaused:"PAUSED",statusLost:"RUN OVER",statusLoading:"LOADING",fileError:"Open this page from a website or local server to play the demo.",loadError:"Loading is taking longer than expected. You can leave the demo and try again.",close:"Close",previous:"Previous",next:"Next",poster:"The COILBREAKER arcade cabinet",title:"COILBREAKER | Rogue Paradigm",
 altBuild:"Demo screen: choosing where to mount a weapon on the snake",altShot0:"An armed snake in a horde of machines in the Scrapyard",altShot1:"The Mechanic fights machines in the Scrapyard",altShot2:"The Ram and its three-barrel turret",altShot3:"Red ground zones warn of the Ram’s mortar barrage",altShot4:"The Fortress facing a long armed snake",altSteam:"Official COILBREAKER artwork on Steam"
}
};
let language = new URLSearchParams(location.search).get("lang");
if (!Object.hasOwn(strings, language)) language = "en";
let selectedShot = 0, galleryTrigger = null;
const shotNumbers = ["01", "02", "03", "04", "05"];
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
  document.querySelectorAll("[data-screen]").forEach(node => { node.src = `assets/screen-${node.dataset.screen}-${language}.webp`; });
  $("trailer-video").poster = `assets/screen-01-${language}.webp`;
  document.title = t("title");
  if ($("gallery-dialog").open) updateShot();
}
document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => {
  applyLanguage(button.dataset.language);
  const url = new URL(location.href);url.searchParams.set("lang",language);history.replaceState(null,"",url);
}));
applyLanguage(language);
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
