// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCnICYV0D8ZNQkEa5uSygm0sfvZ9bO2qow",
  authDomain: "date-planner-6a634.firebaseapp.com",
  projectId: "date-planner-6a634",
  storageBucket: "date-planner-6a634.firebasestorage.app",
  messagingSenderId: "26784930092",
  appId: "1:26784930092:web:438054afa45c416c8a3489",
  measurementId: "G-LDD0GQNK5D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
