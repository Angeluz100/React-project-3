import firebase from "firebase/app";
import 'firebase/auth';

const firebaseConfig = {
        apiKey: "AIzaSyBpFZbK00f65IXmR01AT99UAIM4p1HjLPc",
        authDomain: "dream-places.firebaseapp.com",
        projectId: "dream-places",
        storageBucket: "dream-places.appspot.com",
        messagingSenderId: "899080042815",
        appId: "1:899080042815:web:5c92fd36b8a400ee7afb8a"
    };

firebase.initializeApp(firebaseConfig);

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

function login() {
    auth.signInWithPopup(provider);
}

function logout() {
    auth.signOut();
}

export {
    auth,
    login,
    logout,
}