import firebase from 'firebase/app';
import 'firebase/storage'
import 'firebase/firestore'
var firebaseui = require('firebaseui');
import "firebaseui/dist/firebaseui.css";


// firebase init
// TODO replace with your own credential
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4_sP6-SXTgH6k2pKZZ6886wCUQWmxdjs",
  authDomain: "workshop-test-a283b.firebaseapp.com",
  projectId: "workshop-test-a283b",
  storageBucket: "workshop-test-a283b.appspot.com",
  messagingSenderId: "255232752718",
  appId: "1:255232752718:web:8de3bd33b16d03f810171f",
  measurementId: "G-JM9Z0LYD8G"
};

firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore()
const auth = firebase.auth()
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var storage = firebase.storage().ref();

// export utils/refs
export {
  db,
  auth,
  storage,
  ui,
  firebase
}