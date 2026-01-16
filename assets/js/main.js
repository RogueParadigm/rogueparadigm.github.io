// Rogue Paradigm - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
	const contactLink = document.getElementById('contactLink');
	if (!contactLink) return;

	const user = contactLink.getAttribute('data-user')?.trim();
	const domain = contactLink.getAttribute('data-domain')?.trim();

	if (!user || !domain || user === 'REPLACE_USER' || domain === 'REPLACE_DOMAIN') {
		contactLink.style.display = 'none';
		return;
	}

	const email = `${user}@${domain}`;
	contactLink.setAttribute('href', `mailto:${email}`);
	contactLink.setAttribute('aria-label', `Email: ${email}`);
});
