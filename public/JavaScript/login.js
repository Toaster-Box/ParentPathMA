const firebaseConfig = {
  apiKey: "AIzaSyD91M-LRrbRK4mo_ZyQtZRw4I0Y_zOmFmg",
  authDomain: "maparentpath.firebaseapp.com",
  projectId: "maparentpath",
  storageBucket: "maparentpath.firebasestorage.app",
  messagingSenderId: "894159735683",
  appId: "1:894159735683:web:7e066235040761637544b6",
  measurementId: "G-19DSPE1P5M"
};

// Initialize Firebase
var provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth()
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const authObserver = auth.onAuthStateChanged((user) => {
  if (user) {
    history.back();
  }
  else{
  }
})

document.getElementById("logInGoogleButton").onclick = function() {firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // IdP data available in result.additionalUserInfo.profile.
    history.back();
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    console.log("Error:" + errorCode + " " + errorMessage)
  });
};

//swaps login form for sign up form
document.getElementById("loginFormSwitch").onclick = function() {
  document.getElementById("loginForm").style.display = "none"
  document.getElementById("signUpForm").style.display = "block"
  document.getElementById("loginFormSwitch").style.display = "none"
}

//regester a new user
document.getElementById("signUpForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  firebase.auth().createUserWithEmailAndPassword(formProps.userid, formProps.password)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // IdP data available in result.additionalUserInfo.profile.
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    console.log("Error:" + errorCode + " " + errorMessage)
    
  });
});

//login an existing user
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formProps = Object.fromEntries(formData);
  firebase.auth().signInWithEmailAndPassword(formProps.userid, formProps.password)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // IdP data available in result.additionalUserInfo.profile.
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    console.log("Error:" + errorCode + " " + errorMessage)
  });
});