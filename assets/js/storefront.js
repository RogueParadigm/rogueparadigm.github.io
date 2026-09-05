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
