//setting all card blocks to not display, no I cant do this in css
const IDList = ["HealthCareCardSection","BenefitsCardSection","ParentLeaveCardSection","ChildcareCardSection","ImmigrantCardSectoion"];
IDList.forEach(id => {
    document.getElementById(id).style.display = "none";
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

        if (!wasSelected) {
            button.classList.add('selected');
            button.setAttribute('aria-pressed', 'true');
            document.getElementById("EmptyCardBox").style.display = "none";
            IDList.forEach(id => { //clears any existing blocks on button
                if (document.getElementById(id).style.display = "block"){
                    console.log("ID Block cleared: "+id);
                    document.getElementById(id).style.display = "none"
                }
            }); 
        }
    });
});

//button selection event to run func to display the cards
document.getElementById("HIButton").onclick = function() {ServiceSelectionEvent("HealthCareCardSection")};
document.getElementById("FAButton").onclick = function() {ServiceSelectionEvent("BenefitsCardSection")};
document.getElementById("PWButton").onclick = function() {ServiceSelectionEvent("ParentLeaveCardSection")};
document.getElementById("CEButton").onclick = function() {ServiceSelectionEvent("ChildcareCardSection")};
document.getElementById("ILSButton").onclick = function() {ServiceSelectionEvent("ImmigrantCardSectoion")};

//specific service selection
function ServiceSelectionEvent(id) {
    const serviceId = document.getElementById(id);
    console.log(serviceId);
    console.log("Before:"+serviceId.style.display);
    if (serviceId.style.display == '' || serviceId.style.display == 'none') {
        serviceId.style.display = "block";
    } else {
        serviceId.style.display = "none";
    }
    console.log("After:"+serviceId.style.display);
} 