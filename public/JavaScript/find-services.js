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
    // Keeps Bootstrap's row layout; a deselected category stays hidden
    if (button.classList.contains('selected')) {
        serviceId.classList.remove('d-none');
    }
} 