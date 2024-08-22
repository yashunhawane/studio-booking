// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtBvzN6vGXrZNOw8N927BEpPclCBkCN7A",
  authDomain: "studio-f1494.firebaseapp.com",
  projectId: "studio-f1494",
  storageBucket: "studio-f1494.appspot.com",
  messagingSenderId: "59128849459",
  appId: "1:59128849459:web:e0449ca0ab477201a3ef46",
  measurementId: "G-4V4EZP72BR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

const db = getFirestore(app);

export { db };
