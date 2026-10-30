// Loads resource details from JSON into the shared modal
// Displays JSON arrays as bullet points and keeps plain text together
function showResourceText(id, value) {
    const element = document.getElementById(id);
    element.replaceChildren();
    if (Array.isArray(value)) {
        const list = document.createElement('ul');
        value.forEach((text) => {
            const item = document.createElement('li');
            item.textContent = text;
            list.appendChild(item);
        });
        element.appendChild(list);
    } else {
        element.textContent = value || '';
    }
}

async function loadJSON(file) {
	try {
		const response = await fetch(file);
		if (!response.ok) {
			throw new Error("HTTP error " + response.status);
		}
	const resourceData = await response.json();
	
	// Replaces the shared modal content with the selected resource to avoid creating a separate modal for each resource and keeps the page size smaller
	document.getElementById("ResourceCategory").innerText = resourceData.category;
	document.getElementById("ResouceName").innerText = resourceData.name;
	document.getElementById("ResourceDesc").innerText = resourceData.description;
    document.getElementById('ResourceOrg').textContent = resourceData.org || '';
	showResourceText("UseCase", resourceData.whoItHelps);
	showResourceText("ResourceImportInfo", resourceData.whatToKnow);
	showResourceText("ProgramDesc", resourceData.whatThisIs);

	//Link to the resource
	document.getElementById("ResourceLink").href = resourceData.link;
	
    // Clears previous links and only shows entries supplied by the current resource 
    const relatedLinks = Array.isArray(resourceData.relatedLink) ? resourceData.relatedLink : [];
    const relatedLabels = Array.isArray(resourceData.relatedLinkExplanation) ? resourceData.relatedLinkExplanation : [];
    for (let i = 1; i <= 5; i++) {
        const link = document.getElementById('ResourceRelatedLink' + i);
        const label = document.getElementById('ResourceRelatedExplanation' + i);
        link.closest('li').style.display = 'none';
        link.removeAttribute('href');
        label.textContent = '';
        if (relatedLinks[i - 1]) {
            link.href = relatedLinks[i - 1];
            label.textContent = relatedLabels[i - 1] || 'Related resource';
            link.closest('li').style.display = 'block';
        }
    }
    // Hides the entire section when the resource has no related links
    document.getElementById('ResourceRelatedSection').hidden = relatedLinks.length === 0;

	//Updated date
	document.getElementById("ResourceLastUpdated").innerText = resourceData.lastUpdated;
    document.getElementById('ResourceUpdatedSection').hidden = !resourceData.lastUpdated;
	// Gives My ParentPath the resource details and a link to reopen this modal
	const saveButton = document.querySelector("#ResourceModal .save-resource-button");
	if (saveButton) {
		saveButton.dataset.id = file;
		saveButton.dataset.name = resourceData.name;
		saveButton.dataset.category = resourceData.categoryKey || "";
		saveButton.dataset.url = "/html/find-services.html?resource=" + encodeURIComponent(file);
	}

  }
  catch(err) {console.log(err.message)}
}

// Opens a saved resource directly from My ParentPath using its JSON file path
const requestedResource = new URLSearchParams(window.location.search).get("resource");

if (requestedResource &&
    requestedResource.startsWith("/JavaScript/JSON/") &&
    requestedResource.endsWith(".JSON")) {

    loadJSON(requestedResource);

    const resourceModal = document.getElementById("ResourceModal");
    if (resourceModal) {
        bootstrap.Modal.getOrCreateInstance(resourceModal).show();
    }
}