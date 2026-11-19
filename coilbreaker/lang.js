// Les anciens liens de langue utilisent ?lang=fr ou ?lang=en.
const url = new URL(location.href);
const requested = url.searchParams.get("lang");
const directory = url.pathname.endsWith("/");
const automatic = directory && !navigator.language.toLowerCase().startsWith("fr") ? "en" : null;
const language = ["fr", "en"].includes(requested) ? requested : automatic;
if (language && language !== document.documentElement.lang) {
  const translated = new URL(language === "en" ? "en.html" : "index.html", url);
  translated.search = url.search;
  translated.searchParams.delete("lang");
  translated.hash = url.hash === "#demo" ? "#roadmap" : url.hash;
  location.replace(translated);
} else if (url.hash === "#demo") {
  url.hash = "roadmap";
  location.replace(url);
}
