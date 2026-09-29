# Rogue Paradigm website

Static storefront at [rogueparadigm.com](https://rogueparadigm.com), alongside plugin documentation deployed by each plugin's CI.

## Edit the storefront

Product copy, status, links and page templates live in `assets/site/build.cjs`. Styles and progressive enhancement live in `assets/css/storefront.css` and `assets/js/storefront.js`.

```sh
node assets/site/build.cjs
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173`. Serve from this repository root because URLs are root-relative. Commit the generated root HTML pages alongside their source changes; GitHub Pages does not need a Node build at runtime.

The generator produces the homepage, five product pages, Documentation, Support, Labs and Legal Notices, plus a sitemap index and a storefront sitemap. It never writes inside the generated `Elys*/` documentation directories. Existing documentation URLs are preserved. Awareness's detailed framework presentation and the legal text are source templates in `assets/site/`; edit those templates rather than the generated root pages.

## Update a release

- Keep the product order: Music Engine, Listen, License Manager, Awareness, Persistent Music.
- Change a status in the product data, then regenerate all pages.
- Pending-publication products reserve the purchase position with a disabled `Buy on Fab` button (`Get free on Fab` for Persistent Music). Demo links sit in the card footer, separate from purchase and documentation actions. Play controls are only shown on real video players.
- When Listen is published, set its exact public `fab` listing URL and change its status/state to `Available on Fab` / `available`. Also update availability in the Listen documentation source.
- When Persistent Music is published, set its exact public `fab` URL and change its status/state to `Free · Available on Fab` / `available`. Update the availability note and installation steps here and remove the pending notice in the plugin documentation source. Never use a private publisher-portal URL as the public download link.
- Awareness is published; its public Fab link and playable Windows demo link are in the product data. Keep the detailed pipeline and example sections in `assets/site/awareness.html` when updating this page.
- Add a `video` YouTube ID to Music Engine only when its demo is available. The shared card footer and product-page player already support it.
- Check downloadable engine packages on Fab before changing compatibility claims. Documentation can cover a development version before the corresponding package is published.
- Update plugin documentation in its source repository, then use that plugin's normal CI deployment. Do not hand-edit generated documentation here.
- The root sitemap indexes the storefront sitemap and each existing plugin sitemap. Regenerate when adding a new documentation directory. Legal Notices retains its noindex policy and is excluded from the storefront sitemap.

Six experimental projects are presented in Labs. Existing homepage `#plugin-*` links to those projects redirect to their matching Labs cards when JavaScript is enabled.

The site works without JavaScript; only inline video loading and legacy hash redirects use it. The YouTube player is loaded after an explicit click, with a normal Watch demo link as an alternative.

Footer links distinguish the official `@RogueParadigm` demo channel from Elys's existing personal playlist. Patreon is retired and must not be reintroduced into the storefront.
