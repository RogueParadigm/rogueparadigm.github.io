# Médias COILBREAKER du 6 novembre 2026 (refonte graphique D)

Branche de brouillon `draft/coilbreaker-demo-2026-11-06`, pas de déploiement.

Refaire le travail :

```
node assets/site/update-coilbreaker-demo.cjs E:/Dev/GameDev/_atelier/COILBREAKER/2026-11-06-bandes-annonces
```

Ajoute `--sans-video` pour ne refaire que les images. Le script lit le dossier sans le modifier et écrit :

- `coilbreaker/assets/screen-NN-{fr,en}.webp` (1920 px) et `-thumb.webp` (960 px) : les dix images de la galerie Steam, numérotées comme dans `galerie-fr/` et `galerie-en/` ;
- `trailer-{fr,en}.mp4` : la publicité de 63 s réencodée en H.264 1080p30, deux passes à 3,6 Mb/s, environ 29,8 Mo ; `trailer-poster-{fr,en}.webp` : l'image à 1 s ;
- `share.jpg`, `steam-header.webp`, `press/assets/key-art-16x9.jpg` : tirés des capsules E (rendu du jeu, logo du 5 nov.) ;
- `coilbreaker-logo.png` : `Godot/COILBREAKER/assets/ui/logo-2026-11-05.png`, sans retouche ;
- `press/assets/coilbreaker-screenshot-NN.jpg` et vignettes (anglais), `COILBREAKER-press-kit.zip` (vingt PNG FR/EN, six capsules, deux logos) ;
- `coilbreaker-demo-2026-11-06.json` : empreintes des sources et des sorties.

Le ffmpeg de miniconda n'a pas libx264 : ses encodeurs OpenH264 et Media Foundation ne tiennent pas 30 Mo sans dégrader l'image. La recette encode avec `E:/Dev/Tools/ffmpeg-x264/ffmpeg.exe`, tiré du paquet PyPI `imageio-ffmpeg` 0.8.1 (`pip download imageio-ffmpeg --no-deps --platform win_amd64`, puis extraire `imageio_ffmpeg/binaries/*.exe`). La variable `FFMPEG_X264` permet d'en indiquer un autre.

Les images viennent du jeu lancé en `--early-access` : la page les dit « images de l'accès anticipé ». Elles montrent plus que la démo (Freya dans la liste des pilotes, armes et boss du jeu complet). La capture des pilotes (08) reste hors de la galerie de la page, et elle est légendée « jeu complet » dans le kit presse. Ni la bande-annonce de gameplay (2 min, environ 200 Mo) ni les shorts ne sont sur le site.

## Page refaite dans le vocabulaire D (9 nov. 2026)

Après l'audit du 8 nov. (`_atelier/COILBREAKER/2026-11-08-audit-site/`) et la maquette validée par Elys (`_atelier/COILBREAKER/2026-11-08-maquette-site/`), `coilbreaker/index.html`, `styles.css` et `app.js` sont réécrits :

- formes de l'interface D du jeu : coins coupés, liseré orange, « //// » cyan, un seul bouton jaune hachuré, Barlow Condensed (OFL, copiée du jeu) ;
- accroche : la capture de jeu ouvre la bande-annonce, avec Elys devant (`elys-pilote.webp`) ;
- textes courts et plats ; en anglais, les mots du jeu (« driver », « place ») ;
- **pas de date pour la démo** (Elys, 9 nov. : « On sait pas quand steam va valider »), ni sur la page ni dans le kit presse ; l'accès anticipé est « prévu en décembre 2026 » ;
- langue : `?lang=`, sinon celle du navigateur.

Les captures 02, 03, 04 et 08 montrent encore les anciennes explosions et Tomás : elles seront remplacées par la recette ci-dessus une fois la galerie refilmée. `Barlow-*.ttf` de `coilbreaker/assets/` ne sert plus à la page (le kit presse a ses propres copies).

Aperçu sans fenêtre : `node assets/site/apercu-coilbreaker.cjs <dossier>` (1440, 820 et 390 px).
