## 2026-11-14, soir — Page COILBREAKER en 3D : captures tournées exprès (brouillon)

- Elys a refusé la première version, faite de ses captures d'essai : « Les images sont toutes buggués. genre, je te passe des captures parcequ'il y a des bugs, tu te dis que c'est bien pour la page steam ». La branche `draft/coilbreaker-3d-2026-11-14` ne se fusionne pas.
- Nouvelle branche `draft/coilbreaker-3d-tournage-2026-11-14`, partie de `main`, non fusionnée, non déployée : mêmes changements de page (accroche sans bande-annonce, « premier trimestre 2027 », kit presse), avec cinq captures tournées exprès sur `portage/3d`, en français et en anglais (`screen-3d-NN-{fr,en}.webp`) : la horde, La Carrière, Le Barrage, Le Bélier, l'anneau de machines. Aucune capture d'Elys dans la branche.
- « Où poser l'arme » montre le serpent armé en partie : l'écran POSER a encore des vignettes 2D.
- Vignette, image de partage, visuel du kit : capsule A3D refaite sur une photo 4K de La Carrière ; capsule B possible par `--capsule B`.
- Recette : `assets/site/update-coilbreaker-3d.py`, `README-3d-2026-11-14.md`. Sources, provenance et page de validation : `E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-14-page-3d-tournage/`.
- Attend Elys : son accord sur la page de validation, puis la fusion dans `main`.

## 2026-11-14 — Page COILBREAKER en 3D, mise à jour intermédiaire (brouillon)

- Elys : « Là, c'est pas du tout comme le jeu, ça me fait perdre des wishlists. » Le jeu est passé en 3D ; la page montrait la 2D. Branche `draft/coilbreaker-3d-2026-11-14`, non fusionnée, non déployée : fusion après son « je publie » sur la page de questions.
- Accroche : capture 3D du barrage, sans bouton de bande-annonce (la vidéo 2D n'est plus proposée, fichiers gardés). « Où poser l'arme » : l'écran POSER 3D (Cloueuse), texte suivi. Galerie : le Désert, le début de partie, le hangar (`screen-3d-NN`, une seule version, interface en français). Ligne sous la galerie : captures de la version 3D en cours.
- Accès anticipé « prévu au premier trimestre 2027 » (Elys, 11 nov.) à la place de décembre 2026. Vignette de l'accueil, image de partage et visuel du kit presse : capsule A3D (capture 3D, Elys et Freya, logo) ; capsule B possible par `--capsule B`.
- Kit presse : cinq captures 3D, « En 3D, vu de dessus », bande-annonce annoncée comme refaite, ZIP refait.
- Recette : `assets/site/update-coilbreaker-3d.py`, `README-3d-2026-11-14.md`, empreintes `coilbreaker-3d-2026-11-14.json`. Sources et page de questions : `E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-14-page-3d-urgente/` (`questions.html`).
- Reste : captures en anglais, bande-annonce et capsules sur le build final (`PLANS-A-TOURNER.md` de l'atelier).

## 2026-11-09 — Galerie COILBREAKER sans les captures de boss

- Elys : « t'as mis des captures des "boss" et on les voit même pas. Mets justes des captures normales ». Les deux captures de boss sont remplacées par « Début de partie » et « Dernière minute » (`screen-11`, `screen-12`, prises du 9 nov.) ; légendes et textes alternatifs FR/EN. « Choix de la pilote » reste, à refilmer avec les nouveaux portraits.

## 2026-11-09 — Page COILBREAKER en ligne, dessins d'après les fiches de modèle

- Elys : « Ok, tu peux changer la page du site. Oublies pas de bien mettre à jour la vignette sur la page principale. » La branche `draft/coilbreaker-demo-2026-11-06` est fusionnée dans `main` (avance rapide) et publiée.
- Elys en tête de page : nouveau portrait du jeu (`elys-pilote.webp`). Vignette de l'accueil et image de partage (`share.jpg`), image clé du kit presse : capsule A, Elys et Freya (choix d'Elys « A »).
- Recettes et sources : `assets/site/README-demo-2026-11-06.md`, `coilbreaker/assets/PROVENANCE.json`. Aperçus : `E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-09-site-fiches/`.
- Reste : la capture de l'écran des pilotes (`screen-06`) et le ZIP du kit presse (capsules E) montrent encore les anciens dessins ; à refaire quand le PC d'Elys est libre.

## 2026-11-06 — Médias de la refonte graphique D dans le brouillon

- Page COILBREAKER : dix captures de la galerie Steam en rendu D (FR/EN, WebP 1920 px et vignettes 960 px), huit dans la galerie, la pose de la Cloueuse dans « La démo Steam » ; bande-annonce publicitaire de 63 s réencodée en H.264 1080p (29,8 Mo par langue) avec une affiche ; logo du 5 nov. ; `share.jpg` et l'en-tête Steam tirés des capsules E.
- Textes : les images sont dites « de l'accès anticipé » (jeu filmé en `--early-access`) ; démo le 19 novembre, accès anticipé visé début décembre 2026. Trois serpents, cinq armes, quatre pilotes, Freya dans le jeu complet : inchangé.
- Kit presse : mêmes médias, dix captures, ZIP `COILBREAKER-press-kit.zip` (PNG FR/EN, capsules E, logos ; remplace `COILBREAKER-demo-images.zip`), fiche avec la démo et l'accès anticipé, textes périmés de la démo navigateur retirés.
- Recette : `node assets/site/update-coilbreaker-demo.cjs <bandes-annonces>` (x264 dans `E:/Dev/Tools/ffmpeg-x264`) ; aperçu : `assets/site/apercu-coilbreaker.cjs`.
- Captures d'aperçu : `E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-06-site/`. Branche `draft/coilbreaker-demo-2026-11-06`, non fusionnée, non déployée.
- Attend Elys : capsule E (question 4), musique de la publicité (question 1), dates affichées, galerie sans l'écran des pilotes.

## 2026-11-06 — Texte court retenu après revue

- Elys retient la description centrée sur l’assemblage, les places d’armes et le contenu de La Casse (choix 5B) ; « Survies » corrigé en « Survis ».
- Même texte FR/EN dans le haut de page et le repli HTML anglais ; correspond aux brouillons Steam rechargés et vérifiés.
- La bande-annonce reste en attente d’une nouvelle discussion après validation du jeu (4B). Les médias précédents sont des propositions, pas une publication.
- Vérification : syntaxe JavaScript, contrôle du diff. Branche `draft/coilbreaker-demo-2026-11-06` poussée, non fusionnée dans `main` et non déployée.
## 2026-11-06 — Brouillon de la page COILBREAKER pour la démo

- Branche `draft/coilbreaker-demo-2026-11-06`, non déployée. Textes FR/EN : contenu réel de la démo, Sentinelle parlée FR/EN, dix langues d’interface et sous-titres ; Freya réservée au jeu complet.
- Douze captures nouvelles, deux vidéos de 37 s en 1080p30, logo actuel, galerie et kit presse mis à jour ; déclaration IA élargie aux voix.
- Médias tirés du vrai moteur, sources et recette `assets/site/update-coilbreaker-demo.cjs` ; jeu source `RogueParadigm/COILBREAKER`, branche `feat/demo-freya-belier`, commit `f15c42aa`.
- Vérification des mises en page à 1100 et 390 px dans une copie HTML autonome, sans serveur. Revue : `E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-06-freya-belier/site-apercu.html`.
- Attend Elys : validation du montage, des images et des textes avant fusion dans `main` (GitHub Pages).

