import firebase from 'firebase/app';
import fbAuth from 'firebase/auth'
import 'firebase/firestore'
var firebaseui = require('firebaseui');
import "firebaseui/dist/firebaseui.css";


// firebase init
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
}

firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore()
const auth = firebase.auth()
var ui = new firebaseui.auth.AuthUI(firebase.auth());
const usersCollection = db.collection('users')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
  ui
}
