"use strict";
const $ = id => document.getElementById(id);
const strings = {
fr: {
 title:"COILBREAKER | Rogue Paradigm",skip:"Aller au contenu",navGame:"Le jeu",navScreens:"Captures",
 heroCopy:"Tu pilotes un serpent mécanique contre des centaines de machines. À chaque montée de niveau, tu gagnes des améliorations ou des armes dont tu choisis la position sur le serpent.",
 wishlist:"Ajouter à ma liste de souhaits",demoLine:"Démo gratuite à venir sur Steam",
 mountTitle:"Où poser l’arme",mountCopy:"En queue, la cloueuse tire ses clous derrière toi. Sur le corps, elle les tire sur un flanc, puis sur l’autre.",
 galleryTitle:"Captures",shot0:"Le Désert",shot1:"Début de partie",shot2:"Le hangar",galleryNote:"Captures de la version 3D en cours, 14 novembre 2026. La bande-annonce sera refaite sur cette version.",
 offerTitle:"Démo et accès anticipé",
 offerDemo:"<b>Démo.</b> Gratuite. Un terrain, la Casse, avec trois serpents, cinq armes et quatre pilotes. Une partie dure vingt minutes.",
 offerEarly:"<b>Accès anticipé, prévu au premier trimestre 2027.</b> Plus de serpents et d’armes, et Freya, une pilote absente de la démo. D’autres terrains ensuite.",
 credit:"Un jeu d’Elys",press:"Kit presse",legal:"Mentions légales",close:"Fermer",previous:"Précédente",next:"Suivante",
 altHero:"Le serpent sur la route du barrage, en 3D",altMount:"Pose de la cloueuse : choix de sa place sur le serpent",altShot0:"Le Ferrailleur devant une butte du Désert",altShot1:"Les premiers buggys autour du serpent",altShot2:"L’écran de Préparation : le Ferrailleur dans le hangar"
},
en: {
 title:"COILBREAKER | Rogue Paradigm",skip:"Skip to content",navGame:"The game",navScreens:"Screenshots",
 heroCopy:"You steer a mechanical snake against hundreds of machines. At each level-up, you gain upgrades or weapons and choose their position on the snake.",
 wishlist:"Add to your wishlist",demoLine:"Free demo coming to Steam",
 mountTitle:"Where to place the weapon",mountCopy:"On the tail, the nail gun fires behind you. On the body, it fires to one side, then the other.",
 galleryTitle:"Screenshots",shot0:"The Desert",shot1:"Early in a run",shot2:"The hangar",galleryNote:"Screenshots of the 3D version in progress, 14 November 2026. The trailer will be redone on this version.",
 offerTitle:"Demo and Early Access",
 offerDemo:"<b>Demo.</b> Free. One stage, the Scrapyard, with three snakes, five weapons and four drivers. A run lasts twenty minutes.",
 offerEarly:"<b>Early Access, planned for the first quarter of 2027.</b> More snakes and weapons, and Freya, a driver who is not in the demo. More stages later.",
 credit:"A game by Elys",press:"Press kit",legal:"Legal notices",close:"Close",previous:"Previous",next:"Next",
 altHero:"The snake on the dam road, in 3D",altMount:"Placing the nail gun: choosing its spot on the snake",altShot0:"The Ferrailleur near a mesa in the Desert",altShot1:"The first buggies around the snake",altShot2:"The Preparation screen: the Ferrailleur in the hangar"
}
};
let language = new URLSearchParams(location.search).get("lang");
if (!Object.hasOwn(strings, language)) language = (navigator.language || "").toLowerCase().startsWith("fr") ? "fr" : "en";
let selectedShot = 0, galleryTrigger = null;
const shotNumbers = ["02", "03", "05"]; // screen-3d-NN, une seule version pour les deux langues
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
  document.title = t("title");
  if ($("gallery-dialog").open) updateShot();
}
document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click", () => {
  applyLanguage(button.dataset.language);
  const url = new URL(location.href); url.searchParams.set("lang", language); history.replaceState(null, "", url);
}));
applyLanguage(language);

function updateShot() {
  $("lightbox-image").src = `assets/screen-3d-${shotNumbers[selectedShot]}.webp`;
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
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => $(button.dataset.close).close()));
document.querySelectorAll(".media-dialog").forEach(dialog => dialog.addEventListener("click", event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
}));
