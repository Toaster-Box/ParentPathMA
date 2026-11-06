// ParentPath checklist and saved resources
// Save Resource buttons work on any page that loads this file.
// The checklist and saved list only run on My ParentPath (checklist.html).
// Everything is saved in this browser only (nothing is sent anywhere).
//
// Save Resource button example:
// <button class="btn btn-outline-primary btn-sm save-resource-button" type="button" aria-pressed="false"
//     data-id="pfml" data-name="Massachusetts PFML" data-category="parental" data-url="pfml.html">
//     <i class="bi bi-bookmark" aria-hidden="true"></i> <span>Save Resource</span>
// </button>

const storageKey = 'parentPathTasks';
const savedKey = 'parentPathSaved';
const categoryNames = {
    healthcare: 'Healthcare & Health Insurance',
    benefits: 'Benefits & Financial Assistance',
    parental: 'Parental Leave & Workplace Support',
    childcare: 'Childcare & Education',
    immigrant: 'Immigrant & Language Services'
};
const defaultTasks = [
    { id: 'default1', text: 'Explore healthcare resources', category: 'healthcare', section: 'beforeBaby', done: false },
    { id: 'default2', text: 'Look into WIC nutrition programs', category: 'benefits', section: 'beforeBaby', done: false },
    { id: 'default3', text: 'Review parental leave information', category: 'parental', section: 'beforeBaby', done: false },
    { id: 'default4', text: 'Research childcare options', category: 'childcare', section: 'beforeBaby', done: false },
    { id: 'default5', text: 'Explore financial assistance programs', category: 'benefits', section: 'beforeBaby', done: false },
    { id: 'default6', text: 'Learn about newborn care resources', category: 'healthcare', section: 'beforeBaby', done: false },
    { id: 'default7', text: 'Apply for health insurance', category: 'healthcare', section: 'afterBaby', done: false },
    { id: 'default8', text: 'Attend 2-6 week checkup', category: 'healthcare', section: 'afterBaby', done: false },
    { id: 'default9', text: 'Explore childcare financial assistance', category: 'childcare', section: 'afterBaby', done: false },
    { id: 'default10', text: 'Review early education programs', category: 'childcare', section: 'afterBaby', done: false },
    { id: 'default11', text: 'Look into food assistance programs', category: 'benefits', section: 'afterBaby', done: false },
    { id: 'default12', text: 'Explore immigration and family support services', category: 'immigrant', section: 'afterBaby', done: false }
];

// Contact details for each resource. They show in the Saved Resources box on My ParentPath
// (and in the downloaded text file) once a resource has been saved.
//
// Each key is the resource's JSON file name in lower case, without ".json"
// (for example Doulav2.JSON -> doulav2, PT-1v2.JSON -> pt-1v2).
//
// Every field is optional, and only the ones that are filled in are shown, in this order:
//   phone, email, website, address, hours, note
//   phone:   { label, value, ext, kind }   kind: 'sms' makes it a text-message link; ext is an extension
//   email:   { label, value }
//   website: { label, url }
//   address: { label, value }
//   hours:   text, or a list of { label, value }
//   note:    text
// A resource that is not listed here simply has no Contact info button.

const resourceContacts = {
    doulav2: {
        phone: [
            { label: 'MassHealth Customer Service Center', value: '(800) 841-2900' },
            { label: 'TDD/TTY', value: '711' },
            { label: 'My Ombudsman, for questions about your MassHealth coverage', value: '855-781-9898' },
            { label: 'My Ombudsman videophone', value: '339-224-6831' }
        ],
        email: [{ label: 'My Ombudsman', value: 'atinfo@myombudsman.org' }],
        website: [{ label: 'MassHealth Doula Services Program', url: 'https://www.mass.gov/info-details/masshealth-doula-services-program-information-for-masshealth-members' }],
        note: 'Call the MassHealth Customer Service Center with questions about the Doula Services Program. For information about your MassHealth coverage, contact My Ombudsman.'
    },
    wicv2: {
        phone: [{ label: 'MA State WIC', value: '(800) 942-1007' }],
        email: [{ label: 'MA State WIC', value: 'wicinfo.dph@massmail.state.ma.us' }],
        website: [
            { label: 'WIC Nutrition Program', url: 'https://www.mass.gov/orgs/women-infants-children-nutrition-program' },
            { label: 'Find your local WIC office by zip code', url: 'https://www.mass.gov/orgs/women-infants-children-nutrition-program/locations' }
        ],
        note: 'It is recommended to call or email your local WIC office. You can search for it by zip code with the local office link above.'
    },
    'pt-1v2': {
        phone: [
            { label: 'MassHealth Customer Service Center', value: '1-800-841-2900' },
            { label: 'TTY', value: '1-800-497-4648' }
        ],
        website: [{ label: 'PT-1 pamphlet', url: 'https://www.mass.gov/media/7186/download' }],
        note: "PT-1 transportation is started by a healthcare provider, not through a standard self-referral application. Contact your provider's office to ask about the referral process."
    },
    freshtruckv2: {
        phone: [{ value: '617-297-7685' }],
        email: [{ value: 'Info@freshtruck.org' }],
        website: [{ label: 'Fresh Truck', url: 'https://www.freshtruck.org/' }]
    },
    sunbucksv2: {
        phone: [{ label: 'SUN Bucks hotline', value: '855-425-8770' }],
        website: [{ label: 'DTA Connect application overview', url: 'https://eohhs.ehs.state.ma.us/DTA/PolicyOnline/BEACON5/!SSL!/WebHelp/SUN_Bucks/SUNBucks_App.htm' }],
        note: 'SUN Bucks is run by the Department of Transitional Assistance (DTA). You can call the hotline with questions, but the application is completed through DTA Connect.'
    },
    satv2: {
        phone: [{ label: 'Solutions at Work', value: '617-576-0039', ext: '1' }],
        email: [{ label: 'Solutions at Work', value: 'contact@solutionsatwork.org' }],
        website: [{ label: 'Children’s Clothing Exchange', url: 'https://solutionsatwork.org/childrenclothingexchange/' }],
        hours: 'Tuesday, Wednesday, Thursday: 10:30am – 3:30pm'
    },
    wbvgb: {
        phone: [{ label: 'East Boston Social Center (EBSC)', value: '(617) 569-3221' }],
        email: [
            { label: 'Director of the East Boston Family Engagement Network (EBFEN)', value: 'gdevine@ebsoc.org' },
            { label: 'EBSC', value: 'info@ebsoc.org' }
        ],
        website: [
            { label: 'East Boston Family Engagement Network', url: 'https://www.ebsocialcenters.org/family-engagement-network' },
            { label: 'Application', url: 'https://a111439.socialsolutionsportal.com/apricot-intake/fc3f2dea-a08a-4b7e-aad3-a181fb1cf984' }
        ],
        note: 'Welcome Baby Visits & Gift is a benefit of the East Boston Social Center’s Family Engagement Network. You can contact the Social Center directly. The Engagement Network has no listed phone number, only an email for questions (the Director). After you fill out the application, the team will contact you directly.'
    },
    psgv2: {
        phone: [{ label: 'Postpartum Support International', value: '1.800.944.4773' }],
        website: [
            { label: 'English support groups', url: 'https://postpartum.net/get-help/psi-online-support-meetings/' },
            { label: 'Spanish-language support groups', url: 'https://postpartum.net/en-espanol/encuentros-de-apoyo-virtuales/' }
        ],
        note: 'The support groups do not have their own phone number. Call Postpartum Support International.'
    },
    hpiv2: {
        phone: [
            { label: 'Postpartum Support International. Press 1 for Español or 2 for English', value: '1.800.944.4773' },
            { label: 'Text in English', value: '800-944-4773', kind: 'sms' },
            { label: 'Text en Español', value: '971-203-7773', kind: 'sms' }
        ],
        website: [{ label: 'Help for moms', url: 'https://postpartum.net/get-help/help-for-moms/' }]
    },
    digitaldigest: {
        email: [{ value: 'admin@legalkeypartnership.org' }],
        website: [{ label: 'Digital Digest – Massachusetts', url: 'https://legalkeypartnership.org/digital-digest/ma/' }]
    },
    childcare: {
        phone: [
            { label: 'Mass 211', value: '2-1-1' },
            { label: 'Mass 211, toll-free', value: '877-211-6277' }
        ],
        website: [{ label: 'Mass 211 childcare help', url: 'https://mass211.org/childcare' }]
    },
    gblsv2: {
        phone: [
            { label: 'Main office', value: '617-371-1234' },
            { label: 'Main office, toll-free', value: '800-323-3205' },
            { label: 'Cambridge/Somerville', value: '617-603-2700' }
        ],
        website: [{ label: 'Greater Boston Legal Services', url: 'https://www.gbls.org/get-legal-help/our-services' }],
        address: [
            { label: 'Main office', value: '197 Friend Street, Boston, MA 02114' },
            { label: 'Cambridge/Somerville', value: '60 Gore Street, Suite 203, Cambridge, MA 02141' }
        ],
        note: 'Intake workers speak Cantonese, English, Haitian Creole, Mandarin, Portuguese, and Spanish.'
    },
    moiav2: {
        phone: [{ value: '617-635-2980' }],
        email: [
            { value: 'immigrantadvancement@boston.gov' },
            { value: 'LCA@boston.gov' }
        ],
        website: [
            { label: 'Mayor’s Office for Immigrant Advancement (MOIA)', url: 'https://www.boston.gov/departments/immigrant-advancement' },
            { label: 'Contact form', url: 'https://www.boston.gov/departments/immigrant-advancement/contact-mayors-office-immigrant-advancement' }
        ],
        note: 'If you need translation or interpretation services, two email addresses are provided. The office also has an intake contact form on its website.'
    },
    raftv2: {
        website: [{ label: 'Apply for RAFT', url: 'https://www.mass.gov/how-to/apply-for-raft-emergency-help-for-housing-costs' }]
    },
    heapv2: {
        website: [
            { label: 'Help paying your utility bill', url: 'https://www.mass.gov/info-details/help-paying-your-utility-bill' },
            { label: 'Apply (MassHEAP)', url: 'https://www.toapply.org/MassHEAP' }
        ]
    },
    firststeps: {
        website: [{ label: 'About FIRST Steps Together', url: 'https://www.mass.gov/info-details/about-first-steps-together' }]
    },
    kyrv2: {
        website: [{ label: 'Know Your Rights', url: 'https://miracoalition.org/resources/know-your-rights/' }]
    }
};

// Saved resources list, shared by the Save Resource buttons and My ParentPath
function getSaved() {
    try {
        const saved = JSON.parse(localStorage.getItem(savedKey));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function setSaved(saved) {
    try {
        localStorage.setItem(savedKey, JSON.stringify(saved));
    } catch (error) {
        // Storage blocked, nothing can be saved on this visit
    }
}

// Save Resource buttons
function showButtonState(button, isSaved) {
    // Skip buttons that are already correct, so updating them doesn't trigger the observer below again
    if (button.getAttribute('aria-pressed') === String(isSaved)) {
        return;
    }
    button.setAttribute('aria-pressed', isSaved);
    button.classList.toggle('active', isSaved);
    button.querySelector('i').className = isSaved ? 'bi bi-bookmark-fill' : 'bi bi-bookmark';
    button.querySelector('span').textContent = isSaved ? 'Saved' : 'Save Resource';
}

// Only allows normal page links (with or without ?query), so a saved link can never run code
function safeUrl(url) {
    try {
        const parsed = new URL(url, document.baseURI);
        if (['http:', 'https:', location.protocol].includes(parsed.protocol)) {
            return url;
        }
    } catch (error) {
        // Not a usable link
    }
    return '#';
}

// Contact details for a saved resource (from contacts.js), matched by the resource's JSON file name
function getContact(item) {
    if (typeof resourceContacts === 'undefined') {
        return null;
    }
    const key = String(item.id).split('/').pop().replace(/\.json$/i, '').toLowerCase();
    return resourceContacts[key] || null;
}

// Only the contact fields that are filled in, always in this order
const contactTitles = [['phone', 'Phone'], ['email', 'Email'], ['website', 'Website'], ['address', 'Address'], ['hours', 'Hours'], ['note', 'Note']];

function contactSections(contact) {
    return contactTitles.map(([field, title]) => {
        let entries = contact[field] || [];
        if (typeof entries === 'string') {
            entries = [{ value: entries }];
        }
        return { field, title, entries };
    }).filter((section) => section.entries.length > 0);
}

// One contact entry as plain text, used in the downloaded file
function contactEntryText(field, entry) {
    if (field === 'website') {
        return entry.label ? `${entry.url} (${entry.label})` : entry.url;
    }
    const value = field === 'phone' && entry.ext ? `${entry.value}, ext. ${entry.ext}` : entry.value;
    return entry.label ? `${value} (${entry.label})` : value;
}

// Shows Saved or Save Resource on every button, including cards added to the page later
function syncSaveButtons() {
    const savedIds = getSaved().map((item) => item.id);
    document.querySelectorAll('.save-resource-button').forEach((button) => {
        showButtonState(button, savedIds.includes(button.dataset.id));
    });
}

document.addEventListener('click', (event) => {
    const button = event.target.closest('.save-resource-button');
    if (!button) {
        return;
    }
    const saved = getSaved();
    const isSaved = saved.some((item) => item.id === button.dataset.id);

    if (isSaved) {
        setSaved(saved.filter((item) => item.id !== button.dataset.id));
    } else {
        saved.push({
            id: button.dataset.id,
            name: button.dataset.name,
            category: button.dataset.category,
            url: button.dataset.url
        });
        setSaved(saved);
    }
    syncSaveButtons();
});

// Cards added by JavaScript after the page loads (or buttons whose data-id is filled in later) get their state too
new MutationObserver(syncSaveButtons).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-id'] });
syncSaveButtons();

// Everything below only runs on My ParentPath
function startChecklist() {
    const lists = {
        beforeBaby: document.getElementById('beforeBabyTasks'),
        afterBaby: document.getElementById('afterBabyTasks')
    };
    const accordion = document.getElementById('checklistAccordion');
    const savedList = document.getElementById('savedList');
    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');
    const progressTrack = document.getElementById('progressTrack');
    const addTaskButton = document.getElementById('addTaskButton');
    const downloadTextButton = document.getElementById('downloadTextButton');
    const printButton = document.getElementById('printButton');
    const taskForm = document.getElementById('taskForm');
    const taskText = document.getElementById('taskText');
    const taskCategory = document.getElementById('taskCategory');
    const taskSection = document.getElementById('taskSection');
    const taskModalTitle = document.getElementById('taskModalTitle');
    const taskModalElement = document.getElementById('taskModal');
    const taskModal = new bootstrap.Modal(taskModalElement);

    let tasks = loadTasks();
    let editingId = null;

    function loadTasks() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey));
            if (Array.isArray(saved)) {
                return saved;
            }
        } catch (error) {
            // Nothing saved yet or storage blocked
        }
        return defaultTasks.map((task) => ({ ...task }));
    }

    function saveTasks() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(tasks));
        } catch (error) {
            // Storage blocked, the checklist still works for this visit
        }
    }

    // Keeps typed text from being read as HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function taskHtml(task) {
        return `
            <li class="list-group-item d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="task-${task.id}" data-id="${task.id}" ${task.done ? 'checked' : ''}>
                    <label class="form-check-label" for="task-${task.id}">${escapeHtml(task.text)}</label>
                </div>
                <div class="task-actions d-flex align-items-center gap-2">
                    <span class="badge badge-${task.category}">${escapeHtml(categoryNames[task.category])}</span>
                    <div class="dropdown d-print-none">
                        <button class="btn btn-sm btn-link text-muted" type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-label="Task options for ${escapeHtml(task.text)}">
                            <i class="bi bi-three-dots-vertical" aria-hidden="true"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><button class="dropdown-item" type="button" data-action="edit" data-id="${task.id}">Edit</button></li>
                            <li><button class="dropdown-item" type="button" data-action="remove" data-id="${task.id}">Remove</button></li>
                        </ul>
                    </div>
                </div>
            </li>`;
    }

    function renderTasks() {
        Object.keys(lists).forEach((section) => {
            const sectionTasks = tasks.filter((task) => task.section === section);
            lists[section].innerHTML = sectionTasks.length
                ? sectionTasks.map(taskHtml).join('')
                : '<li class="list-group-item text-body-secondary">No tasks here yet. Use Add Checklist Item to add one.</li>';
        });
        updateProgress();
    }

    function updateProgress() {
        const total = tasks.length;
        const done = tasks.filter((task) => task.done).length;
        const percent = total === 0 ? 0 : Math.round((done / total) * 100);

        progressText.textContent = `${done} of ${total} tasks completed`;
        progressBar.style.width = `${percent}%`;
        progressBar.textContent = `${percent}%`;
        progressTrack.setAttribute('aria-valuenow', percent);
    }

    // Check or uncheck a task
    accordion.addEventListener('change', (event) => {
        const box = event.target.closest('.form-check-input');
        if (!box) {
            return;
        }
        const task = tasks.find((item) => item.id === box.dataset.id);
        task.done = box.checked;
        saveTasks();
        updateProgress();
    });

    // Edit or remove a task from its menu
    accordion.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action]');
        if (!button) {
            return;
        }
        const task = tasks.find((item) => item.id === button.dataset.id);

        if (button.dataset.action === 'remove') {
            tasks = tasks.filter((item) => item.id !== task.id);
            saveTasks();
            renderTasks();
        } else {
            openModal(task);
        }
    });

    // Opens the window empty to add a task, or filled in to edit one
    function openModal(task) {
        editingId = task ? task.id : null;
        taskModalTitle.textContent = task ? 'Edit Checklist Item' : 'Add Checklist Item';
        taskText.value = task ? task.text : '';
        taskCategory.value = task ? task.category : 'healthcare';
        taskSection.value = task ? task.section : 'beforeBaby';
        taskModal.show();
    }

    // Builds a plain text copy of the checklist and saves it to the user's device
    function buildChecklistText() {
        const done = tasks.filter((task) => task.done).length;
        const percent = tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100);
        const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const sections = [['beforeBaby', 'BEFORE BABY'], ['afterBaby', 'AFTER BABY']];
        const lines = ['MY PARENTPATH CHECKLIST', `Saved on ${today}`, '', `Progress: ${done} of ${tasks.length} tasks completed (${percent}%)`];

        sections.forEach(([section, title]) => {
            lines.push('', title);
            const sectionTasks = tasks.filter((task) => task.section === section);
            if (sectionTasks.length === 0) {
                lines.push('(no tasks)');
            }
            sectionTasks.forEach((task) => {
                lines.push(`[${task.done ? 'x' : ' '}] ${task.text} (${categoryNames[task.category]})`);
            });
        });

        const saved = getSaved();
        lines.push('', 'SAVED RESOURCES');
        if (saved.length === 0) {
            lines.push('(none saved)');
        }
        saved.forEach((item) => {
            const label = categoryNames[item.category] ? ` (${categoryNames[item.category]})` : '';
            // Links are written out in full so they still work outside the website
            const url = safeUrl(item.url);
            const address = url === '#' ? '' : new URL(url, document.baseURI).href;
            const link = /^https?:/i.test(address) ? ` - ${address}` : '';
            lines.push(`- ${item.name}${label}${link}`);
            const contact = getContact(item);
            if (contact) {
                contactSections(contact).forEach((section) => {
                    section.entries.forEach((entry) => {
                        lines.push(`    ${section.title}: ${contactEntryText(section.field, entry)}`);
                    });
                });
            }
        });

        lines.push('', 'ParentPath is not an official government website.', 'Always check program details with the official source.');
        return lines.join('\r\n');
    }

    downloadTextButton.addEventListener('click', () => {
        const file = new Blob([buildChecklistText()], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = 'my-parentpath-checklist.txt';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
    });

    // Print dialog also lets the user choose Save as PDF
    printButton.addEventListener('click', () => {
        window.print();
    });

    addTaskButton.addEventListener('click', () => {
        openModal(null);
    });

    taskModalElement.addEventListener('shown.bs.modal', () => {
        taskText.focus();
    });

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const text = taskText.value.trim();
        if (text === '') {
            return;
        }

        if (editingId) {
            const task = tasks.find((item) => item.id === editingId);
            task.text = text;
            task.category = taskCategory.value;
            task.section = taskSection.value;
        } else {
            tasks.push({
                id: `custom${Date.now()}`,
                text: text,
                category: taskCategory.value,
                section: taskSection.value,
                done: false
            });
        }
        saveTasks();
        renderTasks();
        taskModal.hide();
    });

    // Saved resources (added with the Save Resource buttons on other pages)
    function renderSaved() {
        const saved = getSaved();
        if (saved.length === 0) {
            savedList.innerHTML = '<p class="saved-empty mb-0">No saved resources yet. Browse <a href="find-services.html">Find Services</a> and use Save Resource to bookmark them here.</p>';
            return;
        }
        savedList.innerHTML = saved.map((item) => {
            const contact = getContact(item);
            const contactId = `contact-${String(item.id).replace(/[^\w-]/g, '-')}`;
            return `
            <div class="list-group-item px-0 py-3">
                <div class="d-flex justify-content-between align-items-center gap-2">
                    <a class="saved-link text-decoration-none flex-grow-1" href="${escapeHtml(safeUrl(item.url))}">
                        <span class="d-block fw-semibold mb-1">${escapeHtml(item.name)}</span>
                        ${categoryNames[item.category] ? `<span class="badge badge-${item.category}">${escapeHtml(categoryNames[item.category])}</span>` : ''}
                    </a>
                    <button class="btn btn-sm btn-link text-muted d-print-none" type="button" data-remove-saved="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.name)} from saved resources">
                        <i class="bi bi-x-lg" aria-hidden="true"></i>
                    </button>
                </div>
                ${contact ? `
                <button class="btn btn-link btn-sm p-0 mt-2 contact-toggle d-print-none" type="button" data-bs-toggle="collapse" data-bs-target="#${contactId}" aria-expanded="false" aria-controls="${contactId}">
                    <i class="bi bi-telephone" aria-hidden="true"></i> Contact info
                </button>
                <div class="collapse saved-contact mt-2" id="${contactId}">${contactHtml(contact)}</div>` : ''}
            </div>`;
        }).join('');
    }

    // Contact details for one saved resource: Phone, Email, Website, Address, Hours, Note (only the ones filled in)
    function contactHtml(contact) {
        return contactSections(contact).map(({ field, title, entries }) => {
            if (field === 'note') {
                return `<div class="contact-row"><div class="contact-title">${title}</div><p class="contact-note mb-0">${escapeHtml(entries[0].value)}</p></div>`;
            }
            const items = entries.map((entry) => {
                const label = entry.label && field !== 'website' ? ` <span class="contact-label">(${escapeHtml(entry.label)})</span>` : '';
                let value;
                if (field === 'phone') {
                    const digits = entry.value.replace(/\D/g, '') + (entry.ext ? `,${entry.ext}` : '');
                    const shown = entry.ext ? `${entry.value}, ext. ${entry.ext}` : entry.value;
                    value = `<a href="${entry.kind === 'sms' ? 'sms' : 'tel'}:${escapeHtml(digits)}">${escapeHtml(shown)}</a>`;
                } else if (field === 'email') {
                    value = `<a href="mailto:${escapeHtml(entry.value)}">${escapeHtml(entry.value)}</a>`;
                } else if (field === 'website') {
                    value = `<a href="${escapeHtml(safeUrl(entry.url))}" target="_blank" rel="noopener">${escapeHtml(entry.label || entry.url)}</a>`;
                } else {
                    value = escapeHtml(entry.value);
                }
                return `<li>${value}${label}</li>`;
            }).join('');
            return `<div class="contact-row"><div class="contact-title">${title}</div><ul class="list-unstyled mb-0">${items}</ul></div>`;
        }).join('');
    }

    savedList.addEventListener('click', (event) => {
        const button = event.target.closest('[data-remove-saved]');
        if (!button) {
            return;
        }
        setSaved(getSaved().filter((item) => item.id !== button.dataset.removeSaved));
        renderSaved();
    });

    // Updates the list if a resource was saved in another tab
    window.addEventListener('storage', renderSaved);

    renderTasks();
    renderSaved();
}

if (document.getElementById('checklistAccordion')) {
    startChecklist();
}