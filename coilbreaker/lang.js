// Les anciens liens de langue utilisent ?lang=fr ou ?lang=en.
const url = new URL(location.href);
const requested = url.searchParams.get("lang");
if (["fr", "en"].includes(requested) && requested !== document.documentElement.lang) {
  const translated = new URL(requested === "fr" ? "fr.html" : "index.html", url);
  translated.search = url.search;
  translated.searchParams.delete("lang");
  translated.hash = url.hash === "#demo" ? "#roadmap" : url.hash;
  location.replace(translated);
} else if (url.hash === "#demo") {
  url.hash = "roadmap";
  location.replace(url);
}
