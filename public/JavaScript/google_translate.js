function googleTranslateElementInit() {
    // Create the original Google Translate widget in the footer
    new google.translate.TranslateElement(
        { pageLanguage: 'en' },
        'google_translate_element'
    );

    const navbarLanguage = document.getElementById('navbarLanguage');
    const footer = document.getElementById('google_translate_element');

    if (!navbarLanguage || !footer) return;

    // Gets the Google Translate dropdown from the footer
    function getGoogleDropdown() {
        return footer.querySelector('.goog-te-combo');
    }

    // Copies the options from Google Translate's dropdown to the custom navbar dropdown
    function updateNavbar() {
        const googleDropdown = getGoogleDropdown();

        if (!googleDropdown || googleDropdown.options.length < 2) return;

        navbarLanguage.innerHTML = '';

        // Add English as the first option
        navbarLanguage.add(new Option('English', 'en'));

        // Adds all of the languages from the Google Translate widget to the navbar
        for (const option of googleDropdown.options) {
            if (option.value && option.value !== 'en') {
                navbarLanguage.add(new Option(option.text, option.value));
            }
        }

        navbarLanguage.value = googleDropdown.value || 'en';
        navbarLanguage.disabled = false;
    }

    // Change the website language when the navbar dropdown changes
    navbarLanguage.addEventListener('change', function () {
        const googleDropdown = getGoogleDropdown();

        if (!googleDropdown) return;

        const selectedLanguage = navbarLanguage.value;

        for (const option of googleDropdown.options) {
            if (option.value === selectedLanguage) {
                googleDropdown.value = selectedLanguage;
                googleDropdown.dispatchEvent(
                    new Event('change', { bubbles: true })
                );
                break;
            }
        }
    });

    // Update the navbar when the footer language changes
    footer.addEventListener('change', updateNavbar);

    // Purpose of MutationObserver here is to detect changes in the footer's dropdown and update the navbar
    const observer = new MutationObserver(updateNavbar);
    observer.observe(footer, {
        childList: true,
        subtree: true
    });

    updateNavbar();
}