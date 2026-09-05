# Rogue Paradigm website

Static storefront at [rogueparadigm.com](https://rogueparadigm.com), alongside plugin documentation deployed by each plugin's CI.

## Edit the storefront

Product copy, status, links and page templates live in `assets/site/build.cjs`. Styles and progressive enhancement live in `assets/css/storefront.css` and `assets/js/storefront.js`.

```sh
node assets/site/build.cjs
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173`. Serve from this repository root because URLs are root-relative. Commit the generated root HTML pages alongside their source changes; GitHub Pages does not need a Node build at runtime.

The generator produces the homepage, four product pages, Documentation, Support and Labs. It never writes inside the generated `Elys*/` documentation directories. Existing documentation URLs and the legal page are preserved.

## Update a release

- Keep the product order: Music Engine, Listen, License Manager, Awareness.
- Change a status in the product data, then regenerate all pages.
- Pending-publication products reserve the purchase position with a disabled `Buy on Fab` button. Demo links sit in the card footer, separate from purchase and documentation actions. Play controls are only shown on real video players.
- When Listen is published, set its exact public `fab` listing URL and change its status/state to `Available on Fab` / `available`. Also update availability in the Listen documentation source.
- Add a `video` YouTube ID to Music Engine only when its demo is available. The shared card footer and product-page player already support it.
- Check downloadable engine packages on Fab before changing compatibility claims. Documentation can cover a development version before the corresponding package is published.
- Update plugin documentation in its source repository, then use that plugin's normal CI deployment. Do not hand-edit generated documentation here.

Six experimental projects are presented in Labs. Existing homepage `#plugin-*` links to those projects redirect to their matching Labs cards when JavaScript is enabled.

The site works without JavaScript; only inline video loading and legacy hash redirects use it. The YouTube player is loaded after an explicit click, with a normal Watch demo link as an alternative.

Footer links distinguish the official `@RogueParadigm` demo channel from Elys's existing personal playlist. Patreon is retired and must not be reintroduced into the storefront.
