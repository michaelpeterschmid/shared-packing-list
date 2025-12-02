// Import Firebase components
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXq9t6ExVKz-uCxTm8WKMGanPGbBXYKRk",
  authDomain: "listmates.firebaseapp.com",
  projectId: "listmates",
  storageBucket: "listmates.firebasestorage.app",
  messagingSenderId: "1073137847488",
  appId: "1:1073137847488:web:86bbfe20821a7081f5f125",
  measurementId: "G-YK5PRYJH42",
};

// Initialize Firebase App (Singleton)
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (Singleton)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
