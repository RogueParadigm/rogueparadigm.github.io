// A user click is required before contacting YouTube or loading a player.
document.querySelectorAll('[data-video]').forEach(player => {
  player.querySelector('button')?.addEventListener('click', () => {
    const id = player.dataset.video;
    if (!/^[\w-]{11}$/.test(id)) return;
    const frame = document.createElement('iframe');
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    frame.title = `${document.querySelector('h1')?.textContent || 'Plugin'} gameplay demo`;
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    player.replaceChildren(frame);
    frame.focus();
  }, { once: true });
});

// Preserve shared links to projects that moved off the home page.
function redirectLegacyProject() {
  if ((location.pathname === '/' || location.pathname === '/index.html') &&
      /^#plugin-(mind|speak|impact|identity|chat|questflow)$/.test(location.hash)) {
    location.replace(`/labs.html${location.hash}`);
  }
}
redirectLegacyProject();
window.addEventListener('hashchange', redirectLegacyProject);

// Highlight the home page section in view (Games, Plugins) in the main navigation.
const homeSections = ['games', 'plugins'].map(id => document.getElementById(id)).filter(Boolean);
if (homeSections.length && 'IntersectionObserver' in window) {
  const links = new Map(homeSections.map(section => [section, document.querySelector(`.navigation nav a[href="/#${section.id}"]`)]));
  const visible = new Set();
  const update = () => {
    // The lowest section reaching the top of the screen is the one being read.
    const current = homeSections.filter(section => visible.has(section)).pop();
    links.forEach((link, section) => {
      if (!link) return;
      if (section === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    update();
  }, { rootMargin: '-110px 0px -55% 0px' });
  homeSections.forEach(section => observer.observe(section));
}
