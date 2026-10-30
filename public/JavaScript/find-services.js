//setting all card blocks to not display, no I cant do this in css
// Hides resource sections with Bootstrap's d-none (display none) so their row layout is preserved
const IDList = ["HealthCareCardSection","BenefitsCardSection","ParentLeaveCardSection","ChildcareCardSection","ImmigrantCardSectoion"];
IDList.forEach(id => {
    document.getElementById(id).classList.add('d-none');
});

// Allows one category to be selected at a time
const categoryButtons = document.querySelectorAll('.category-button');

categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
        leaveSearchMode();
        const wasSelected = button.classList.contains('selected');     

        // Clears the previous selection
        categoryButtons.forEach((categoryButton) => {
            categoryButton.classList.remove('selected');
            categoryButton.setAttribute('aria-pressed', 'false');
            document.getElementById("EmptyCardBox").style.display = "block";
        });

        // Hides category sections before showing the selected one
        IDList.forEach(id => {
            document.getElementById(id).classList.add('d-none');
        });

        // Expands for a selection and restores the compact width when deselected
        document.getElementById('resourceResults').classList.toggle('showing-resources', !wasSelected);

        if (!wasSelected) {
            button.classList.add('selected');
            button.setAttribute('aria-pressed', 'true');
            document.getElementById("EmptyCardBox").style.display = "none";
        }
    });
});

//button selection event to run func to display the cards
//might be able to replace this with the onclick event in the button
//passing via onclick doesnt work on <a> tags, pain and suffering
// 'this' passes the clicked category button to the function
document.getElementById("HIButton").onclick = function() {ServiceSelectionEvent("HealthCareCardSection", this)};
document.getElementById("FAButton").onclick = function() {ServiceSelectionEvent("BenefitsCardSection", this)};
document.getElementById("PWButton").onclick = function() {ServiceSelectionEvent("ParentLeaveCardSection", this)};
document.getElementById("CEButton").onclick = function() {ServiceSelectionEvent("ChildcareCardSection", this)};
document.getElementById("ILSButton").onclick = function() {ServiceSelectionEvent("ImmigrantCardSectoion", this)};

//specific service selection
function ServiceSelectionEvent(id, button) {
    const serviceId = document.getElementById(id);
    // Keeps Bootstrap's row layout; a deselected category stays hidden and the page returns to the default starting screen
    if (button.classList.contains('selected')) {
        serviceId.classList.remove('d-none');
    }
} 

// Uses each card's JSON path so search stays in sync with the available resources to avoid hardcoding the paths in this script since the data-resource-file attribute is already used to load the cards from JSON
const resourceFiles = Array.from(
    document.querySelectorAll('[data-resource-file]')
).map((card) => card.dataset.resourceFile);

const searchInput = document.getElementById('resourceSearch');
const searchResultsRow = document.getElementById('searchResultsRow');
const searchFeedback = document.getElementById('searchFeedback');
const resourceResults = document.getElementById('resourceResults');
const emptyCardBox = document.getElementById('EmptyCardBox');

// Tracks the latest search so earlier requests can be ignored to help prevent results from being displayed after a new search is submitted
let searchRequest = 0;

// Saves card locations so category browsing can restore the original order to the page after a search moves them into one row
const resourceCards = Array.from(document.querySelectorAll('[data-resource-file]')).map((card) => ({
    card: card,
    parent: card.parentNode,
    nextSibling: card.nextSibling
}));

// Returns the same cards to their categories instead of creating copies so the search can be repeated without losing any cards
function restoreResourceCards() {
    resourceCards.forEach((resource) => {
        resource.parent.insertBefore(resource.card, resource.nextSibling);
    });
}

// Cancels pending search results and restores cards for category browsing to work properly
function leaveSearchMode() {
    searchRequest++;
    restoreResourceCards();
    searchInput.value = '';
    searchResultsRow.classList.add('d-none');
    searchFeedback.classList.add('d-none');
}

// Displays messages such as loading, no results, or search errors
function showSearchFeedback(title, text) {
    document.getElementById('searchFeedbackTitle').textContent = title;
    document.getElementById('searchFeedbackText').textContent = text;
    searchFeedback.classList.remove('d-none');
}


async function searchResources() {
    // Starts each search with the full set of cards and no category selected so results can be displayed together
    const query = searchInput.value.trim().toLowerCase();
    const request = ++searchRequest;
    restoreResourceCards();
    searchResultsRow.classList.add('d-none');
    searchFeedback.classList.add('d-none');
    categoryButtons.forEach((button) => {
        button.classList.remove('selected');
        button.setAttribute('aria-pressed', 'false');
    });
    IDList.forEach((id) => document.getElementById(id).classList.add('d-none'));
    resourceResults.classList.remove('showing-resources');
    emptyCardBox.style.display = query ? 'none' : 'block';

    // Empty searches return to the starting screen; fewer than three maybe two characters are too broad for the JSON search to be useful
    if (!query) {
        return;
    }
    if (query.length < 3) {
        showSearchFeedback('Please enter a longer search term', 'Try a more specific keyword or browse by category.');
        return;
    }
    showSearchFeedback('Searching resources...', '');

    // Searches resource names, organizations, and program details from JSON
    const fields = ['name', 'org', 'description', 'whatThisIs', 'whoItHelps', 'whatItHelps', 'whatToKnow'];

    // Searches the JSON files together and waits for all results before updating the cards
    const records = await Promise.all(resourceFiles.map(async (file) => {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error('Resource could not be loaded');
            }

            const data = await response.json();

            // Includes bullet-point text in the same case-insensitive keyword search
            const text = fields.map((field) => {
                const value = data[field];
                return Array.isArray(value) ? value.join(' ') : (typeof value === 'string' ? value : '');
            }).join(' ').toLowerCase();
            return { file: file, matches: text.includes(query) };
        } catch (error) {
            // Keeps one failed file from stopping the rest of the search
            return { file: file, failed: true };
        }
    }));

    // Ignore an older response if the visitor submits again or switches to a category.
    if (request !== searchRequest) {
        return;
    }

    const matches = records.filter((record) => record.matches);
    const failures = records.filter((record) => record.failed).length;
    searchFeedback.classList.add('d-none');

    // Moves matching resource cards into one row even if they belong to different categories for a nice search results layout
    resourceCards.forEach((resource) => {
        if (matches.some((record) => record.file === resource.card.dataset.resourceFile)) {
            searchResultsRow.appendChild(resource.card);
        }
    });

    // Displays matching cards or shows a message when no results are found
    if (searchResultsRow.children.length > 0) {
        searchResultsRow.classList.remove('d-none');
        resourceResults.classList.add('showing-resources');
    } else if (failures === resourceFiles.length) {
        showSearchFeedback('Search unavailable', 'Resources could not be loaded. Please try again or browse by category.');
    } else {
        showSearchFeedback('No resources found', 'Try another keyword or browse by category.');
    }

    // Warns when failed files may have left out matching resources on the user's end but should still show results if any were found
    if (failures > 0 && failures < resourceFiles.length) {
        const warning = 'Some resources could not be searched. Please try again or browse by category.';
        if (matches.length > 0) {
            showSearchFeedback('Search incomplete', warning);
        } else {
            showSearchFeedback('No resources found', 'Try another keyword or browse by category. ' + warning);
        }
    }
}

// Searches only on using Enter or the Search button, so typing leaves results unchanged
document.getElementById('resourceSearchForm').addEventListener('submit', (event) => {
    event.preventDefault();
    searchResources();
});

// Reads the category from the homepage URL and automatically selects its matching button
const params = new URLSearchParams(window.location.search);
const category = params.get('category');
categoryButtons.forEach((button) => {
    if (button.dataset.category === category) {
        button.click();
    }
});
