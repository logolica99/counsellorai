// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCALwblgdGKCZ8jQjatsCKkFo2_LM6AgRM",
  authDomain: "counsellorai.firebaseapp.com",
  projectId: "counsellorai",
  storageBucket: "counsellorai.appspot.com",
  messagingSenderId: "637428853842",
  appId: "1:637428853842:web:31759a3950eb5ddeb8438b",
  measurementId: "G-4ML4B58Q1C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth,db };
