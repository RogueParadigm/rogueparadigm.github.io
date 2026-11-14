"""Médias 3D de la page COILBREAKER et du kit presse, mise à jour intermédiaire du 14 nov. 2026.

    python -I assets/site/update-coilbreaker-3d.py <atelier 2026-11-14-page-3d-tournage> [--capsule A3D|B]

Source : les captures tournées exprès le 14 nov. sur la branche portage/3d du jeu (tools/bandes_annonces/photographier.py,
vraies parties rejouées, PNG du moteur), en français et en anglais, dans <atelier>/captures/<langue>/ ; provenance dans
<atelier>/captures/captures.json. Jamais les captures d'essai d'Elys. Les sources ne sont jamais modifiées. Écrit :
  coilbreaker/assets/screen-3d-NN-<fr|en>.webp (1920 px) et -thumb.webp (960 px) ;
  coilbreaker/assets/share.jpg, steam-header.webp, press/assets/key-art-16x9.jpg : tirés de la capsule choisie ;
  coilbreaker/press/assets/coilbreaker-screenshot-NN.jpg et -thumb.jpg : les captures en anglais ;
  coilbreaker/press/assets/COILBREAKER-press-kit.zip : les PNG des deux langues, les capsules, les logos ;
  assets/site/coilbreaker-3d-2026-11-14.json : empreintes des sources et des sorties.
Les anciens screen-3d-NN.webp (sans langue) ne sont plus liés par la page.
"""
import hashlib
import json
import sys
import zipfile
from pathlib import Path

from PIL import Image

RACINE = Path(__file__).resolve().parents[2]
ASSETS = RACINE / "coilbreaker" / "assets"
PRESSE = RACINE / "coilbreaker" / "press" / "assets"
# ordre de la galerie Steam du jeu complet (captures/steam/jeu/)
CAPTURES = ["01-horde", "02-carriere", "03-barrage", "04-belier", "05-anneau"]


def sha(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()


def main():
    atelier = Path(sys.argv[1])
    capsule = sys.argv[sys.argv.index("--capsule") + 1] if "--capsule" in sys.argv else "A3D"
    manifest = {"date": "2026-11-14", "source": str(atelier), "capsule": capsule,
                "jeu": "démo 3D de la branche portage/3d, captures tournées exprès le 14 nov. 2026 (captures/captures.json de l'atelier)", "files": []}

    def note(src: Path, out: Path):
        manifest["files"].append({"source": str(src), "source_sha256": sha(src), "output": out.relative_to(RACINE).as_posix(),
                                  "bytes": out.stat().st_size, "sha256": sha(out)})

    pngs = []
    for i, nom in enumerate(CAPTURES, 1):
        for langue in ("fr", "en"):
            src = atelier / "captures" / langue / f"{nom}.png"
            pngs.append((langue, src))
            im = Image.open(src).convert("RGB")
            out = ASSETS / f"screen-3d-{i:02d}-{langue}.webp"; im.save(out, "WEBP", quality=88); note(src, out)
            out = ASSETS / f"screen-3d-{i:02d}-{langue}-thumb.webp"; im.resize((960, 540), Image.LANCZOS).save(out, "WEBP", quality=82); note(src, out)
            if langue == "en":
                out = PRESSE / f"coilbreaker-screenshot-{i:02d}.jpg"; im.save(out, "JPEG", quality=90); note(src, out)
                out = PRESSE / f"coilbreaker-screenshot-{i:02d}-thumb.jpg"; im.resize((640, 360), Image.LANCZOS).save(out, "JPEG", quality=85); note(src, out)
    # les anciennes captures 06 à 10 du kit presse (2D) ne sont plus listées par la page ; les fichiers restent dans le dépôt.
    caps = atelier / "capsules" / capsule
    main_ = Image.open(caps / "main.png").convert("RGB")  # 1232 × 706
    out = ASSETS / "share.jpg"; main_.crop((0, 29, 1232, 676)).resize((1200, 630), Image.LANCZOS).save(out, "JPEG", quality=90); note(caps / "main.png", out)
    out = PRESSE / "key-art-16x9.jpg"; main_.crop((0, 6, 1232, 699)).resize((1200, 675), Image.LANCZOS).save(out, "JPEG", quality=92); note(caps / "main.png", out)
    out = ASSETS / "steam-header.webp"; Image.open(caps / "header.png").convert("RGB").save(out, "WEBP", quality=90); note(caps / "header.png", out)
    logo = Path("E:/Dev/GameDev/Godot/COILBREAKER/assets/ui/logo-2026-11-05.png")
    zip_ = PRESSE / "COILBREAKER-press-kit.zip"
    with zipfile.ZipFile(zip_, "w", zipfile.ZIP_STORED) as z:
        for langue, p in pngs:
            z.write(p, f"captures/{langue}/{p.name}")
        for f in ("main", "header", "small", "vertical"):
            z.write(caps / f"{f}.png", f"capsules/{f}.png")
        z.write(ASSETS / "coilbreaker-logo.png", "logos/coilbreaker-logo.png")
        z.write(ASSETS / "rogue-paradigm.png", "logos/rogue-paradigm.png")
    manifest["files"].append({"output": zip_.relative_to(RACINE).as_posix(), "bytes": zip_.stat().st_size, "sha256": sha(zip_)})
    (RACINE / "assets" / "site" / "coilbreaker-3d-2026-11-14.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    print("fini :", len(manifest["files"]), "fichiers")


if __name__ == "__main__":
    main()
