import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from "firebase/firestore"
import { getAuth } from "firebase/auth";

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

const app = initializeApp(firebaseConfig)

// utils
const db = getFirestore(app);
console.log("db", db);
console.log("app", app);
const auth = getAuth();
// console.log("auth", auth);

// collection references


const usersCollection = getDocs(collection(db, "users"));
// const usersCollection = db.collection('users')
// const postsCollection = db.collection('posts')
// const commentsCollection = db.collection('comments')
// const likesCollection = db.collection('likes')

// export utils/refs
export {
  db,
  auth,
  usersCollection,
//   postsCollection,
//   commentsCollection,
//   likesCollection
}
