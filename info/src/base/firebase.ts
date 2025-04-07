// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoLvJFhbVF4QAoi_GWYkfs_H2q_vaK-Pw",
  authDomain: "notes-3e699.firebaseapp.com",
  projectId: "notes-3e699",
  storageBucket: "notes-3e699.firebasestorage.app",
  messagingSenderId: "494738259065",
  appId: "1:494738259065:web:3a57b5ff4d853cd66c28a8",
  measurementId: "G-WB1C7KRPQ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };