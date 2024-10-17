// language.js
document.addEventListener('DOMContentLoaded', function() {
    const defaultLanguage = 'en'; // Default language is English
    const savedLanguage = localStorage.getItem('language') || defaultLanguage;

    // Load the saved or default language
    loadLanguage(savedLanguage);
});

function loadLanguage(language) {
    fetch(`../Languages/${language}.json`)
    .then(response => response.json())
    .then(translations => {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
    });
}
