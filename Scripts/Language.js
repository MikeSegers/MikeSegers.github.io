// Load selected language
async function loadLanguage(lang) {
	const response = await fetch(`../Languages/${lang}.json`);
	const translations = await response.json();
	document.querySelectorAll('[data-translate]').forEach(el => {
		const key = el.getAttribute('data-translate');
		el.textContent = translations[key];
	});
}
