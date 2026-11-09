"use strict";
const $ = id => document.getElementById(id);
const strings = {
fr: {
 title:"COILBREAKER | Rogue Paradigm",skip:"Aller au contenu",navGame:"Le jeu",navScreens:"Captures",
 heroCopy:"Tu pilotes un serpent mécanique contre des centaines de machines. À chaque montée de niveau, tu gagnes des améliorations ou des armes dont tu choisis la position sur le serpent.",
 wishlist:"Ajouter à ma liste de souhaits",demoLine:"Démo gratuite à venir sur Steam",trailer:"Bande-annonce",
 mountTitle:"Où poser l’arme",mountCopy:"En queue, le roulement à billes lâche ses billes derrière toi. Sur le corps, il les lance sur un flanc, puis sur l’autre.",
 galleryTitle:"Captures",shot0:"Début de partie",shot1:"Dernière minute",shot2:"Choix de la pilote",
 offerTitle:"Démo et accès anticipé",
 offerDemo:"<b>Démo.</b> Gratuite. Un terrain, la Casse, avec trois serpents, cinq armes et quatre pilotes. Une partie dure vingt minutes.",
 offerEarly:"<b>Accès anticipé, prévu en décembre 2026.</b> Plus de serpents et d’armes, et Freya, une pilote absente de la démo. D’autres terrains ensuite.",
 credit:"Un jeu d’Elys",press:"Kit presse",legal:"Mentions légales",close:"Fermer",previous:"Précédente",next:"Suivante",
 altMount:"Pose du roulement à billes : choix de sa place sur le serpent",altShot0:"Le serpent traverse la Casse entre les premières machines",altShot1:"La horde de la dernière minute autour du serpent",altShot2:"L’écran des pilotes"
},
en: {
 title:"COILBREAKER | Rogue Paradigm",skip:"Skip to content",navGame:"The game",navScreens:"Screenshots",
 heroCopy:"You steer a mechanical snake against hundreds of machines. At each level-up, you gain upgrades or weapons and choose their position on the snake.",
 wishlist:"Add to your wishlist",demoLine:"Free demo coming to Steam",trailer:"Trailer",
 mountTitle:"Where to place the weapon",mountCopy:"On the tail, the ball bearings drop behind you. On the body, they fly out to one side, then the other.",
 galleryTitle:"Screenshots",shot0:"Early in a run",shot1:"The last minute",shot2:"Choosing a driver",
 offerTitle:"Demo and Early Access",
 offerDemo:"<b>Demo.</b> Free. One stage, the Scrapyard, with three snakes, five weapons and four drivers. A run lasts twenty minutes.",
 offerEarly:"<b>Early Access, planned for December 2026.</b> More snakes and weapons, and Freya, a driver who is not in the demo. More stages later.",
 credit:"A game by Elys",press:"Press kit",legal:"Legal notices",close:"Close",previous:"Previous",next:"Next",
 altMount:"Placing the ball bearings: choosing their spot on the snake",altShot0:"The snake crosses the Scrapyard among the first machines",altShot1:"The last-minute horde around the snake",altShot2:"The driver screen"
}
};
let language = new URLSearchParams(location.search).get("lang");
if (!Object.hasOwn(strings, language)) language = (navigator.language || "").toLowerCase().startsWith("fr") ? "fr" : "en";
let selectedShot = 0, galleryTrigger = null;
const shotNumbers = ["11", "12", "08"];
function t(key) { return strings[language][key] || key; }
function applyLanguage(next) {
  language = next;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach(node => { node.innerHTML = t(node.dataset.i18n); });
  document.querySelectorAll("[data-i18n-alt]").forEach(node => { node.alt = t(node.dataset.i18nAlt); });
  document.querySelectorAll("[data-i18n-label]").forEach(node => node.setAttribute("aria-label", t(node.dataset.i18nLabel)));
  document.querySelectorAll("[data-language]").forEach(node => node.setAttribute("aria-pressed", String(node.dataset.language === language)));
  document.querySelectorAll(".close-dialog").forEach(node => node.setAttribute("aria-label", t("close")));
  $("previous-shot").setAttribute("aria-label", t("previous"));
  $("next-shot").setAttribute("aria-label", t("next"));
  document.querySelectorAll("[data-screen]").forEach(node => { node.src = `assets/screen-${node.dataset.screen}-${language}${node.hasAttribute("data-thumb") ? "-thumb" : ""}.webp`; });
  $("trailer-video").poster = `assets/trailer-poster-${language}.webp`;
  document.title = t("title");
  if ($("gallery-dialog").open) updateShot();
}
document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => {
  applyLanguage(button.dataset.language);
  const url = new URL(location.href); url.searchParams.set("lang", language); history.replaceState(null, "", url);
}));
applyLanguage(language);

function updateShot() {
  $("lightbox-image").src = `assets/screen-${shotNumbers[selectedShot]}-${language}.webp`;
  $("lightbox-image").alt = t(`altShot${selectedShot}`);
  $("lightbox-caption").textContent = `${selectedShot + 1} / ${shotNumbers.length} · ${t(`shot${selectedShot}`)}`;
}
document.querySelectorAll("[data-shot]").forEach(button => button.addEventListener("click", () => {
  galleryTrigger = button; selectedShot = Number(button.dataset.shot); updateShot(); $("gallery-dialog").showModal();
}));
$("previous-shot").addEventListener("click", () => { selectedShot = (selectedShot + shotNumbers.length - 1) % shotNumbers.length; updateShot(); });
$("next-shot").addEventListener("click", () => { selectedShot = (selectedShot + 1) % shotNumbers.length; updateShot(); });
$("gallery-dialog").addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") { $("previous-shot").click(); event.preventDefault(); }
  if (event.key === "ArrowRight") { $("next-shot").click(); event.preventDefault(); }
});
$("gallery-dialog").addEventListener("close", () => galleryTrigger?.focus());
$("open-trailer").addEventListener("click", () => {
  const video = $("trailer-video"); video.src = `assets/trailer-${language}.mp4`; $("trailer-dialog").showModal(); video.play().catch(() => {});
});
$("trailer-dialog").addEventListener("close", () => {
  const video = $("trailer-video"); video.pause(); video.removeAttribute("src"); video.load(); $("open-trailer").focus();
});
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => $(button.dataset.close).close()));
document.querySelectorAll(".media-dialog").forEach(dialog => dialog.addEventListener("click", event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
}));
