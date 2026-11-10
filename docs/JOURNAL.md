## 2026-11-10 — Brouillon COILBREAKER : la mitrailleuse à la place de la Cloueuse (pas en ligne)

- Branche `draft/coilbreaker-2026-11-10`, poussée, **pas fusionnée dans `main`** : rien n'est en ligne.
- Elys (soir) : « J'aime pas le texte avec la clouteuse, je préférai l'exemple avec la mitrailleuse ». Sous « Où poser l'arme », la phrase du texte Steam en ligne (« Une mitrailleuse sur la tête tire devant toi ; sur la queue, elle tire derrière. », FR et EN) remplace celle de la Cloueuse, et la capture `screen-19` (début de partie, la Mitrailleuse en tête, prises existantes) remplace l'écran de pose de la Cloueuse (`screen-14`, gardé dans le dépôt).
- Elys : « Sinon le reste ça va. » Rien d'autre ne change ; ce n'est pas un accord de mise en ligne.
- La capture ne montre que la Mitrailleuse en tête : aucune prise ne la montre en queue. Dit à Elys dans la page.
- Recette : `assets/site/update-coilbreaker-2026-11-10.cjs` (`--sans-video` garde la bande-annonce dans le manifeste), `assets/site/README-2026-11-10.md`, `coilbreaker/assets/PROVENANCE.json`.
- Contrôle sans fenêtre (1440, 820, 390 px, FR et EN, kit presse) : aucune erreur console ni réseau au second passage. Aperçus : `E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-10-vitrine-propositions/site-apercus/` ; ceux d'avant : `avant-reponses-2/site-apercus/` du même dossier.
- Attend Elys : la mise en ligne (question 4 de `E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-10-vitrine-propositions/propositions.html`) ; si elle retient une capsule où Elys est refaite d'après sa référence, l'image de partage et le kit presse sont à refaire avant.

## 2026-11-10 — Brouillon COILBREAKER refait après les réponses d'Elys (pas en ligne)

- Branche `draft/coilbreaker-2026-11-10`, poussée, **pas fusionnée dans `main`** : rien n'est en ligne.
- Elys : « Le serpent qui se touche la queue, ça arrive jamais. Il faut arrêter de phantasmer là dessus. » La section « Le corps du serpent », sa capture (`screen-18`, retirée par `git rm`, encore au commit `4dc972f`) et la phrase ajoutée à l'accroche sont retirées. L'accroche est le texte en ligne sur Steam, mot pour mot.
- Bande-annonce : le montage YouTube remonté sans le plan où la tête touche le corps (47 s, « 0:47 » en dur dans `coilbreaker/index.html`).
- Elys : « Je préfère la capsule avec Elys et Freya. », « Le cheveux bouclé c'est bien pour Freya. » La capsule A, Freya en queue de cheval bouclée, fait `share.jpg` (image de partage et vignette de l'accueil), `key-art-16x9.jpg`, `steam-header.webp` et les six capsules du ZIP du kit presse. Les vingt captures du ZIP restent celles du 6 nov.
- Recette : `assets/site/update-coilbreaker-2026-11-10.cjs`, `assets/site/README-2026-11-10.md`, empreintes `assets/site/coilbreaker-2026-11-10.json`, `coilbreaker/assets/PROVENANCE.json`.
- Contrôle sans fenêtre (1440, 820, 390 px, FR et EN, kit presse) : aucune erreur console ni réseau au second passage. Aperçus : `E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-10-vitrine-propositions/site-apercus/`.
- Attend Elys : la mise en ligne (question 3 de `E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-10-vitrine-propositions/propositions.html`), après écoute de la bande-annonce.

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

