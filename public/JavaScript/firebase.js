// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');



document.getElementById("logInButton").onclick = function() {firebase.auth()
  .signInWithPopup(provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // IdP data available in result.additionalUserInfo.profile.
      // ...
  }).catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });};