// Initialize Firebase
var provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const user = firebase.auth().currentUser;
if (user !== null){
	getUserInfo(user);
}

//detects when a user signs in or out
const authObserver = auth.onAuthStateChanged((user) => {
  if (user) {
    getUserInfo(user);
  }
  else{
	document.getElementById("logInButton").style.display = "block"
	document.getElementById("UserInfoDrop").style.display = "none"
  }
})


function getUserInfo(user){
	document.getElementById("logInButton").style.display = "none"
	document.getElementById("UserInfoDrop").style.display = "block"
    //document.getElementById("UserGreet").innerText = "Greetings,\n" + user.DisplayName;
}

document.getElementById("logOutButton").onclick = function() {
	firebase.auth().signOut().then(function() {
  	// Sign-out successful.
	}).catch(function(error) {
  	// An error happened.
	  console.log(error)
	});
}