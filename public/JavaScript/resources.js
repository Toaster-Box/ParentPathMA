/* script to load resources info based on what is passed in the link 
Reads from a JSON file to create an object that is then parsed into the relevent page content
*/
async function loadJSON(file) {
	try {
		const response = await fetch(file);
		if (!response.ok) {
			throw new Error("HTTP error " + response.status);
		}
	const resourceData = await response.json();
	
	// Loading the Page Content
	
	//Left side of screen
	document.getElementById("ResourceCategory").innerText = resourceData.category;
	document.getElementById("ResouceName").innerText = resourceData.name;
	document.getElementById("ResourceDesc").innerText = resourceData.description;
	document.getElementById("UseCase").innerText = resourceData.whoItHelps;
	document.getElementById("ResourceImportInfo").innerText = resourceData.whatToKnow;
	document.getElementById("ProgramDesc").innerText = resourceData.whatThisIs;

	//Link to the resource
	document.getElementById("ResourceLink").href = resourceData.link;
	
	// Related information
	
	//do two for loops here one for content, other links, show block if it does exist
	for(let i = 0; i < resourceData.relatedLinkExplanation.length; i++){
		document.getElementById("ResourceRelatedExplanation"+(i+1)).innerText = resourceData.relatedLinkExplanation[i];
		document.getElementById("ResourceRelatedExplanation"+(i+1)).parentElement.style.display = "block";
	}
	for(let i = 0; i < resourceData.relatedLink.length; i++){
		document.getElementById("ResourceRelatedLink"+(i+1)).href = resourceData.relatedLink[i];
		document.getElementById("ResourceRelatedLink"+(i+1)).parentElement.style.display = "block";
	}

	//Updated date
	document.getElementById("ResourceLastUpdated").innerText = resourceData.lastUpdated;
	// Save Resource button (used by the My ParentPath checklist)
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

// Open a resource directly from a link such as find-services.html?resource=...
const requestedResource = new URLSearchParams(window.location.search).get("resource");
if (requestedResource && /^\/JavaScript\/[\w-]+\.JSON$/.test(requestedResource)) {
	loadJSON(requestedResource);
	const resourceModal = document.getElementById("ResourceModal");
	if (resourceModal) {
		bootstrap.Modal.getOrCreateInstance(resourceModal).show();
	}
}

